// Whisker Lake · The Luminous Cave: falling rocks and crystals, walls that block the boat, and the rock-buster.
// Loaded last (after ui.js). world.js, draw-game.js and draw-places.js call into this file.

// ---------- the rock-buster ----------
// For now it is unlimited. When the rock-buster item exists, make count() return how many the player has
// and use() spend one. Everything else (button, B key, smashing) already goes through these two.
const ROCK_BUSTER={
  count(){ return Infinity; },
  use(){ }
};

const ROCK={
  every:[7,12],        // seconds between falls
  warn:1.6,            // seconds of warning before a small one lands
  warnBig:2.4,         // ... and before a big one
  bigChance:.25,       // how often a fall is a big one
  maxWalls:2,          // most walls at once
  boatHalf:128,        // half the boat's length
  reach:70             // how close the boat must be to a wall to bust it
};
const isCave=()=>AREA && AREA.id==='cave';
function rockState(){ if(!AS.rock) AS.rock={falls:[],walls:[],chunks:[],t:rand(4,7)}; return AS.rock; }

// ---------- sounds ----------
sfx.rumble=()=>{ tone(62,.9,'sawtooth',.06,-18); tone(48,1,'square',.035,-12,.12); };
sfx.splashBig=()=>{ tone(320,.35,'sine',.12,-260); tone(140,.4,'triangle',.08,-60,.05); };
sfx.bonk=()=>{ tone(180,.12,'square',.06,-90); };
sfx.smash=()=>{ for(let i=0;i<6;i++) tone(1400-i*160+Math.random()*200,.07,'square',.05,-600,i*.05); tone(90,.35,'sawtooth',.07,-50,.05); };

