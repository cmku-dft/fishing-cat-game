// Whisker Lake · the cat in the boat, moods, and drawing each frame
// ---------- fishing sprites ----------
// game mood -> which of the five drawn faces to show
const MOOD_SPRITE={calm:'focused', strain:'focused', excited:'excited', shocked:'excited', happy:'happy', sad:'sad', disgust:'tired', sleepy:'tired'};
const SPR_K=0.95;          // sprite px -> world px
const SPR_KEEL=34;         // keel sits this far below the boat frame origin (boat.y-14)
const SPR_HEAD=[14,-128];  // head centre relative to the anchor, sprite px (all five cats share the layout)
// optional sprite-sheet animations per cat (data/cats.js "anims"): idle, fight, catch, sleepy, shocked
function animFor(mood){
  const A=CATS[S.cat].anims; if(!A) return null;
  let a=null, t0=0;
  if(mood==='happy' && A.catch && moodOv.m==='happy' && t<moodOv.until){ a=A.catch; t0=moodOv.start||0; }
  else if((mood==='strain'||mood==='excited') && A.fight && hooked && !hooked.def.inert && !hooked.def.trash) a=A.fight;
  else if(mood==='calm' && A.idle) a=A.idle;
  else if(mood==='sleepy' && A.sleepy) a=A.sleepy;
  else if(mood==='shocked' && A.shocked) a=A.shocked;
  if(!a || !(a.img && a.img.complete && a.img.naturalWidth)) return null;
  const n=a.seq?a.seq.length:a.frames, k=Math.floor(Math.max(0,t-t0)*a.fps);
  const i=a.loop?k%n:Math.min(n-1,k), fr=a.seq?a.seq[i]:i;
  return {a,fr};
}
function sprFor(mood){
  const an=animFor(mood);
  if(an){ const a=an.a, tip=a.rodTips[an.fr]; return {img:a.img,sx:(an.fr%a.cols)*a.w,sy:Math.floor(an.fr/a.cols)*a.h,w:a.w,h:a.h,ax:a.anchor[0],ay:a.anchor[1],tx:tip[0],ty:tip[1],head:a.head||[0,0]}; }
  const p=CATS[S.cat].poses[MOOD_SPRITE[mood]||'focused']; return {img:p.img,sx:0,sy:0,w:p.w,h:p.h,ax:p.anchor[0],ay:p.anchor[1],tx:p.rodTip[0],ty:p.rodTip[1],head:[0,0]};
}
// rod tip in the boat frame for a cat facing left
function sprTip(mood){ const p=sprFor(mood); return [(p.tx-p.ax)*SPR_K, (p.ty-p.ay)*SPR_K+SPR_KEEL]; }
const INK='#2a1b14';
function heart(c,x,y,r,col){ c.fillStyle=col; c.beginPath(); c.moveTo(x,y+r); c.bezierCurveTo(x-r*2,y-r*.4,x-r*.8,y-r*2,x,y-r*.6); c.bezierCurveTo(x+r*.8,y-r*2,x+r*2,y-r*.4,x,y+r); c.fill(); }
// little mood effects around the head. (hx,hy) head centre in the boat frame, fr = side the cat faces (-1 left, 1 right)
function catFx(c,hx,hy,mood,tt,fr){
  c.save(); c.lineCap='round'; c.lineJoin='round'; c.textAlign='center';
  if(mood==='excited'){ const b=Math.sin(tt*10)*2; c.font='26px "Lilita One","Trebuchet MS",sans-serif'; c.lineWidth=4; c.strokeStyle='#5e3820'; c.strokeText('!',hx+fr*40,hy-30+b); c.fillStyle='#ffd23f'; c.fillText('!',hx+fr*40,hy-30+b); }
  if(mood==='strain'){ const y=hy-26+((tt*14)%10); const x=hx-fr*34; c.fillStyle='rgba(150,205,245,.95)'; c.beginPath(); c.moveTo(x,y-6); c.quadraticCurveTo(x+5,y+3,x,y+4); c.quadraticCurveTo(x-5,y+3,x,y-6); c.fill(); c.strokeStyle='#fff'; c.lineWidth=1; c.stroke(); }
  if(mood==='happy'){ for(let i=0;i<3;i++){ const a=tt*2+i*2.1; heart(c,hx+Math.cos(a)*40,hy-14+Math.sin(a)*18,5,'#ff6f8e'); } }
  if(mood==='disgust'){ c.strokeStyle='rgba(120,175,60,.9)'; c.lineWidth=2.4; for(let i=0;i<3;i++){ const x=hx-14+i*14, y=hy-40-((tt*14+i*6)%12); c.beginPath(); c.moveTo(x,y+9); c.quadraticCurveTo(x+4,y+4,x,y); c.quadraticCurveTo(x-4,y-4,x,y-9); c.stroke(); } }
  if(mood==='shocked'){ c.strokeStyle='#ffd23f'; c.lineWidth=2.6; for(let i=0;i<6;i++){ const a=-2.9+i*.5, r1=44, r2=58; c.beginPath(); c.moveTo(hx+Math.cos(a)*r1,hy+Math.sin(a)*r1); c.lineTo(hx+Math.cos(a)*r2,hy+Math.sin(a)*r2); c.stroke(); } }
  if(mood==='sleepy'){ c.font='16px "Lilita One",sans-serif'; for(let i=0;i<2;i++){ const p=(tt*.6+i*.5)%1; c.fillStyle='rgba(255,255,255,'+(1-p)+')'; c.fillText('z',hx+fr*14-fr*p*16,hy-34-p*22); } }
  if(mood==='sad'){ const y=hy+2+((tt*12)%16); const x=hx+fr*10; c.fillStyle='rgba(120,190,245,'+(1-((tt*12)%16)/16)+')'; c.beginPath(); c.moveTo(x,y-4); c.quadraticCurveTo(x+3,y+2,x,y+3); c.quadraticCurveTo(x-3,y+2,x,y-4); c.fill(); }
  c.restore();
}

