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
