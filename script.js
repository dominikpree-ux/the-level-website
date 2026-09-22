const boot=document.getElementById('boot'), bar=document.getElementById('progress'), status=document.getElementById('bootStatus'), text=document.getElementById('bootText');
let p=0;
const timer=setInterval(()=>{p+=Math.floor(Math.random()*10)+5;if(p>=100){p=100;clearInterval(timer);setTimeout(()=>boot.classList.add('hide'),450)}bar.style.width=p+'%';status.textContent=`SYSTEM CHECK ${String(p).padStart(2,'0')}%`;text.textContent=p<35?'INITIALIZING NIGHTCLUB NETWORK...':p<70?'SCANNING SIGNAL...':p<100?'ACCESSING THE LƎVE⅃...':'ACCESS GRANTED';},90);

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const el=document.querySelector(a.getAttribute('href')); if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}
}));

const hero=document.querySelector('.hero');
hero.addEventListener('pointermove',e=>{
 const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
 document.querySelector('.cyber-sun').style.transform=`translate(${x*18}px,${y*12}px)`;
 document.querySelector('.hero-copy').style.transform=`translate(${x*-5}px,${y*-3}px)`;
});

// STAFF DIRECTORY + ADMIN AUTH
const STAFF_STORAGE_KEY = 'the_level_staff_v1'; // legacy fallback only
const staffRoleOrder = {
  'Owner': 1, 'Co-Owner': 2, 'Management': 3, 'Manager': 4, 'Event Manager': 5,
  'DJ': 6, 'Escort': 7, 'Bartender': 8, 'Hostess': 9, 'Dancer': 10, 'Security': 11,
  'Photographer': 12, 'Shouter': 13, 'Staff': 14
};

const supabaseClient = window.supabase && window.THE_LEVEL_SUPABASE_CONFIG?.url && window.THE_LEVEL_SUPABASE_CONFIG?.anonKey
  ? window.supabase.createClient(window.THE_LEVEL_SUPABASE_CONFIG.url, window.THE_LEVEL_SUPABASE_CONFIG.anonKey)
  : null;

let currentUser = null;
let currentIsAdmin = false;

function sortedStaff(list){
  return [...list].sort((a,b)=>{
    const ra=staffRoleOrder[a.role]??99, rb=staffRoleOrder[b.role]??99;
    return ra-rb || (a.name||'').localeCompare(b.name||'',undefined,{sensitivity:'base'});
  });
}
function escapeHtml(v=''){const d=document.createElement('div');d.textContent=v;return d.innerHTML}
function escapeAttr(v=''){return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

async function isAdmin(user){
  if(!supabaseClient || !user) return false;
  const {data,error}=await supabaseClient.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
  return !error && !!data;
}

async function loadStaff(){
  if(supabaseClient){
    const {data,error}=await supabaseClient.from('staff').select('*').order('sort_order',{ascending:true}).order('name',{ascending:true});
    if(!error && data) return sortedStaff(data);
  }
  // Local fallback keeps the design preview usable until Supabase is configured.
  try{return sortedStaff(JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY))||[])}catch{return []}
}

function renderStaff(staff){
  const grid=document.getElementById('staffGrid'), empty=document.getElementById('staffEmpty');
  const listEl=document.getElementById('staffManagerList'), count=document.getElementById('staffCount');
  if(!grid||!listEl)return;
  grid.innerHTML='';listEl.innerHTML='';empty.hidden=staff.length>0;
  count.textContent=`${staff.length} RECORDS`;
  staff.forEach((p,i)=>{
    const card=document.createElement('article');card.className='staff-card';
    card.innerHTML=`<div class="staff-photo"><span class="staff-role">${escapeHtml(p.role)}</span>${p.image?`<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}">`:''}</div><div class="staff-info"><h3 class="staff-name">${escapeHtml(p.name)}</h3><div class="staff-discord">DISCORD // ${escapeHtml(p.discord)}</div>${p.bio?`<p class="staff-bio">${escapeHtml(p.bio)}</p>`:''}</div><div class="staff-rank">RANK ${String(i+1).padStart(2,'0')}</div>`;
    grid.appendChild(card);
    if(currentIsAdmin){
      const row=document.createElement('div');row.className='manager-row';
      row.innerHTML=`${p.image?`<img src="${escapeAttr(p.image)}" alt="">`:'<div></div>'}<div><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.role)} // ${escapeHtml(p.discord)}</span></div><div class="manager-actions"><button class="mini-btn" data-edit="${p.id}">EDIT</button><button class="mini-btn delete" data-delete="${p.id}">DELETE</button></div>`;
      listEl.appendChild(row);
    }
  });
  listEl.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editStaff(b.dataset.edit));
  listEl.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteStaff(b.dataset.delete));
}