// ---------- moods ----------
let moodOv={m:null,until:0}, idleT=0;
function setMood(m,sec){ moodOv={m,until:t+sec,start:t}; }
function currentMood(){
  if(S.mode==='over') return 'sad';
  if(attack || nearBear()) return 'shocked';
  if(hooked && fishes.some(f=>f.def.thief&&f.state==='chase'&&f.prey===hooked)) return 'shocked';
  if(t<moodOv.until) return moodOv.m;
  if(hooked){
    if(hooked.def.trash) return 'disgust';
    if(!hooked.def.inert && (tension>50 || (phase==='thrash' && keys.up))) return 'strain';
    return 'excited';
  }
  if(idleT>9) return 'sleepy';
  return 'calm';
}

// ---------- render ----------
function render(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.fillStyle='#0a2440'; ctx.fillRect(0,0,cv.width,cv.height);
  const L=cam.x, T=cam.y, R=cam.x+viewW, B=cam.y+viewH;

  if(T<0 && AREA.id!=='whisker') drawBackdrop(L,T);
  else if(T<0){
    // sky
    setCam(1);
    const g=ctx.createLinearGradient(0,-600,0,0); g.addColorStop(0,'#6fb7df'); g.addColorStop(.75,'#bfe0ea'); g.addColorStop(1,'#f5dfb2');
    ctx.fillStyle=g; ctx.fillRect(L-2,Math.min(T,-600),viewW+4,Math.max(600,-T)+2);
    // sun
    setCam(.05); ctx.fillStyle='rgba(255,236,170,.55)'; ellipse(ctx,cam.x*.05+viewW*.78,-170,46,46); ctx.fill(); ctx.fillStyle='#fff3c8'; ellipse(ctx,cam.x*.05+viewW*.78,-170,30,30); ctx.fill();
    // clouds
    setCam(.15); ctx.fillStyle='rgba(255,255,255,.85)';
    for(const cl of SCENERY.clouds){ const x=((cl.x+t*8)%(WORLD_W*.4+400))-200; [[0,0,40],[32,6,30],[-30,8,26],[10,-14,26]].forEach(([dx,dy,r])=>{ellipse(ctx,x+dx*cl.s,cl.y+dy*cl.s,r*cl.s,r*.75*cl.s);ctx.fill();}); }
    // hills
    setCam(.25); ctx.fillStyle='#7aa58a'; ctx.beginPath(); ctx.moveTo(-300,0);
    for(let x=-300;x<=WORLD_W*.4+viewW;x+=40) ctx.lineTo(x,-70-40*Math.sin(x*.004)-25*Math.sin(x*.011+2)); ctx.lineTo(WORLD_W*.4+viewW,0); ctx.fill();
    // far shore pines
    setCam(.45); ctx.fillStyle='#3d6b4f';
    ctx.fillRect(-300,-10,WORLD_W*.6+viewW,10);
    for(const p of SCENERY.pines){ const x=p.x*.6; if(x<cam.x*.45-60||x>cam.x*.45+viewW+60) continue; ctx.beginPath(); ctx.moveTo(x-p.h*.28,-6); ctx.lineTo(x,-6-p.h); ctx.lineTo(x+p.h*.28,-6); ctx.fill(); }
  }

  // water
  setCam(1);
  const wg=ctx.createLinearGradient(0,0,0,1600); const WC=AREA.water; wg.addColorStop(0,WC[0]); wg.addColorStop(.12,WC[1]); wg.addColorStop(.45,WC[2]); wg.addColorStop(1,WC[3]);
  ctx.fillStyle=wg; ctx.beginPath(); ctx.moveTo(L-10,1700);
  for(let x=L-10;x<=R+10;x+=12) ctx.lineTo(x,wave(x,t)); ctx.lineTo(R+10,1700); ctx.fill();
  // light rays
  if(!AREA.dark){ ctx.save(); ctx.globalCompositeOperation='lighter';
  for(let x=Math.floor(L/230)*230;x<R+230;x+=230){
    const a=.05+.035*Math.sin(t*.8+x*.01); const rg=ctx.createLinearGradient(0,0,0,640); rg.addColorStop(0,'rgba(200,240,255,'+a+')'); rg.addColorStop(1,'rgba(200,240,255,0)');
    ctx.fillStyle=rg; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+60,0); ctx.lineTo(x+150+Math.sin(t*.5+x)*20,640); ctx.lineTo(x+40,640); ctx.fill();
  }
  ctx.restore(); }

  {
    // distant ridge
    setCam(.8); ctx.fillStyle=hexA(AREA.water[3],.8); ctx.beginPath(); const l8=cam.x*.8-20;
    ctx.moveTo(l8,1700); for(let x=l8;x<=l8+viewW+40;x+=30) ctx.lineTo(x,Math.min(deepBed(x*1.3)-90-30*Math.sin(x*.007),bed(x/.8)+40)); ctx.lineTo(l8+viewW+40,1700); ctx.fill();
    setCam(1);
    // rocks
    for(const r of SCENERY.rocks){ if(r.x<L-60||r.x>R+60) continue; ctx.fillStyle=r.c; ellipse(ctx,r.x,bed(r.x)+4,r.r*1.3,r.r); ctx.fill(); }
    // seabed
    const sg=ctx.createLinearGradient(0,200,0,1650); sg.addColorStop(.0,'#c9b27a'); sg.addColorStop(0,AREA.bed[0]); sg.addColorStop(1,AREA.bed[1]);
    ctx.fillStyle=sg; ctx.beginPath(); ctx.moveTo(L-10,1800); for(let x=L-10;x<=R+10;x+=14) ctx.lineTo(x,bed(x)); ctx.lineTo(R+10,1800); ctx.fill();
    // weeds
    for(const w of SCENERY.weeds){ if(w.x<L-40||w.x>R+40) continue; const by=bed(w.x)+4; ctx.strokeStyle=w.c; ctx.lineWidth=w.w; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(w.x,by); ctx.quadraticCurveTo(w.x+Math.sin(t+w.ph)*16,by-w.h*.5,w.x+Math.sin(t*1.2+w.ph)*24,by-w.h); ctx.stroke(); }
    drawBedDeco(L,R);
  }
  setCam(1);

  // fish
  for(const f of fishes){
    const len=f.def.len*f.sz; if(f.x<L-150||f.x>R+150||f.y<T-100||f.y>B+100) continue;
    ctx.save(); ctx.translate(f.x,f.y);
    const o={fast:f.state!=='swim', jaw:f.state==='hunt'||f.state==='chase'?1:0, f, open:Math.max(0,Math.sin(t*.7+f.ph))**3, zap:f.def.id==='jelly'&&Math.sin(t*5+f.ph)>.9};
    if(f===hooked && f.heading!=null){ ctx.rotate(f.heading); if(Math.cos(f.heading)<0) ctx.scale(1,-1); o.fast=true; o.puff=true; drawFish(ctx,f.def,len,t+f.ph,o); }
    else { if(f===hooked){ ctx.rotate(Math.sin(t*3)*.15); o.open=0; } else ctx.scale(f.dir,1); drawFish(ctx,f.def,len,t+f.ph,o); }
    ctx.restore();
  }

  // particles under water
  for(const p of parts){ if(p.k!=='b') continue; ctx.strokeStyle='rgba(220,245,255,'+(.6*p.life/p.max)+')'; ctx.lineWidth=1; ellipse(ctx,p.x,p.y,p.r,p.r); ctx.stroke(); }

  // fishing line
  ctx.strokeStyle='rgba(250,250,240,.85)'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(boat.tipX,boat.tipY);
  const sag=hooked?0:Math.min(40,hook.y*.08+12);
  ctx.quadraticCurveTo((boat.tipX+hook.x)/2+(hooked?0:boat.facing*-10), (boat.tipY+hook.y)/2+sag, hook.x, hook.y-6); ctx.stroke();
  // hook + bait
  ctx.strokeStyle='#cfd6dc'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(hook.x,hook.y-7); ctx.lineTo(hook.x,hook.y+3); ctx.arc(hook.x-4,hook.y+3,4,0,Math.PI); ctx.stroke();
  if(!hooked){ ctx.fillStyle='#e88aa0'; ctx.beginPath(); ctx.ellipse(hook.x-1,hook.y+5,5,3,Math.sin(t*4)*.4,0,Math.PI*2); ctx.fill(); }
  // bobber at surface
  const bx=AREA.frozen?hook.x:hook.x+(boat.tipX-hook.x)*.12, byy=AREA.frozen?-8:wave(bx,t)-4;
  if(hook.y>20){ ctx.fillStyle='#d8433a'; ellipse(ctx,bx,byy,6,6); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(bx-6,byy-1,12,3); }

  drawSurfaceBack(L,R);
  if(typeof drawRockWalls==='function') drawRockWalls();
  drawBoat();

  // front water band over hull
  if(AREA.band){ ctx.fillStyle=AREA.band; ctx.beginPath(); ctx.moveTo(L-10,40);
  for(let x=L-10;x<=R+10;x+=12) ctx.lineTo(x,wave(x,t)); ctx.lineTo(R+10,40); ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2; ctx.beginPath(); for(let x=L-10;x<=R+10;x+=12) x===L-10?ctx.moveTo(x,wave(x,t)):ctx.lineTo(x,wave(x,t)); ctx.stroke(); }

  // splash
  for(const p of parts){ if(p.k!=='s') continue; ctx.fillStyle='rgba(230,248,255,'+(p.life/p.max)+')'; ellipse(ctx,p.x,p.y,p.r,p.r); ctx.fill(); }
  if(typeof drawFallingRocks==='function') drawFallingRocks();

  drawWeather();
  drawLighting();
  drawStillHint();
  if(attack) drawSharkWarning();
  const nb=nearBear(); if(nb) drawDanger(nb.x<boat.x?-1:1, nb.x<boat.x?'Bear! Row right  →':'←  Row left! Bear!', 'Bears guard the shallow water near the shore');
}
function drawSharkWarning(){
  ctx.setTransform(1,0,0,1,0,0);
  const s=scale*dpr, W=cv.width, H=cv.height, side=attack.x<boat.x?-1:1, a=.35+.25*Math.sin(t*10);
  const g = side<0 ? ctx.createLinearGradient(0,0,W*.22,0) : ctx.createLinearGradient(W,0,W*.78,0);
  g.addColorStop(0,'rgba(210,40,30,'+a+')'); g.addColorStop(1,'rgba(210,40,30,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const dist=Math.max(0,Math.hypot(attack.x-boat.x,attack.y-24)-78)/PX_PER_M, ty=H*.6;
  ctx.font=Math.round(24*s)+'px "Lilita One","Trebuchet MS",sans-serif'; ctx.textAlign='center';
  const txt = side<0 ? 'Shark! Row right  →' : '←  Row left! Shark!';
  ctx.lineWidth=5*s; ctx.strokeStyle='#5e3820'; ctx.strokeText(txt,W/2,ty); ctx.fillStyle='#fff'; ctx.fillText(txt,W/2,ty);
  ctx.font=Math.round(14*s)+'px "Nunito",sans-serif'; ctx.lineWidth=4*s; const t2=dist.toFixed(1)+' m away · shallow water near the shore is safe';
  ctx.strokeText(t2,W/2,ty+24*s); ctx.fillText(t2,W/2,ty+24*s);
}

function drawDetailedHull(front){
  ctx.save();
  ctx.lineJoin='round'; ctx.lineCap='round';
  if(!front){
    ctx.beginPath(); ctx.ellipse(0,-4,126,19,0,0,Math.PI*2);
    fs(ctx,'#6d3d22',2.2);
    ctx.beginPath(); ctx.ellipse(0,-4,116,13,0,0,Math.PI*2);
    fs(ctx,'#996039',1.3);
    ctx.strokeStyle='#c58a51'; ctx.lineWidth=3;
    for(const x of [-65,65]){ctx.beginPath();ctx.moveTo(x,-14);ctx.lineTo(x,6);ctx.stroke();}
  } else {
    const wood=ctx.createLinearGradient(0,-8,0,42);
    wood.addColorStop(0,'#bd814b'); wood.addColorStop(.45,'#966037'); wood.addColorStop(1,'#684025');
    ctx.beginPath();ctx.moveTo(-126,-6);ctx.quadraticCurveTo(0,22,126,-6);
    ctx.bezierCurveTo(119,22,112,37,94,40);ctx.quadraticCurveTo(0,49,-94,40);
    ctx.bezierCurveTo(-112,37,-119,22,-126,-6);ctx.closePath();fs(ctx,wood,2.4);
    ctx.save();ctx.clip();
    ctx.strokeStyle='#643c24';ctx.lineWidth=1.3;
    for(const y of [15,27,38]){ctx.beginPath();ctx.moveTo(-130,y-7);ctx.quadraticCurveTo(0,y+12,130,y-7);ctx.stroke();}
    ctx.strokeStyle='rgba(239,184,112,.45)';ctx.lineWidth=.8;
    for(const y of [17,29]){ctx.beginPath();ctx.moveTo(-115,y-7);ctx.quadraticCurveTo(0,y+10,115,y-7);ctx.stroke();}
    ctx.strokeStyle='#714629';
    for(const x of [-82,-30,36,86]){ctx.beginPath();ctx.moveTo(x,17);ctx.lineTo(x+3,30);ctx.stroke();}
    ctx.fillStyle='#3e2d23';
    for(const x of [-105,-74,74,105]){ctx.beginPath();ctx.arc(x,18,1.5,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    ctx.beginPath();ctx.moveTo(-126,-6);ctx.quadraticCurveTo(0,22,126,-6);
    ctx.strokeStyle='#4e2d1b';ctx.lineWidth=7;ctx.stroke();
    ctx.strokeStyle='#d79c60';ctx.lineWidth=3.5;ctx.stroke();
    ctx.strokeStyle='#d3b080';ctx.lineWidth=2;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(96+i*3,0);ctx.lineTo(99+i*3,13);ctx.stroke();}
  }
  ctx.restore();
}

function drawBoat(){
  const f=boat.facing, mood=currentMood(), p=sprFor(mood);
  const sink = S.mode==='over' ? Math.min(26,(t-overT)*22) : 0, shake = S.mode==='over' && t-overT<.6 ? Math.sin(t*70)*3 : 0;
  ctx.save(); ctx.translate(boat.x+shake,boat.y-14+sink); ctx.rotate(boat.tilt*.6+(S.mode==='over'?Math.min(.18,(t-overT)*.2)*-boat.facing:0));
  const hop = mood==='happy' ? -Math.abs(Math.sin(t*9))*3 : 0;
  const tug = hooked && !hooked.def.inert && phase==='thrash' ? Math.sin(t*38)*.8 : 0;
  const jx = (mood==='shocked'||mood==='strain') ? Math.sin(t*60)*.7 : 0;
  ctx.save(); ctx.scale(-f,1);            // the drawings face left; flip when rowing right
  ctx.translate(jx+tug, hop);
  drawDetailedHull(false);
  if(p.img.complete && p.img.naturalWidth){
    ctx.drawImage(p.img, p.sx, p.sy, p.w, p.h, -p.ax*SPR_K, SPR_KEEL-p.ay*SPR_K, p.w*SPR_K, p.h*SPR_K);
  }
  drawDetailedHull(true);
  ctx.restore();
  catFx(ctx, -f*(SPR_HEAD[0]+p.head[0])*SPR_K, SPR_KEEL+(SPR_HEAD[1]+p.head[1])*SPR_K+hop, mood, t, f);
  ctx.restore();
}

// ---------- loop ----------
let last=0;
function frame(now){
  const dt=Math.min(.05,(now-last)/1000||0); last=now;
  if(S.mode==='play') update(dt);
  else if(S.mode==='over') { t+=dt; boat.y=AREA.frozen?-24:wave(boat.x,t); updateFish(dt*.6); for(let i=parts.length-1;i>=0;i--){ const p=parts[i]; p.life-=dt; if(p.k==='leaf'){} else if(p.k==='b'){ p.y+=p.vy*dt; if(p.y<0) p.life=0; } else { p.vy+=600*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; } if(p.life<=0) parts.splice(i,1); } }
  else { t+=dt; boat.y=AREA.frozen?-24:wave(boat.x,t); }
  render();
  requestAnimationFrame(frame);
}
function resize(){
  dpr=Math.min(2,window.devicePixelRatio||1);
  const r=cv.getBoundingClientRect(); cv.width=Math.round(r.width*dpr); cv.height=Math.round(r.height*dpr);
  scale=Math.min(r.height/680, r.width/520); viewW=r.width/scale; viewH=r.height/scale;
}
window.addEventListener('resize',resize);
