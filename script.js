/* ---------- Gallery (10 photos) — easy to replace ---------- */
const photos = [
  'gambar1.jpeg',
  'gambar2.jpeg',
  'gambar3.jpeg',
  'gambar4.jpeg',
  'gambar5.jpeg',
  'gambar6.jpeg',
  'gambar7.jpeg',
  'gambar8.jpeg',
  'gambar9.jpeg',
  'gambar10.jpeg'
];
const grid = document.getElementById('galleryGrid');
photos.forEach((src,i)=>{
  const d=document.createElement('div');d.className='g-item';
  d.innerHTML=`<img loading="lazy" src="${src}" alt="momen ${i+1}">`;
  grid.appendChild(d);
});

/* ---------- Countdown — change date here ---------- */
const target = new Date('2026-12-20T18:00:00').getTime();
function tick(){
  const now=Date.now();let diff=Math.max(0,target-now);
  const d=Math.floor(diff/86400000);diff-=d*86400000;
  const h=Math.floor(diff/3600000);diff-=h*3600000;
  const m=Math.floor(diff/60000);diff-=m*60000;
  const s=Math.floor(diff/1000);
  const pad=n=>String(n).padStart(2,'0');
  document.getElementById('cd-d').textContent=pad(d);
  document.getElementById('cd-h').textContent=pad(h);
  document.getElementById('cd-m').textContent=pad(m);
  document.getElementById('cd-s').textContent=pad(s);
}
tick();setInterval(tick,1000);

/* ---------- Reveal on scroll ---------- */
const io=new IntersectionObserver((es)=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ---------- Smooth nav ---------- */
document.querySelectorAll('[data-link]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const id=a.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

/* ---------- Open Invitation ---------- */
const openBtn=document.getElementById('openBtn');
const overlay=document.getElementById('openOverlay');
const bgm=document.getElementById('bgm');
const musicBtn=document.getElementById('musicBtn');
let allowPause=false;
openBtn.addEventListener('click',()=>{
  overlay.classList.add('hide');
  bgm.volume=0;
  bgm.play().then(()=>{
    musicBtn.classList.remove('paused');
    let v=0;const fade=setInterval(()=>{v=Math.min(.55,v+.03);bgm.volume=v;if(v>=.55)clearInterval(fade)},120);
  }).catch(()=>{});
  setTimeout(()=>{overlay.style.display='none'},500);
  setTimeout(()=>{
    autoScrollOn=false;
    paused=false;
    lastT=performance.now();
    allowPause=false;
    console.log('Starting auto scroll...');
    startAutoScroll();
    setTimeout(()=>{allowPause=true;console.log('Pause events enabled')},3000);
  },800);
});

/* ---------- Music toggle ---------- */
musicBtn.addEventListener('click',()=>{
  if(bgm.paused){bgm.play();musicBtn.classList.remove('paused')}
  else{bgm.pause();musicBtn.classList.add('paused')}
});

/* ---------- Video play ---------- */
const story=document.getElementById('story');
const playOverlay=document.getElementById('playOverlay');
playOverlay.addEventListener('click',()=>{
  story.play();playOverlay.style.opacity='0';setTimeout(()=>playOverlay.style.display='none',400);
  story.setAttribute('controls','');
});

/* ---------- Particles (gold sparks) ---------- */
const c=document.getElementById('particles');const ctx=c.getContext('2d');
let W,H,parts=[];
function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
function init(){
  const n=Math.min(70,Math.floor(W*H/22000));
  parts=Array.from({length:n},()=>({
    x:Math.random()*W,y:Math.random()*H,
    r:Math.random()*1.8+.4,
    s:Math.random()*.4+.1,
    a:Math.random()*Math.PI*2,
    o:Math.random()*.5+.2
  }));
}
init();window.addEventListener('resize',init);
function draw(){
  ctx.clearRect(0,0,W,H);
  for(const p of parts){
    p.y-=p.s;p.x+=Math.sin((p.y+p.a)*0.01)*0.3;
    if(p.y< -10){p.y=H+10;p.x=Math.random()*W}
    const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
    g.addColorStop(0,`rgba(245,217,138,${p.o})`);
    g.addColorStop(1,'rgba(245,217,138,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=`rgba(245,217,138,${Math.min(1,p.o+.2)})`;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

/* ---------- Floating petals ---------- */
for(let i=0;i<8;i++){
  const s=document.createElement('div');s.className='petal';s.textContent='✦';
  s.style.left=Math.random()*100+'vw';
  s.style.animationDuration=(18+Math.random()*22)+'s';
  s.style.animationDelay=(-Math.random()*20)+'s';
  s.style.fontSize=(10+Math.random()*10)+'px';
  document.body.appendChild(s);
}

/* ---------- Auto Scroll (cinematic, pause on touch) ---------- */
let autoScrollOn=false, paused=false, lastT=0;
const SPEED = 24; // px/sec
function startAutoScroll(){
  if(autoScrollOn) return;
  autoScrollOn=true;lastT=performance.now();
  const step=(t)=>{
    const dt=(t-lastT)/1000;lastT=t;
    if(!paused){
      const max=document.documentElement.scrollHeight-window.innerHeight;
      let y=window.scrollY+SPEED*dt;
      if(y>=max-1){
        paused=true;
        window.scrollTo({top:0,behavior:'smooth'});
        setTimeout(()=>{paused=false;lastT=performance.now()},2200);
      } else {
        window.scrollTo(0,y);
      }
    }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const pauseScroll=()=>{if(allowPause)paused=true};
let resumeTimer;
const resumeScrollSoon=()=>{if(allowPause){clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{paused=false;lastT=performance.now()},1200)}};
['touchstart','mousedown'].forEach(ev=>window.addEventListener(ev,pauseScroll,{passive:true}));
['touchend','touchcancel','mouseup'].forEach(ev=>window.addEventListener(ev,resumeScrollSoon,{passive:true}));
window.addEventListener('wheel',()=>{if(allowPause){paused=true;resumeScrollSoon()}},{passive:true});