async function refreshStaff(){
  const staff=await loadStaff();
  renderStaff(staff);
  if(currentIsAdmin){
    document.getElementById('staffCount').textContent=`${staff.length} RECORDS // ADMIN`;
  }
}

const adminModal=document.getElementById('adminLoginModal');
const staffModal=document.getElementById('staffModal');
const adminMessage=document.getElementById('adminLoginMessage');

function showAdminMessage(msg){if(adminMessage)adminMessage.textContent=msg}
function openAdminLogin(){adminModal?.classList.add('open');adminModal?.setAttribute('aria-hidden','false');showAdminMessage('')}
function closeAdminLogin(){adminModal?.classList.remove('open');adminModal?.setAttribute('aria-hidden','true')}

document.getElementById('openAdminLogin')?.addEventListener('click',openAdminLogin);
document.querySelectorAll('[data-close-admin]').forEach(x=>x.addEventListener('click',closeAdminLogin));

document.getElementById('adminLoginForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!supabaseClient){showAdminMessage('SUPABASE IS NOT CONFIGURED YET.');return}
  showAdminMessage('AUTHENTICATING...');
  const email=document.getElementById('adminEmail').value.trim();
  const password=document.getElementById('adminPassword').value;
  const {data,error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){showAdminMessage('ACCESS DENIED // INVALID LOGIN');return}
  const admin=await isAdmin(data.user);
  if(!admin){
    await supabaseClient.auth.signOut();
    showAdminMessage('ACCESS DENIED // NOT AN AUTHORIZED ADMIN');
    return;
  }
  currentUser=data.user;currentIsAdmin=true;
  closeAdminLogin();
  staffModal.classList.add('open');staffModal.setAttribute('aria-hidden','false');
  await refreshStaff();
});

document.querySelectorAll('[data-close-staff]').forEach(x=>x.addEventListener('click',()=>{staffModal.classList.remove('open');staffModal.setAttribute('aria-hidden','true')}));

async function saveStaffToBackend(item){
  if(!supabaseClient||!currentIsAdmin)throw new Error('ADMIN_REQUIRED');
  const {error}=await supabaseClient.from('staff').upsert(item);
  if(error)throw error;
}
async function deleteStaff(id){
  if(!currentIsAdmin)return;
  if(!confirm('Remove this staff member?'))return;
  const {error}=await supabaseClient.from('staff').delete().eq('id',id);
  if(error){alert('Delete failed.');return}
  await refreshStaff();
}
async function editStaff(id){
  if(!currentIsAdmin)return;
  const staff=await loadStaff();const p=staff.find(x=>x.id===id);if(!p)return;
  document.getElementById('staffId').value=p.id;
  document.getElementById('staffImage').value=p.image||'';
  document.getElementById('staffRole').value=p.role||'Staff';
  document.getElementById('staffName').value=p.name||'';
  document.getElementById('staffDiscord').value=p.discord||'';
  document.getElementById('staffBio').value=p.bio||'';
  document.querySelector('.staff-manager')?.scrollTo({top:0,behavior:'smooth'});
}

document.getElementById('clearStaffForm')?.addEventListener('click',()=>{
  document.getElementById('staffForm')?.reset();
  document.getElementById('staffId').value='';
});

document.getElementById('staffImageFile')?.addEventListener('change',e=>{
  const file=e.target.files?.[0];if(!file)return;
  // For the starter build, use a local data URL. For production, upload this file to Supabase Storage.
  const reader=new FileReader();reader.onload=()=>document.getElementById('staffImage').value=reader.result;reader.readAsDataURL(file);
});

document.getElementById('staffForm')?.addEventListener('submit',async e=>{
  e.preventDefault();if(!currentIsAdmin)return;
  const role=document.getElementById('staffRole').value;
  const item={
    id:document.getElementById('staffId').value||crypto.randomUUID(),
    image:document.getElementById('staffImage').value.trim(),
    role,
    name:document.getElementById('staffName').value.trim(),
    discord:document.getElementById('staffDiscord').value.trim(),
    bio:document.getElementById('staffBio').value.trim(),
    sort_order:staffRoleOrder[role]??99
  };
  try{
    await saveStaffToBackend(item);
    e.target.reset();document.getElementById('staffId').value='';
    await refreshStaff();
  }catch(err){alert('Could not save staff member. Check Supabase/RLS configuration.')}
});

async function initAdmin(){
  if(supabaseClient){
    const {data}=await supabaseClient.auth.getSession();
    currentUser=data.session?.user||null;
    currentIsAdmin=await isAdmin(currentUser);
    supabaseClient.auth.onAuthStateChange(async(_event,session)=>{
      currentUser=session?.user||null;
      currentIsAdmin=await isAdmin(currentUser);
      await refreshStaff();
    });
  }
  await refreshStaff();
}
initAdmin();
