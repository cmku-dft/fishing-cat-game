// Whisker Lake · The Frozen Lake: the cold.
// Stand still on the ice too long and your cat starts to freeze (frost creeps over the screen).
// Freezing makes rowing and reeling slower. Stay frozen solid too long and the cat passes out for 30 s.
// Row the boat around to warm up. Eelfur's thick mane keeps him warm: he never freezes.
// Loaded last (after rockfall.js). It wraps update(), currentMood(), drawBoat() and render().
const COLD = {
  stillBefore: 6,     // seconds without rowing before the cold starts
  fill: 14,           // seconds of standing still to go from no frost to frozen solid
  lineFactor: .5,     // reeling or dropping the line keeps you a bit warmer (cold builds at half speed)
  warm: 2.5,          // seconds of rowing to warm up completely
  solidFor: 5,        // seconds frozen solid before passing out
  out: 30,            // seconds passed out
  slowest: .45,       // speed left (rowing and reeling) when frozen solid
  immune: ['eelfur'],
};
const FZ = { cold:0, still:0, solid:0, outT:0, warned:false };
const freezeOn = () => AREA.frozen && S.mode==='play' && !COLD.immune.includes(CATS[S.cat].id);
const passedOut = () => FZ.outT>0;
function resetFreeze(){ FZ.cold=0; FZ.still=0; FZ.solid=0; FZ.outT=0; FZ.warned=false; }

function updateFreeze(dt){
  if(!freezeOn()){ if(!AREA.frozen || COLD.immune.includes(CATS[S.cat].id)) resetFreeze(); return; }
  if(FZ.outT>0){
    FZ.outT-=dt;
    if(FZ.outT<=0){ FZ.outT=0; FZ.cold=.45; FZ.still=0; FZ.solid=0; setMood('sad',1.5); toast(CATS[S.cat].name+' wakes up, shivering. Keep moving!',2.2); }
    return;
  }
  const rowing = (keys.left||keys.right) && Math.abs(boat.vx)>40;
  if(rowing){ FZ.still=0; FZ.cold=Math.max(0,FZ.cold-dt/COLD.warm); FZ.solid=0; }
  else{
    FZ.still+=dt;
    if(FZ.still>COLD.stillBefore) FZ.cold=Math.min(1,FZ.cold+dt/COLD.fill*((keys.up||keys.down)?COLD.lineFactor:1));
  }
  if(FZ.cold>.3 && !FZ.warned){ FZ.warned=true; toast('Brrr! '+CATS[S.cat].name+' is freezing. Row around to warm up!',2.4); }
  if(FZ.cold<.05) FZ.warned=false;
  if(FZ.cold>=1){
    FZ.solid+=dt;
    if(FZ.solid>=COLD.solidFor){
      FZ.outT=COLD.out; FZ.solid=0;
      if(hooked){ hooked.state='swim'; hooked.cool=4; hooked=null; tension=0; hook.offset=0; $('fight').hidden=true; }
      boat.vx=0; sfx.snap&&sfx.snap();
    }
  } else FZ.solid=0;
}

// slow everything down while freezing; no controls while passed out
const _updateNoCold = update;
update = function(dt){
  updateFreeze(dt);
  const slow = 1-(1-COLD.slowest)*FZ.cold, m=mods;
  if(FZ.cold>0) mods=Object.assign({},m,{boat:(m.boat||1)*slow, reel:(m.reel||1)*slow});
  let saved=null;
  if(passedOut()){ saved=Object.assign({},keys); for(const k in keys) keys[k]=false; }
  try{ _updateNoCold(dt); }
  finally{ mods=m; if(saved) Object.assign(keys,saved); }
};

const _moodNoCold = currentMood;
currentMood = function(){
  if(passedOut()) return 'sleepy';
  return _moodNoCold();
};