// ---------- falling ----------
function pickFallX(big){
  const st=rockState();
  for(let k=0;k<30;k++){
    // mostly where the player can see it
    const x = Math.random()<.75 ? rand(cam.x+80, cam.x+viewW-80) : rand(300, WORLD_W-300);
    if(x<300 || x>WORLD_W-300) continue;
    if(big){
      if(Math.abs(x-boat.x) < ROCK.boatHalf+160) continue;                 // never right on top of the boat
      if(st.walls.some(w=>Math.abs(w.x-x) < w.w+260)) continue;            // leave room between walls
      if(bed(x) < 220) continue;                                            // not in the shallows by the shore
    }
    return x;
  }
  return null;
}
function startFall(big, x){
  const st=rockState(); x = x ?? pickFallX(big); if(x==null) return null;
  const crystal=Math.random()<.5, seed=Math.floor(rand(1,9999));
  const f={x, y:null, vy:0, big, crystal, seed, state:'warn', t:big?ROCK.warnBig:ROCK.warn,
           r: big?rand(70,95):rand(9,17), hit:false, rot:rand(0,6), spin:rand(-2,2)};
  st.falls.push(f);
  if(big){ toast('Rumble… something big is falling!',1.8); sfx.rumble(); }
  return f;
}
function updateRockfall(dt){
  if(!isCave()) return;
  const st=rockState();
  if(S.mode==='play'){
    st.t-=dt;
    if(st.t<=0){ st.t=rand(...ROCK.every); startFall(st.walls.length<ROCK.maxWalls && Math.random()<ROCK.bigChance); }
  }
  for(let i=st.falls.length-1;i>=0;i--){
    const f=st.falls[i];
    if(f.state==='warn'){
      f.t-=dt;
      if(Math.random()<dt*14) parts.push({x:f.x+rand(-f.r*.6,f.r*.6),y:Math.min(cam.y,0)-10,vx:rand(-8,8),vy:rand(60,140),life:1.2,max:1.2,r:rand(1,2.2),k:'dust'});
      if(f.t<=0){ f.state='fall'; f.y=Math.min(cam.y,-viewH*.3)-f.r-20; f.vy=120; }
      continue;
    }
    if(f.state==='fall'){
      f.vy+=900*dt; f.y+=f.vy*dt; f.rot+=f.spin*dt;
      if(f.y>=wave(f.x,t)-(f.big?f.r*.2:0)) splashDown(f);
      continue;
    }
    if(f.state==='sink'){
      f.y+=f.vy*dt; f.vy+=(70-f.vy)*Math.min(1,dt*2); f.x+=Math.sin(t*2+f.seed)*10*dt; f.rot+=f.spin*.3*dt;
      if(!f.hit && !f.harmless) checkLineHit(f);
      if(f.y>=bed(f.x)-f.r*.6){ f.y=bed(f.x)-f.r*.6; f.state='rest'; f.t=4; }
      continue;
    }
    if(f.state==='rest'){ f.t-=dt; if(f.t<=0) st.falls.splice(i,1); }
  }
  for(let i=st.chunks.length-1;i>=0;i--){ const c=st.chunks[i]; c.vy+=700*dt; c.x+=c.vx*dt; c.y+=c.vy*dt; c.rot+=c.spin*dt; c.life-=dt; if(c.life<=0) st.chunks.splice(i,1); }
  updateBustButton();

  function splashDown(f){
    const y0=wave(f.x,t);
    for(let k=0;k<(f.big?26:10);k++) parts.push({x:f.x+rand(-f.r,f.r),y:y0,vx:rand(-160,160)*(f.big?1.6:1),vy:rand(-320,-90)*(f.big?1.4:1),life:.8,max:.8,r:rand(2,4.5),k:'s'});
    scatterFish(f.x, y0+60, f.big?320:170);
    if(f.big){
      sfx.splashBig();
      const st=rockState(), w={x:f.x, w:f.r*.95, h:f.r*1.3, crystal:f.crystal, seed:f.seed, born:t};
      // landed right next to the boat? the wave shoves the boat clear
      const gap=Math.abs(boat.x-w.x)-w.w-ROCK.boatHalf;
      if(gap<0){ const side=boat.x<w.x?-1:1; boat.x=clamp(w.x+side*(w.w+ROCK.boatHalf+4),160,WORLD_W-160); boat.vx=0; sfx.bonk(); toast('Whoa! That was close!',1.4); }
      st.walls.push(w); st.falls.splice(st.falls.indexOf(f),1);
      toast(f.crystal?'A giant crystal blocks the way!':'A boulder blocks the way!',1.8);
    } else { sfx.plop(); f.state='sink'; f.vy=160; }
  }
}
// the line runs from the rod tip down to the hook; a sinking rock that touches it knocks the fish off
function checkLineHit(f){
  if(hook.y<20 || f.y<4 || f.y>hook.y) return;
  const k=clamp(f.y/Math.max(1,hook.y),0,1), lx=boat.tipX+(hook.x-boat.tipX)*k;
  if(Math.abs(f.x-lx) > f.r+6) return;
  f.hit=true; f.vy*=.4; f.x+=(f.x<lx?-1:1)*6;
  for(let i=0;i<6;i++) parts.push({x:f.x,y:f.y,vx:0,vy:rand(-40,-20),life:2,max:2,r:rand(1.5,3),k:'b'});
  scatterFish(f.x,f.y,200);
  if(hooked && hooked!==approacher){
    const g=hooked; hooked=null; tension=0; hook.offset=0; $('fight').hidden=true;
    g.state='flee'; g.fleeT=2.5; g.cool=8; g.dir=g.away||1; g.heading=null; g.baseY=clamp(g.y,g.def.min??g.y,g.def.max??g.y);
    if(g.def.hole && g.home){ g.state='return'; }
    sfx.bonk(); setMood('sad',2); toast('A falling rock knocked the '+g.def.name+' off your line!',2);
  } else { sfx.bonk(); toast('Bonk! A rock hit your line',1.2); }
}
function scatterFish(x,y,R){
  for(const f of fishes){
    if(f===hooked || f.dead || f.def.inert || f.def.critter || f.def.legend) continue;
    if(Math.hypot(f.x-x,f.y-y)>R) continue;
    if(f===approacher) approacher=null;
    if(f.def.hole){ if(f.state!=='den') f.state='return'; continue; }
    if(f.def.move==='crawl') continue;
    f.state='flee'; f.dir=f.x<x?-1:1; f.fleeT=1.6; f.cool=3; f.baseY=clamp(f.y,f.def.min??f.y,f.def.max??f.y);
  }
}

// ---------- walls block the boat ----------
function blockBoat(){
  if(!isCave() || !AS.rock) return;
  for(const w of AS.rock.walls){
    const lim=w.w+ROCK.boatHalf;
    if(Math.abs(boat.x-w.x)<lim){ boat.x = boat.x<w.x ? w.x-lim : w.x+lim; boat.vx=0; }
  }
}
function nearWall(){
  if(!isCave() || !AS.rock) return null;
  let best=null, bd=1e9;
  for(const w of AS.rock.walls){ const gap=Math.abs(boat.x-w.x)-w.w-ROCK.boatHalf; if(gap<ROCK.reach && gap<bd){ bd=gap; best=w; } }
  return best;
}

