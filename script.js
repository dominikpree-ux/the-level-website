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

// STAFF DIRECTORY
const STAFF_STORAGE_KEY = 'the_level_staff_v1';
const staffRoleOrder = {
  'Owner': 1, 'Co-Owner': 2, 'Management': 3, 'Manager': 4, 'Event Manager': 5,
  'DJ': 6, 'Bartender': 7, 'Hostess': 8, 'Dancer': 9, 'Security': 10,
  'Photographer': 11, 'Staff': 12
};
const defaultStaff = [];

function loadStaff(){
  try{return JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY)) || defaultStaff}
  catch{return defaultStaff}
}
function saveStaff(list){localStorage.setItem(STAFF_STORAGE_KEY,JSON.stringify(list))}
function sortedStaff(list){
  return [...list].sort((a,b)=>{
    const ra=staffRoleOrder[a.role]??99, rb=staffRoleOrder[b.role]??99;
    return ra-rb || a.name.localeCompare(b.name,undefined,{sensitivity:'base'});
  });
}
function escapeHtml(v=''){const d=document.createElement('div');d.textContent=v;return d.innerHTML}
function escapeAttr(v=''){return String(v).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function renderStaff(){
  const grid=document.getElementById('staffGrid'), empty=document.getElementById('staffEmpty');
  const listEl=document.getElementById('staffManagerList'), count=document.getElementById('staffCount');
  if(!grid||!listEl)return;
  const staff=sortedStaff(loadStaff());
  grid.innerHTML='';listEl.innerHTML='';empty.hidden=staff.length>0;
  count.textContent=`${staff.length} RECORDS`;
  staff.forEach((p,i)=>{
    const card=document.createElement('article');
    card.className='staff-card';
    card.innerHTML=`<div class="staff-photo"><span class="staff-role">${escapeHtml(p.role)}</span>${p.image?`<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}">`:''}</div><div class="staff-info"><h3 class="staff-name">${escapeHtml(p.name)}</h3><div class="staff-discord">DISCORD // ${escapeHtml(p.discord)}</div>${p.bio?`<p class="staff-bio">${escapeHtml(p.bio)}</p>`:''}</div><div class="staff-rank">RANK ${String(i+1).padStart(2,'0')}</div>`;
    grid.appendChild(card);
    const row=document.createElement('div');
    row.className='manager-row';
    row.innerHTML=`${p.image?`<img src="${escapeAttr(p.image)}" alt="">`:'<div></div>'}<div><strong>${escapeHtml(p.name)}</strong><span>${escapeHtml(p.role)} // ${escapeHtml(p.discord)}</span></div><div class="manager-actions"><button class="mini-btn" data-edit="${p.id}">EDIT</button><button class="mini-btn delete" data-delete="${p.id}">DELETE</button></div>`;
    listEl.appendChild(row);
  });
  listEl.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editStaff(b.dataset.edit));
  listEl.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteStaff(b.dataset.delete));
}

const staffModal=document.getElementById('staffModal');
const staffForm=document.getElementById('staffForm');
document.getElementById('openStaffManager')?.addEventListener('click',()=>{staffModal.classList.add('open');staffModal.setAttribute('aria-hidden','false');renderStaff()});
document.querySelectorAll('[data-close-staff]').forEach(x=>x.addEventListener('click',()=>{staffModal.classList.remove('open');staffModal.setAttribute('aria-hidden','true')}));
document.getElementById('clearStaffForm')?.addEventListener('click',()=>staffForm.reset());

document.getElementById('staffImageFile')?.addEventListener('change',e=>{
  const file=e.target.files?.[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{document.getElementById('staffImage').value=reader.result};
  reader.readAsDataURL(file);
});

staffForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const list=loadStaff();
  const id=document.getElementById('staffId').value||crypto.randomUUID();
  const item={
    id,
    image:document.getElementById('staffImage').value.trim(),
    role:document.getElementById('staffRole').value,
    name:document.getElementById('staffName').value.trim(),
    discord:document.getElementById('staffDiscord').value.trim(),
    bio:document.getElementById('staffBio').value.trim()
  };
  const idx=list.findIndex(x=>x.id===id);
  if(idx>=0)list[idx]=item;else list.push(item);
  saveStaff(list);
  staffForm.reset();
  document.getElementById('staffId').value='';
  renderStaff();
});

function editStaff(id){
  const p=loadStaff().find(x=>x.id===id);if(!p)return;
  document.getElementById('staffId').value=p.id;
  document.getElementById('staffImage').value=p.image?.startsWith('data:')?'':(p.image||'');
  document.getElementById('staffRole').value=p.role||'Staff';
  document.getElementById('staffName').value=p.name||'';
  document.getElementById('staffDiscord').value=p.discord||'';
  document.getElementById('staffBio').value=p.bio||'';
  document.querySelector('.staff-manager')?.scrollTo({top:0,behavior:'smooth'});
}
function deleteStaff(id){
  if(!confirm('Remove this staff member?'))return;
  saveStaff(loadStaff().filter(x=>x.id!==id));renderStaff();
}
renderStaff();