// icy tint on the cat (drawn over the sprite, same transform as drawBoat without the small shakes)
const tintCv=document.createElement('canvas'), tintCx=tintCv.getContext('2d');
const _drawBoatNoCold = drawBoat;
drawBoat = function(){
  _drawBoatNoCold();
  if(!AREA.frozen || FZ.cold<=.02) return;
  const f=boat.facing, p=sprFor(currentMood());
  if(!(p.img.complete && p.img.naturalWidth)) return;
  if(tintCv.width!==p.w||tintCv.height!==p.h){ tintCv.width=p.w; tintCv.height=p.h; }
  tintCx.globalCompositeOperation='source-over'; tintCx.clearRect(0,0,p.w,p.h);
  tintCx.drawImage(p.img,p.sx,p.sy,p.w,p.h,0,0,p.w,p.h);
  tintCx.globalCompositeOperation='source-atop';
  tintCx.fillStyle='rgba(120,195,250,'+(.2+.35*FZ.cold)+')'; tintCx.fillRect(0,0,p.w,p.h);
  // frost speckles on the fur
  tintCx.fillStyle='rgba(240,252,255,'+(.7*FZ.cold)+')';
  const rnd=seeded(7); for(let i=0;i<Math.round(90*FZ.cold);i++){ tintCx.fillRect(rnd()*p.w,rnd()*p.h,2,2); }
  ctx.save(); ctx.translate(boat.x,boat.y-14); ctx.rotate(boat.tilt*.6); ctx.scale(-f,1);
  ctx.globalAlpha=Math.min(1,FZ.cold*1.2);
  ctx.drawImage(tintCv,-p.ax*p.k, SPR_KEEL-p.ay*p.k, p.w*p.k, p.h*p.k);
  ctx.globalAlpha=1;
  drawDetailedHull(true);                      // keep the hull in front of the tinted legs
  if(p.front && p.front.complete && p.front.naturalWidth) ctx.drawImage(p.front,p.sx,p.sy,p.w,p.h,-p.ax*p.k,SPR_KEEL-p.ay*p.k,p.w*p.k,p.h*p.k);
  ctx.restore();
  // little icicles hanging from the boat rim
  if(FZ.cold>.5){
    const n=Math.round(6*(FZ.cold-.5)/.5+1), y0=boat.y-14+(-6);
    ctx.fillStyle='rgba(225,248,255,.85)';
    for(let i=0;i<n;i++){ const x=boat.x-100+i*(200/Math.max(1,n-1)), L=6+((i*37)%9)*FZ.cold;
      ctx.beginPath(); ctx.moveTo(x-3,y0+16); ctx.lineTo(x+3,y0+16); ctx.lineTo(x,y0+16+L); ctx.fill(); }
  }
};