// ---------- busting ----------
function bustWall(w){
  w = w || nearWall(); if(!w || S.mode!=='play') return false;
  if(ROCK_BUSTER.count()<=0){ toast('You need a rock-buster to clear this',1.6); return false; }
  ROCK_BUSTER.use();
  const st=rockState(); st.walls.splice(st.walls.indexOf(w),1);
  sfx.smash();
  for(let i=0;i<16;i++){
    const a=rand(-Math.PI,0);
    st.chunks.push({x:w.x+rand(-w.w,w.w), y:-rand(0,w.h), vx:Math.cos(a)*rand(80,260), vy:Math.sin(a)*rand(120,380), r:rand(5,13), rot:rand(0,6), spin:rand(-6,6), life:1.6, crystal:w.crystal, seed:Math.floor(rand(1,999))});
  }
  // a few pieces sink to the bottom (they can't hurt you)
  for(let i=0;i<4;i++) st.falls.push({x:w.x+rand(-w.w*.8,w.w*.8), y:2, vy:rand(60,120), big:false, crystal:w.crystal, seed:Math.floor(rand(1,999)), state:'sink', r:rand(8,13), rot:rand(0,6), spin:rand(-2,2), hit:true, harmless:true});
  for(let k=0;k<20;k++) parts.push({x:w.x+rand(-w.w,w.w),y:wave(w.x,t),vx:rand(-140,140),vy:rand(-280,-80),life:.7,max:.7,r:rand(2,4),k:'s'});
  toast(w.crystal?'Crash! The crystal shatters. The way is clear!':'Crash! The boulder crumbles. The way is clear!',1.8);
  updateBustButton(); return true;
}
let bustShown=false;
function updateBustButton(){
  const b=document.getElementById('bustBtn'); if(!b) return;
  const show = S.mode==='play' && !!nearWall();
  if(show!==bustShown){ bustShown=show; b.hidden=!show; }
  if(show){ const n=ROCK_BUSTER.count(); b.textContent = 'Bust rock'+(Number.isFinite(n)?' ×'+n:''); }
}
(function wireBust(){
  const b=document.getElementById('bustBtn'); if(b) b.addEventListener('click',()=>bustWall());
  window.addEventListener('keydown',e=>{ if(e.code==='KeyB' && S.mode==='play'){ bustWall(); e.preventDefault(); } });
})();

