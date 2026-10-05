// Whisker Lake · scenery of each place, darkness and glow, danger warnings
// ---------- scenery for each place (seeded, so a place always looks the same) ----------
function makeScenery(i){
  const r=seeded(7+i*13), weeds=[], rocks=[], pines=[], clouds=[], trees=[], crystals=[], pads=[], reeds=[], peaks=[];
  const id=AREAS[i].id;
  const weedCols={whisker:['#2f7a4a','#3f8f3a'], maple:['#3d6b3a','#5a7a34'], cave:['#2b4a4a','#365a52'], frozen:['#3a5a50','#2f4a44'], ducky:['#3f8f3a','#5aa040'], guardian:['#3f9a5a','#5bb070']}[id];
  const weedGap={whisker:[50,120], maple:[90,200], cave:[400,700], frozen:[150,300], ducky:[30,80], guardian:[60,140]}[id];
  for(let x=40;x<WORLD_W;x+=weedGap[0]+r()*(weedGap[1]-weedGap[0])) weeds.push({x,h:r()*90+40,c:r()<.5?weedCols[0]:weedCols[1],w:r()*5+4,ph:r()*6});
  const rockGap = id==='maple'?[60,160]:id==='cave'?[50,140]:[120,380];
  for(let x=0;x<WORLD_W;x+=rockGap[0]+r()*(rockGap[1]-rockGap[0])) rocks.push({x,r:r()*30+16,c:id==='cave'?(r()<.5?'#2a2e36':'#33363e'):r()<.5?'#4c5560':'#5d5a52'});
  for(let x=-200;x<WORLD_W;x+=r()*30+18) pines.push({x,h:r()*45+35});
  for(let i2=0;i2<9;i2++) clouds.push({x:r()*WORLD_W,y:-r()*120-120,s:r()*.6+.7});
  for(let x=-200;x<WORLD_W;x+=r()*40+26) trees.push({x,h:r()*40+40,w:r()*16+26,c:r()});
  for(let x=-100;x<WORLD_W*.5+800;x+=r()*160+120) peaks.push({x,h:r()*150+150,w:r()*120+140});
  if(id==='cave'){
    for(let x=200;x<WORLD_W;x+=r()*260+160){ const onBed=r()<.55; crystals.push({x, y:onBed?null:-40-r()*200, r:r()*10+10, c:['#7ff7ff','#c79bff','#8affc8','#9cc8ff'][Math.floor(r()*4)], n:3+Math.floor(r()*3), bed:onBed}); }
  }
  if(id==='ducky'||id==='guardian') for(let x=120;x<WORLD_W;x+=r()*260+90) pads.push({x, r:r()*12+16, flower:r()<(id==='guardian'?.45:.2), rot:r()*6});
  if(id==='ducky') for(let x=60;x<WORLD_W;x+=r()*30+14){ if(x>900&&x<2700&&r()<.85) continue; reeds.push({x, h:r()*70+60, ph:r()*6}); }
  const s={weeds,rocks,pines,clouds,trees,crystals,pads,reeds,peaks, fallX:3220};
  return s;
}
let SCENERY=null;   // built by travel()
function hexA(hex,a){ const n=parseInt(hex.slice(1),16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; }

// above the water, for every place except Whiskers Lake (which keeps its original sky)
function drawBackdrop(L,T){
  const id=AREA.id, sky={maple:['#9cc2db','#d8e6ec','#eef0e6'], frozen:['#a9c7dd','#dfeaf2','#f4f8fb'], ducky:['#7cc6ec','#c5e8f2','#f2f6dc'], guardian:['#e9b6cc','#f8d4dc','#fde9cf']}[id];
  setCam(1);
  if(id==='cave'){
    const g=ctx.createLinearGradient(0,-700,0,0); g.addColorStop(0,'#05080d'); g.addColorStop(1,'#13212b');
    ctx.fillStyle=g; ctx.fillRect(L-2,Math.min(T,-700),viewW+4,Math.max(700,-T)+2);
    // back wall
    setCam(.5); ctx.fillStyle='#1a2733'; ctx.beginPath(); const l5=cam.x*.5-40; ctx.moveTo(l5,0);
    for(let x=l5;x<=l5+viewW+80;x+=50) ctx.lineTo(x,-120-60*Math.sin(x*.013)-40*Math.sin(x*.031+1)); ctx.lineTo(l5+viewW+80,0); ctx.fill();
    // ceiling with stalactites
    setCam(.75); ctx.fillStyle='#0b1118'; ctx.beginPath(); const l7=cam.x*.75-60; ctx.moveTo(l7,-900);
    for(let x=l7;x<=l7+viewW+120;x+=22){ const k=Math.sin(x*.07)*Math.sin(x*.013+2); ctx.lineTo(x,-330+(k>.3?k*170:k*30)-20*Math.sin(x*.05)); }
    ctx.lineTo(l7+viewW+120,-900); ctx.fill();
    setCam(1);
    // waterfall at the far end of the cave
    const fx=SCENERY.fallX; if(fx>L-200&&fx<L+viewW+200){
      const wg=ctx.createLinearGradient(fx-60,0,fx+60,0); wg.addColorStop(0,'rgba(140,220,255,0)'); wg.addColorStop(.2,'rgba(170,235,255,.75)'); wg.addColorStop(.8,'rgba(170,235,255,.75)'); wg.addColorStop(1,'rgba(140,220,255,0)');
      ctx.fillStyle=wg; ctx.fillRect(fx-60,-700,120,700);
      ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=2; for(let i=0;i<9;i++){ const x=fx-45+i*11, y0=((t*260+i*90)%700)-700; ctx.beginPath(); ctx.moveTo(x,y0); ctx.lineTo(x,y0+120); ctx.stroke(); }
      ctx.fillStyle='rgba(220,245,255,.35)'; for(let i=0;i<6;i++){ ellipse(ctx,fx+Math.sin(t*2+i)*50,-6-i*6,50+i*8,14); ctx.fill(); }
    }
    for(const cr of SCENERY.crystals) if(!cr.bed && cr.x>L-60 && cr.x<L+viewW+60) drawCrystal(cr.x,cr.y,cr);
    return;
  }
  const g=ctx.createLinearGradient(0,-600,0,0); g.addColorStop(0,sky[0]); g.addColorStop(.7,sky[1]); g.addColorStop(1,sky[2]);
  ctx.fillStyle=g; ctx.fillRect(L-2,Math.min(T,-600),viewW+4,Math.max(600,-T)+2);
  // sun
  setCam(.05); const sunC={maple:'#fff6dc',frozen:'#ffffff',ducky:'#fff3c8',guardian:'#fff1e0'}[id];
  ctx.fillStyle=hexA(sunC,.45); ellipse(ctx,cam.x*.05+viewW*.78,-180,48,48); ctx.fill(); ctx.fillStyle=sunC; ellipse(ctx,cam.x*.05+viewW*.78,-180,30,30); ctx.fill();
  if(id!=='frozen'){ setCam(.15); ctx.fillStyle=id==='guardian'?'rgba(255,240,245,.8)':'rgba(255,255,255,.85)';
    for(const cl of SCENERY.clouds){ const x=((cl.x+t*8)%(WORLD_W*.4+400))-200; [[0,0,40],[32,6,30],[-30,8,26],[10,-14,26]].forEach(([dx,dy,r])=>{ellipse(ctx,x+dx*cl.s,cl.y+dy*cl.s,r*cl.s,r*.75*cl.s);ctx.fill();}); } }
  // mountains far away
  if(id!=='ducky'){
    setCam(.18); const mc={maple:'#8aa0b0',frozen:'#9fb1c2',guardian:'#b49ab8'}[id];
    for(const p of SCENERY.peaks){ ctx.fillStyle=mc; ctx.beginPath(); ctx.moveTo(p.x-p.w,-20); ctx.lineTo(p.x,-20-p.h); ctx.lineTo(p.x+p.w,-20); ctx.fill();
      if(id!=='guardian'){ ctx.fillStyle='#f4f8fb'; ctx.beginPath(); ctx.moveTo(p.x-p.w*.32,-20-p.h*.68); ctx.lineTo(p.x,-20-p.h); ctx.lineTo(p.x+p.w*.32,-20-p.h*.68); ctx.lineTo(p.x+p.w*.12,-20-p.h*.6); ctx.lineTo(p.x-p.w*.05,-20-p.h*.7); ctx.fill(); } }
  }
  // rolling hills
  setCam(.28); ctx.fillStyle={maple:'#5f8a6a',frozen:'#dfe9f0',ducky:'#8cc36a',guardian:'#7fb08a'}[id]; ctx.beginPath(); ctx.moveTo(-300,0);
  for(let x=-300;x<=WORLD_W*.4+viewW;x+=40) ctx.lineTo(x,-60-35*Math.sin(x*.004+1)-22*Math.sin(x*.011+2)); ctx.lineTo(WORLD_W*.4+viewW,0); ctx.fill();
  // far shore
  setCam(.45); const k45=cam.x*.45, inView=x=>x>k45-80&&x<k45+viewW+80;
  ctx.fillStyle={maple:'#4f6f45',frozen:'#eef4f8',ducky:'#6faa4a',guardian:'#5f9a64'}[id]; ctx.fillRect(-300,-10,WORLD_W*.6+viewW,10);
  if(id==='ducky'){ // wooden footbridge over the stream
    const bx=900; if(inView(bx)){ ctx.strokeStyle='#7a5232'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(bx-110,-8); ctx.quadraticCurveTo(bx,-60,bx+110,-8); ctx.stroke();
      ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(bx-110,-26); ctx.quadraticCurveTo(bx,-84,bx+110,-26); ctx.stroke();
      for(let i=-4;i<=4;i++){ const x=bx+i*24, y=-8-52*(1-(i/4.6)**2); ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-20); ctx.stroke(); } } }
  for(const p of SCENERY.trees){ const x=p.x*.6; if(!inView(x)) continue;
    if(id==='frozen'||(id==='maple'&&p.c<.35)){ // pines (snowy on the frozen lake)
      ctx.fillStyle='#2f5a46'; ctx.beginPath(); ctx.moveTo(x-p.h*.3,-6); ctx.lineTo(x,-6-p.h*1.15); ctx.lineTo(x+p.h*.3,-6); ctx.fill();
      if(id==='frozen'){ ctx.fillStyle='#f6fafc'; for(const f of [.35,.62,.86]){ const y=-6-p.h*1.15*f, w=p.h*.3*(1-f)+4; ctx.beginPath(); ctx.moveTo(x-w,y+8); ctx.lineTo(x,y-4); ctx.lineTo(x+w,y+8); ctx.quadraticCurveTo(x,y+3,x-w,y+8); ctx.fill(); } }
      continue; }
    const cols = id==='maple'?['#d2462c','#e8782f','#f0a53a','#b8342a']: id==='guardian'?['#f4b6c8','#f8c9d6','#eea2b8','#fbd9e2']:['#5d9a46','#4f8a3c','#79b056','#6aa44e'];
    ctx.fillStyle='#4a3424'; ctx.fillRect(x-2,-6-p.h*.45,4,p.h*.45);
    ctx.fillStyle=cols[Math.floor(p.c*4)]; for(const [dx,dy,rr] of [[0,-.75,.5],[-.35,-.55,.38],[.35,-.58,.38],[0,-1,.36]]){ ellipse(ctx,x+dx*p.w,-6+dy*p.h,rr*p.w,rr*p.w*.8); ctx.fill(); }
  }
  if(id==='guardian'){ // the little island with its old blossom tree
    setCam(.35); const ix=1300; if(ix>cam.x*.35-200&&ix<cam.x*.35+viewW+200){
      ctx.fillStyle='#5f8f5a'; ellipse(ctx,ix,-4,110,22); ctx.fill(); ctx.fillStyle='#4a3424'; ctx.fillRect(ix-5,-70,10,60);
      const gl=ctx.createRadialGradient(ix,-90,10,ix,-90,110); gl.addColorStop(0,'rgba(255,240,250,.6)'); gl.addColorStop(1,'rgba(255,240,250,0)'); ctx.fillStyle=gl; ellipse(ctx,ix,-90,110,110); ctx.fill();
      ctx.fillStyle='#f2a8c0'; for(const [dx,dy,rr] of [[0,-95,40],[-34,-80,30],[34,-82,30],[0,-120,28]]){ ellipse(ctx,ix+dx,dy,rr,rr*.8); ctx.fill(); } } }
  setCam(1);
  if(id==='ducky'){ // reeds and cattails near both banks
    for(const rd of SCENERY.reeds){ if(rd.x<L-30||rd.x>L+viewW+30) continue; const sw=Math.sin(t*1.3+rd.ph)*4;
      ctx.strokeStyle='#4f8a3a'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(rd.x,6); ctx.quadraticCurveTo(rd.x+sw*.5,-rd.h*.5,rd.x+sw,-rd.h); ctx.stroke();
      if(rd.ph>2.5){ ctx.fillStyle='#6b4226'; ellipse(ctx,rd.x+sw,-rd.h+10,3.5,11); ctx.fill(); } }
  }
}
function drawCrystal(x,y,cr){
  for(let i=0;i<cr.n;i++){ const a=-.5+i*(1/Math.max(1,cr.n-1)), h=cr.r*(1.6+((i*7)%3)*.5), w=cr.r*.45;
    ctx.save(); ctx.translate(x+(i-cr.n/2)*cr.r*.5,y); ctx.rotate(a*.9);
    ctx.beginPath(); ctx.moveTo(-w,0); ctx.lineTo(-w,-h*.75); ctx.lineTo(0,-h); ctx.lineTo(w,-h*.75); ctx.lineTo(w,0); ctx.closePath();
    ctx.fillStyle=hexA(cr.c,.85); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=1.2; ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.35)'; ctx.fillRect(-w*.6,-h*.7,w*.4,h*.6); ctx.restore(); }
}
// things on the lake floor (cave crystals and dens)
function drawBedDeco(L,R){
  for(const cr of SCENERY.crystals) if(cr.bed && cr.x>L-60 && cr.x<R+60) drawCrystal(cr.x,bed(cr.x)+6,cr);
  if(AS.holes) for(const h of AS.holes){ if(h.x<L-80||h.x>R+80) continue;
    ctx.fillStyle='#2b2f37'; ellipse(ctx,h.x,h.y+8,44,28); ctx.fill(); ctx.fillStyle='#363b45'; ellipse(ctx,h.x-h.dir*10,h.y,28,20); ctx.fill();
    ctx.fillStyle='#030406'; ellipse(ctx,h.x+h.dir*14,h.y+2,15,12); ctx.fill();
    ctx.fillStyle='rgba(120,255,220,.8)'; for(let i=0;i<5;i++){ ellipse(ctx,h.x+h.dir*14+Math.cos(i*1.3)*17,h.y+2+Math.sin(i*1.3)*13,1.6,1.6); ctx.fill(); }
    const f=h.occ; if(f && f.state==='den' && Math.sin(t*1.7+h.x)>-.7){ ctx.fillStyle='#fff7c0'; ellipse(ctx,h.x+h.dir*16,h.y,2,2); ctx.fill(); ellipse(ctx,h.x+h.dir*10,h.y,2,2); ctx.fill(); }
  }
}
// on the surface, drawn before the boat
function drawSurfaceBack(L,R){
  for(const p of SCENERY.pads){ if(p.x<L-40||p.x>R+40) continue; const y=wave(p.x,t)+1;
    ctx.save(); ctx.translate(p.x,y); ctx.fillStyle='#4f8f3e'; ctx.beginPath(); ctx.ellipse(0,0,p.r,p.r*.28,0,.25,Math.PI*2-.05); ctx.lineTo(0,0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#3b6f2e'; ctx.lineWidth=1.2; ctx.stroke();
    if(p.flower){ ctx.fillStyle=AREA.id==='guardian'?'#f7b2c8':'#fff4f8'; for(let i=0;i<5;i++){ ellipse(ctx,-4+i*2,-5-Math.abs(i-2)*1.5,3,5); ctx.fill(); } ctx.fillStyle='#f6d35a'; ellipse(ctx,0,-4,2,2); ctx.fill(); }
    ctx.restore(); }
  for(const p of parts) if(p.k==='leaf'){ ctx.save(); ctx.translate(p.x,wave(p.x,t)); ctx.rotate(p.rot); ctx.fillStyle=p.c; ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(0,-5); ctx.lineTo(6,0); ctx.lineTo(0,4); ctx.closePath(); ctx.fill(); ctx.restore(); }
  if(AS.bears) for(const b of AS.bears) if(b.x>L-150&&b.x<R+150) drawBear(b);
  if(AREA.frozen) drawIce(L,R);
}
function drawIce(L,R){
  const g=ctx.createLinearGradient(0,-8,0,22); g.addColorStop(0,'#f8fcff'); g.addColorStop(.35,'#d8edf6'); g.addColorStop(1,'#a9cfe0');
  ctx.fillStyle=g; ctx.fillRect(L-10,-8,R-L+20,30);
  ctx.strokeStyle='rgba(120,170,195,.6)'; ctx.lineWidth=1;
  for(let x=Math.floor(L/170)*170;x<R+170;x+=170){ ctx.beginPath(); ctx.moveTo(x,-6); ctx.lineTo(x+18,6); ctx.lineTo(x+8,20); ctx.moveTo(x+18,6); ctx.lineTo(x+44,12); ctx.stroke(); }
  ctx.fillStyle='#ffffff'; for(let x=Math.floor(L/90)*90;x<R+90;x+=90){ ellipse(ctx,x+30,-8,26,4); ctx.fill(); }
  for(const h of AS.ice){ if(h.x<L-40||h.x>R+40) continue;
    const wg=ctx.createLinearGradient(0,-6,0,22); wg.addColorStop(0,'#2d6d8c'); wg.addColorStop(1,AREA.water[0]);
    ctx.fillStyle=wg; ctx.fillRect(h.x-22,-4,44,26); ctx.fillStyle='#1d4f6a'; ellipse(ctx,h.x,-5,23,5); ctx.fill();
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.ellipse(h.x,-5,24,5.5,0,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#f4fbff'; for(let i=0;i<6;i++){ ellipse(ctx,h.x-30+i*12,-9+((i*5)%3),4,2.5); ctx.fill(); } }
  if(iceSmash){ const p=Math.min(1,iceSmash.p/1.1); ctx.strokeStyle='rgba(60,110,140,.85)'; ctx.lineWidth=1.6;
    for(let i=0;i<7;i++){ const a=i/7*Math.PI*2; ctx.beginPath(); ctx.moveTo(iceSmash.x,-4); ctx.lineTo(iceSmash.x+Math.cos(a)*30*p,-4+Math.sin(a)*8*p); ctx.stroke(); } }
}
// falling snow or blossom petals, drawn over the sky
function drawWeather(){
  if(AREA.id!=='frozen' && AREA.id!=='guardian') return;
  const snow=AREA.id==='frozen', n=snow?90:45;
  for(let i=0;i<n;i++){
    const sp=snow?30+(i%5)*12:22+(i%4)*8, sx=((i*137.5+t*(snow?12:24)*((i%3)+1)+Math.sin(t+i)*20)%(viewW+40)+viewW+40)%(viewW+40)-20;
    const sy=((i*61.7+t*sp)%(viewH+20))-10, wx=cam.x+sx, wy=cam.y+sy;
    if(wy>(snow?-8:wave(wx,t))) continue;
    if(snow){ ctx.fillStyle='rgba(255,255,255,.9)'; ellipse(ctx,wx,wy,1.2+(i%3)*.7,1.2+(i%3)*.7); ctx.fill(); }
    else { ctx.save(); ctx.translate(wx,wy); ctx.rotate(t*2+i); ctx.fillStyle=i%2?'#f7b6c9':'#fbd3df'; ctx.beginPath(); ctx.ellipse(0,0,3.4,2,0,0,Math.PI*2); ctx.fill(); ctx.restore(); }
  }
}
function drawBear(b){
  const d=b.dir, up = b.st==='growl'?.32 : b.st==='swipe'?.42 : 0, sw = b.st==='swipe'?Math.sin(Math.min(1,b.t/.4)*Math.PI):0, dip=b.st==='fish'?Math.max(0,Math.sin(b.t*3))*.25:0;
  const bob=Math.sin(t*3+b.x)*1.5, walk=b.st==='walk'?Math.sin(t*5):0;
  ctx.save(); ctx.translate(b.x,4+bob); ctx.scale(d,1);
  ctx.save(); ctx.translate(-40,0); ctx.rotate(-up+dip); ctx.translate(40,0);
  const fur='#6b4528', dark='#4a2e19', light='#8f6440';
  // back legs
  ctx.fillStyle=dark; ctx.fillRect(-52+walk*4,-12,20,30); ctx.fillRect(28-walk*4,-12,18,30);
  // body with shoulder hump
  ctx.fillStyle=fur; ellipse(ctx,-6,-38,64,36); ctx.fill(); ellipse(ctx,22,-58,30,22); ctx.fill();
  ctx.fillStyle=light; ellipse(ctx,-10,-56,40,12); ctx.fill();
  // front leg (the swipe raises it)
  ctx.save(); ctx.translate(40,-28); ctx.rotate(-sw*1.9); ctx.fillStyle=fur; ctx.fillRect(-10,0,20,40); ctx.fillStyle=dark; ellipse(ctx,0,40,12,7); ctx.fill();
  if(sw>.2){ ctx.strokeStyle='#efe6d6'; ctx.lineWidth=2; for(let i=-1;i<=1;i++){ ctx.beginPath(); ctx.moveTo(i*5,44); ctx.lineTo(i*6,50); ctx.stroke(); } } ctx.restore();
  // head
  ctx.save(); ctx.translate(62,-62);
  ctx.fillStyle=fur; ellipse(ctx,0,0,26,22); ctx.fill(); ellipse(ctx,-10,-18,7,7); ctx.fill(); ellipse(ctx,8,-19,7,7); ctx.fill();
  ctx.fillStyle='#a77b55'; ellipse(ctx,20,6,15,11); ctx.fill(); ctx.fillStyle='#1b120c'; ellipse(ctx,32,2,5,4); ctx.fill(); ellipse(ctx,6,-6,2.6,2.6); ctx.fill();
  if(up>0){ ctx.fillStyle='#4a1d1d'; ctx.beginPath(); ctx.moveTo(10,12); ctx.lineTo(32,10); ctx.lineTo(20,22); ctx.closePath(); ctx.fill(); ctx.fillStyle='#fff'; ctx.fillRect(18,10,3,4); ctx.fillRect(26,10,3,4); }
  ctx.restore(); ctx.restore(); ctx.restore();
}

// ---------- darkness and glowing things ----------
let lightCv=null, lctx=null;
function glowList(){
  const out=[];
  for(const f of fishes){ const g=f.def.glow, vis=f.vis??1; if(g && vis>.15) out.push([f.x,f.y,(f.def.len*f.sz*1.5+30)*(f.def.fade?.7+.5*vis:1),g]);
    if(f.def.id==='angler' && f!==hooked){ const len=f.def.len*f.sz, ry=len*.42; out.push([f.x+f.dir*(len/2+len*.25), f.y-ry*1.2, 60, '#dcff8c']); }
    if(f.def.legend) out.push([f.x,f.y,f.def.len*f.sz*.9,'#ffe08a']); }
  if(AREA.dark){
    for(const cr of SCENERY.crystals) out.push([cr.x, cr.bed?bed(cr.x)-10:cr.y-10, cr.r*4, cr.c]);
    if(AS.holes) for(const h of AS.holes) out.push([h.x+h.dir*14,h.y,60,'#78ffdc']);
    out.push([SCENERY.fallX,-200,300,'#b4ebff']);
  }
  return out;
}
function drawLighting(){
  let dark=clamp((cam.y+viewH*.5-450)/900,0,.75);
  if(AREA.dark) dark=Math.max(dark,AREA.dark);
  if(dark<=.01) return;
  const W=cv.width, H=cv.height, s=scale*dpr;
  if(!lightCv){ lightCv=document.createElement('canvas'); lctx=lightCv.getContext('2d'); }
  if(lightCv.width!==W||lightCv.height!==H){ lightCv.width=W; lightCv.height=H; }
  const lc=lctx; lc.globalCompositeOperation='source-over'; lc.clearRect(0,0,W,H);
  lc.fillStyle=`rgba(2,8,20,${dark})`; lc.fillRect(0,0,W,H);
  lc.globalCompositeOperation='destination-out';
  const light=(x,y,r,inner,a)=>{ const X=(x-cam.x)*s, Y=(y-cam.y)*s, Rr=r*s; if(X<-Rr||X>W+Rr||Y<-Rr||Y>H+Rr) return;
    const g=lc.createRadialGradient(X,Y,0,X,Y,Rr); g.addColorStop(0,`rgba(0,0,0,${a})`); g.addColorStop(inner,`rgba(0,0,0,${a})`); g.addColorStop(1,'rgba(0,0,0,0)'); lc.fillStyle=g; lc.fillRect(X-Rr,Y-Rr,2*Rr,2*Rr); };
  light(hook.x,hook.y,AREA.dark?300:360,.14,1);
  if(AREA.dark) light(boat.x,boat.y-50,380,.35,1);   // the cat's lantern
  const glows=glowList();
  for(const [x,y,r] of glows) light(x,y,r,.15,.85);
  ctx.setTransform(1,0,0,1,0,0); ctx.drawImage(lightCv,0,0);
  setCam(1); ctx.save(); ctx.globalCompositeOperation='lighter';
  for(const [x,y,r,c] of glows){ if(x<cam.x-r||x>cam.x+viewW+r) continue; const g=ctx.createRadialGradient(x,y,0,x,y,r*.7); g.addColorStop(0,hexA(c,.35)); g.addColorStop(1,hexA(c,0)); ctx.fillStyle=g; ellipse(ctx,x,y,r*.7,r*.7); ctx.fill(); }
  if(AREA.dark){ const g=ctx.createRadialGradient(boat.x+boat.facing*-30,boat.y-60,0,boat.x,boat.y-60,160); g.addColorStop(0,'rgba(255,214,140,.22)'); g.addColorStop(1,'rgba(255,214,140,0)'); ctx.fillStyle=g; ellipse(ctx,boat.x,boat.y-60,160,160); ctx.fill(); }
  ctx.restore();
}
// "keep still" hint next to the hook in the cave
function drawStillHint(){
  if(!AS.holes || hooked || hook.y<40) return;
  const near=AS.holes.find(h=>h.occ && (h.occ.state==='den'||h.occ.state==='peek') && Math.hypot(hook.x-h.x,hook.y-h.y)<200);
  if(!near) return;
  const p=Math.min(1,stillT/1.1);
  ctx.save(); ctx.font='600 13px Nunito,sans-serif'; ctx.textAlign='center'; ctx.fillStyle='rgba(230,255,250,.9)';
  ctx.fillText(near.occ.state==='peek'?'Something is coming out…':'Keep still…',hook.x,hook.y-28);
  ctx.strokeStyle='rgba(120,255,220,.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(hook.x,hook.y,18,-Math.PI/2,-Math.PI/2+p*Math.PI*2); ctx.stroke(); ctx.restore();
}
function drawDanger(side,title,sub){
  ctx.setTransform(1,0,0,1,0,0);
  const s=scale*dpr, W=cv.width, H=cv.height, a=.35+.25*Math.sin(t*10);
  const g = side<0 ? ctx.createLinearGradient(0,0,W*.22,0) : ctx.createLinearGradient(W,0,W*.78,0);
  g.addColorStop(0,'rgba(210,40,30,'+a+')'); g.addColorStop(1,'rgba(210,40,30,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const ty=H*.6; ctx.font=Math.round(24*s)+'px "Lilita One","Trebuchet MS",sans-serif'; ctx.textAlign='center';
  ctx.lineWidth=5*s; ctx.strokeStyle='#5e3820'; ctx.strokeText(title,W/2,ty); ctx.fillStyle='#fff'; ctx.fillText(title,W/2,ty);
  ctx.font=Math.round(14*s)+'px "Nunito",sans-serif'; ctx.lineWidth=4*s; ctx.strokeText(sub,W/2,ty+24*s); ctx.fillText(sub,W/2,ty+24*s);
}