// frost over the screen edges, like looking through a frozen window
const frostCv=document.createElement('canvas');
function buildFrost(W,H){
  frostCv.width=W; frostCv.height=H; const g=frostCv.getContext('2d'), rnd=seeded(11);
  const m=Math.min(W,H);
  const v=g.createRadialGradient(W/2,H/2,m*.25,W/2,H/2,Math.hypot(W,H)*.55);
  v.addColorStop(0,'rgba(200,240,255,0)'); v.addColorStop(.55,'rgba(190,235,250,.35)'); v.addColorStop(1,'rgba(235,252,255,.95)');
  g.fillStyle=v; g.fillRect(0,0,W,H);
  // frost crystals growing in from the edges
  g.strokeStyle='rgba(255,255,255,.75)'; g.lineCap='round';
  const branch=(x,y,a,len,w,d)=>{ if(d>4||len<4) return; const x2=x+Math.cos(a)*len, y2=y+Math.sin(a)*len;
    g.lineWidth=w; g.beginPath(); g.moveTo(x,y); g.lineTo(x2,y2); g.stroke();
    for(let k=1;k<=2;k++){ const tx=x+(x2-x)*k/3, ty=y+(y2-y)*k/3; branch(tx,ty,a+.9,len*.45,w*.6,d+1); branch(tx,ty,a-.9,len*.45,w*.6,d+1); }
    branch(x2,y2,a+(rnd()-.5)*.6,len*.6,w*.7,d+1); };
  for(let i=0;i<46;i++){
    const side=i%4, u=rnd();
    const [x,y,a]= side===0?[u*W,0,Math.PI/2]: side===1?[u*W,H,-Math.PI/2]: side===2?[0,u*H,0]:[W,u*H,Math.PI];
    branch(x,y,a+(rnd()-.5)*.9,m*(.06+rnd()*.08),2.2,0);
  }
  // blowing snow streaks
  g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1.2;
  for(let i=0;i<120;i++){ const x=rnd()*W, y=rnd()*H, L=m*(.01+rnd()*.03); g.beginPath(); g.moveTo(x,y); g.lineTo(x-L*.8,y+L*.5); g.stroke(); }
}
const _renderNoCold = render;
render = function(){
  _renderNoCold();
  if(!AREA.frozen || (FZ.cold<=.02 && !passedOut())) return;
  ctx.setTransform(1,0,0,1,0,0);
  const W=cv.width, H=cv.height, s=scale*dpr;
  if(frostCv.width!==W||frostCv.height!==H) buildFrost(W,H);
  const k=passedOut()?1:FZ.cold;
  ctx.fillStyle='rgba(120,200,240,'+(.18*k)+')'; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=Math.min(1,k*1.1); ctx.drawImage(frostCv,0,0); ctx.globalAlpha=1;
  ctx.textAlign='center';
  if(passedOut()){
    ctx.fillStyle='rgba(10,30,60,.45)'; ctx.fillRect(0,0,W,H);
    const ty=H*.55;
    ctx.font=Math.round(28*s)+'px "Lilita One","Trebuchet MS",sans-serif'; ctx.lineWidth=6*s; ctx.strokeStyle='#123a5c';
    const t1='Passed out from the cold!'; ctx.strokeText(t1,W/2,ty); ctx.fillStyle='#eaf8ff'; ctx.fillText(t1,W/2,ty);
    ctx.font=Math.round(46*s)+'px "Lilita One","Trebuchet MS",sans-serif';
    const t2=String(Math.ceil(FZ.outT)); ctx.strokeText(t2,W/2,ty+52*s); ctx.fillText(t2,W/2,ty+52*s);
    ctx.font=Math.round(14*s)+'px "Nunito",sans-serif'; ctx.lineWidth=4*s;
    const t3='Next time, row around now and then to stay warm'; ctx.strokeText(t3,W/2,ty+84*s); ctx.fillText(t3,W/2,ty+84*s);
    return;
  }
  // cold meter
  const bw=170*s, bh=10*s, bx=W/2-bw/2, by=H*.8;
  ctx.fillStyle='rgba(15,40,70,.55)'; ctx.fillRect(bx-3*s,by-3*s,bw+6*s,bh+6*s);
  const g=ctx.createLinearGradient(bx,0,bx+bw,0); g.addColorStop(0,'#bfefff'); g.addColorStop(1,'#4fb3ff');
  ctx.fillStyle=g; ctx.fillRect(bx,by,bw*FZ.cold,bh);
  if(FZ.cold>=1 && Math.sin(t*12)>0){ ctx.strokeStyle='#fff'; ctx.lineWidth=2*s; ctx.strokeRect(bx,by,bw,bh); }
  ctx.font=Math.round(14*s)+'px "Lilita One","Trebuchet MS",sans-serif'; ctx.lineWidth=4*s; ctx.strokeStyle='#123a5c'; ctx.fillStyle='#fff';
  const msg = FZ.cold>=1 ? 'Frozen solid! Row to warm up!' : 'Freezing… row around to warm up';
  ctx.strokeText(msg,W/2,by-8*s); ctx.fillText(msg,W/2,by-8*s);
};

// a fresh start whenever you travel or start a trip
const _travelNoCold = travel;
travel = function(...a){ resetFreeze(); return _travelNoCold(...a); };