// ---------- drawing ----------
const CRYSTAL_COLS=['#7fe9ff','#b993ff','#8affc8','#8fb8ff'];   // the cave's own crystal colours
function mixHex(a,b,k){ const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)); const A=p(a),B=p(b); return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')'; }
// a smooth, lumpy outline (curves through the midpoints of a jittered circle)
function lumpPath(c,rx,ry,seed,n=11,j=.22){
  const R=seeded(seed), pts=[];
  for(let i=0;i<n;i++){ const a=i/n*Math.PI*2, k=1-j/2+R()*j; pts.push([Math.cos(a)*rx*k, Math.sin(a)*ry*k]); }
  // about a third of the corners are sharp (broken edges), the rest are worn smooth
  const sharp=pts.map(()=>R()<.35);
  c.beginPath();
  for(let i=0;i<=n;i++){ const p=pts[i%n], q=pts[(i+1)%n], mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2;
    if(!i) c.moveTo(mx,my); else if(sharp[i%n]){ c.lineTo(p[0],p[1]); c.lineTo(mx,my); } else c.quadraticCurveTo(p[0],p[1],mx,my); }
  c.closePath();
}
// one stone: lit from the top left, darker underneath, grainy, a little wet sheen
function drawStone(c,rx,ry,seed,tone=0,j=.34){
  const base=['#8b8796','#7e7a86','#938a85'][seed%3];
  lumpPath(c,rx,ry,seed,9,j);
  const g=c.createRadialGradient(-rx*.35,-ry*.45,Math.min(rx,ry)*.1,0,0,Math.max(rx,ry)*1.15);
  g.addColorStop(0,mixHex(base.replace(/^#/,'#'),'#ffffff',.28+tone)); g.addColorStop(.55,base); g.addColorStop(1,mixHex(base,'#1b1924',.65));
  c.fillStyle=g; c.fill();
  c.save(); lumpPath(c,rx,ry,seed,9,j); c.clip();
  // underside shadow
  const sh=c.createLinearGradient(0,-ry,0,ry); sh.addColorStop(.45,'rgba(20,18,30,0)'); sh.addColorStop(1,'rgba(20,18,30,.45)'); c.fillStyle=sh; c.fillRect(-rx*1.3,-ry*1.3,rx*2.6,ry*2.6);
  // grain
  const R=seeded(seed*7+3), dots=Math.min(60,Math.round(rx*ry/60));
  for(let i=0;i<dots;i++){ const x=(R()*2-1)*rx, y=(R()*2-1)*ry, r=.6+R()*1.4; c.fillStyle=R()<.5?'rgba(255,255,255,.12)':'rgba(15,12,25,.18)'; c.fillRect(x,y,r,r); }
  // a faint vein
  if(rx>14){ c.strokeStyle='rgba(30,26,40,.28)'; c.lineWidth=Math.max(1,rx*.025); c.beginPath(); const y0=(R()-.5)*ry; c.moveTo(-rx,y0); c.bezierCurveTo(-rx*.3,y0-ry*.25*R(),rx*.3,y0+ry*.3*R(),rx,y0+(R()-.5)*ry*.4); c.stroke(); }
  c.restore();
  // wet rim light along the top left
  // a flatter, lighter top face makes it read as a chunky rock rather than a pebble
  c.save(); lumpPath(c,rx,ry,seed,9,j); c.clip(); c.fillStyle='rgba(255,255,255,.10)'; lumpPath(c,rx*.8,ry*.45,seed+1,7,j); c.save(); c.translate(-rx*.1,-ry*.5); c.fill(); c.restore();
  c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=Math.max(1.2,rx*.06); c.save(); c.translate(rx*.05,ry*.07); lumpPath(c,rx*.97,ry*.97,seed,9,j); c.stroke(); c.restore(); c.restore();
  lumpPath(c,rx,ry,seed,9,j); c.strokeStyle='rgba(28,24,38,.55)'; c.lineWidth=Math.max(1,rx*.035); c.stroke();
}
// one six-sided crystal prism pointing up from (0,0): a lit face, a shaded face, a ridge and a bright streak
function drawShard(c,len,wd,col,lean=0){
  const tip=-len, sh=-len*.8, tx=wd*lean*.4;
  const light=mixHex(col,'#ffffff',.55), dark=mixHex(col,'#1d2a66',.45);
  c.save(); c.globalAlpha*=.92;
  // shaded right face
  c.beginPath(); c.moveTo(-wd*.12,0); c.lineTo(-wd*.12,sh); c.lineTo(tx,tip); c.lineTo(wd,sh); c.lineTo(wd,0); c.closePath();
  let g=c.createLinearGradient(0,0,0,tip); g.addColorStop(0,dark); g.addColorStop(1,col); c.fillStyle=g; c.fill();
  // lit left face
  c.beginPath(); c.moveTo(-wd,0); c.lineTo(-wd,sh); c.lineTo(tx,tip); c.lineTo(-wd*.12,sh); c.lineTo(-wd*.12,0); c.closePath();
  g=c.createLinearGradient(0,0,0,tip); g.addColorStop(0,col); g.addColorStop(1,light); c.fillStyle=g; c.fill();
  // tip facet
  c.beginPath(); c.moveTo(-wd,sh); c.lineTo(tx,tip); c.lineTo(-wd*.12,sh); c.closePath(); c.fillStyle='rgba(255,255,255,.35)'; c.fill();
  // inner streak and ridge
  c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=Math.max(1,wd*.18); c.beginPath(); c.moveTo(-wd*.55,-len*.08); c.lineTo(-wd*.55,sh*.92); c.stroke();
  c.strokeStyle=mixHex(col,'#ffffff',.7); c.lineWidth=Math.max(.8,wd*.08); c.beginPath(); c.moveTo(-wd*.12,0); c.lineTo(-wd*.12,sh); c.lineTo(tx,tip); c.stroke();
  // outline in a deep tint of its own colour (not black)
  c.beginPath(); c.moveTo(-wd,0); c.lineTo(-wd,sh); c.lineTo(tx,tip); c.lineTo(wd,sh); c.lineTo(wd,0);
  c.strokeStyle=mixHex(col,'#101a44',.6); c.lineWidth=Math.max(1,wd*.12); c.lineJoin='round'; c.stroke();
  c.restore();
}
// a cluster of crystals growing out of a little rocky base; size = overall height
function drawCrystalCluster(c,size,seed,withBase=true,colour){
  const R=seeded(seed), col=colour||CRYSTAL_COLS[seed%CRYSTAL_COLS.length], n=4+Math.floor(R()*3);
  const shards=[];
  for(let i=0;i<n;i++){ const main=i===0; shards.push({a:main?(R()-.5)*.25:(R()-.5)*1.5, len:size*(main?1:.35+R()*.45), wd:size*(main?.17:.08+R()*.07), dx:(R()-.5)*size*.35}); }
  shards.sort((p,q)=>Math.abs(q.a)-Math.abs(p.a));       // side ones first, the big one in front
  for(const s of shards){ c.save(); c.translate(s.dx,0); c.rotate(s.a); drawShard(c,s.len,s.wd,col,s.a); c.restore(); }
  if(withBase){ c.save(); c.translate(0,size*.06); c.scale(1,.55); drawStone(c,size*.42,size*.3,seed+5,-.08); c.restore(); }
}
// small falling or sinking pieces
function drawPebble(c,x,y,r,rot,crystal,seed){
  c.save(); c.translate(x,y); c.rotate(rot);
  if(crystal){ const col=CRYSTAL_COLS[seed%CRYSTAL_COLS.length], R=seeded(seed);
    // a broken-off chunk: two or three short prisms
    const n=2+(seed%2);
    for(let i=0;i<n;i++){ c.save(); c.rotate((i-(n-1)/2)*.55+(R()-.5)*.2); drawShard(c,r*(1.5+R()*.6),r*(.38+R()*.12),col); c.restore(); }
  } else drawStone(c,r,r*.78,seed);
  c.restore();
}
function drawWall(c,w){
  const y0=wave(w.x,t), R=seeded(w.seed), rise=Math.min(1,(t-w.born)*3);
  c.save(); c.translate(w.x,(1-rise)*w.h);
  const W=w.w, H=w.h, bottom=150;
  const body=()=>{
    if(w.crystal){
      // a big cluster rising from a rubble mound
      const col=CRYSTAL_COLS[w.seed%CRYSTAL_COLS.length];
      // rubble mound the crystals grow out of (mostly under the water)
      c.save(); c.translate(0,bottom*.55); drawStone(c,W*1.1,bottom*.55,w.seed+9,-.15); c.restore();
      for(let i=-1;i<=1;i+=2){ c.save(); c.translate(i*W*.75,18); c.rotate(i*.35); drawCrystalCluster(c,H*.7,w.seed+i*11,false,col); c.restore(); }
      c.save(); c.translate(0,14); drawCrystalCluster(c,H*1.45,w.seed,false,col); c.restore();
      c.save(); c.translate(-W*.7,10); drawStone(c,W*.42,22,w.seed+4); c.restore();
      c.save(); c.translate(W*.65,12); drawStone(c,W*.38,20,w.seed+7); c.restore();
    } else {
      // several stones piled up: the big one in the middle, two leaning on it
      c.save(); c.translate(0,bottom*.55); drawStone(c,W*1.08,bottom*.55,w.seed+9,-.15); c.restore();
      const stone=(x,y,rx,ry,sd,tone)=>{ c.fillStyle='rgba(10,8,18,.35)'; ellipse(c,x+rx*.08,y+ry*.82,rx*.9,ry*.28); c.fill(); c.save(); c.translate(x,y); drawStone(c,rx,ry,sd,tone); c.restore(); };
      stone(-W*.62,-H*.18,W*.55,H*.42,w.seed+3,-.05);
      stone(W*.12,-H*.38,W*.82,H*.62,w.seed,0);
      stone(W*.7,-H*.05,W*.45,H*.36,w.seed+6,0);
      // a few small crystals in the cracks
      for(let i=0;i<2;i++){ c.save(); c.translate((R()-.5)*W*.9,-H*(.25+R()*.4)); c.rotate((R()-.5)*.8); drawCrystalCluster(c,12+R()*8,w.seed+20+i,false); c.restore(); }
    }
    // wet and darker near the water line
    const wg=c.createLinearGradient(0,y0-26,0,y0+4); wg.addColorStop(0,'rgba(10,30,45,0)'); wg.addColorStop(1,'rgba(10,30,45,.35)');
    c.fillStyle=wg; c.fillRect(-W*1.6,y0-26,W*3.2,30);
  };
  // above the water: solid; below: faded, like it's under water
  c.save(); c.beginPath(); c.rect(-W*2.2,-500,W*4.4,500+y0-(1-rise)*w.h); c.clip(); body(); c.restore();
  c.save(); c.beginPath(); c.rect(-W*2.2,y0-(1-rise)*w.h,W*4.4,400); c.clip(); c.globalAlpha=.45; body(); c.restore();
  c.restore();
  // foam where it meets the water
  c.fillStyle='rgba(220,245,255,.5)'; for(let i=-3;i<=3;i++){ ellipse(c,w.x+i*W*.36,y0-1+Math.sin(t*3+i)*1.5,W*.2,2.6); c.fill(); }
}
// walls sit behind the boat and the front water band
function drawRockWalls(){
  if(!isCave() || !AS.rock) return;
  const L=cam.x-200, R=cam.x+viewW+200;
  for(const w of AS.rock.walls) if(w.x>L && w.x<R) drawWall(ctx,w);
}
// warnings, falling and sinking pieces, smashed chunks, dust
function drawFallingRocks(){
  if(!isCave() || !AS.rock) return;
  const st=AS.rock;
  for(const p of parts){ if(p.k!=='dust') continue; ctx.fillStyle='rgba(200,190,170,'+(.7*p.life/p.max)+')'; ellipse(ctx,p.x,p.y,p.r,p.r); ctx.fill(); }
  for(const f of st.falls){
    if(f.state==='warn'){
      const y0=wave(f.x,t), k=1-f.t/(f.big?ROCK.warnBig:ROCK.warn), pulse=.5+.5*Math.sin(t*12);
      ctx.strokeStyle=`rgba(255,190,90,${.45+.45*pulse})`; ctx.lineWidth=f.big?4:2.5;
      ellipse(ctx,f.x,y0,f.r*(1.6-k*.6)+8,(f.r*(1.6-k*.6)+8)*.28); ctx.stroke();
      ctx.fillStyle=`rgba(255,190,90,${.12+.12*pulse})`; ctx.fill();
      // surface out of view (hook is deep): show a marker at the top edge of the screen instead
      if(y0<cam.y+30 && f.x>cam.x && f.x<cam.x+viewW){ const yy=cam.y+26, s=f.big?16:11;
        ctx.fillStyle=`rgba(255,190,90,${.55+.45*pulse})`; ctx.beginPath(); ctx.moveTo(f.x-s,yy-s*.8); ctx.lineTo(f.x+s,yy-s*.8); ctx.lineTo(f.x,yy+s*.9); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#3a2410'; ctx.font='bold '+(s+2)+'px sans-serif'; ctx.textAlign='center'; ctx.fillText('!',f.x,yy+1); }
      continue;
    }
    if(f.state==='rest'){ ctx.save(); ctx.globalAlpha=Math.min(1,f.t); drawPebble(ctx,f.x,f.y,f.r,f.rot,f.crystal,f.seed); ctx.restore(); continue; }
    if(f.big){ drawPebble(ctx,f.x,f.y,f.r,f.rot,f.crystal,f.seed); continue; }
    drawPebble(ctx,f.x,f.y,f.r,f.rot,f.crystal,f.seed);
  }
  for(const c of st.chunks) drawPebble(ctx,c.x,c.y,c.r,c.rot,c.crystal,c.seed);
}
// lights in the dark cave: [x, y, radius, colour]
function rockGlows(){
  if(!isCave() || !AS.rock) return [];
  const out=[];
  for(const f of AS.rock.falls){
    if(f.state==='warn'){ out.push([f.x,wave(f.x,t),f.big?150:90,'#ffbe5a']); if(wave(f.x,t)<cam.y+30) out.push([f.x,cam.y+26,70,'#ffbe5a']); }
    else if(f.crystal) out.push([f.x,f.y,f.r*5+30,CRYSTAL_COLS[f.seed%CRYSTAL_COLS.length]]);
    else if(f.state==='fall') out.push([f.x,f.y,f.r*4+20,'#c8c0b0']);
  }
  for(const w of AS.rock.walls) out.push(w.crystal ? [w.x,-w.h*.5,w.w*3+60,CRYSTAL_COLS[w.seed%CRYSTAL_COLS.length]] : [w.x,-w.h*.3,w.w*2.2+40,'#6f6b80']);
  for(const c of AS.rock.chunks) if(c.crystal) out.push([c.x,c.y,40,CRYSTAL_COLS[c.seed%CRYSTAL_COLS.length]]);
  return out;
}
