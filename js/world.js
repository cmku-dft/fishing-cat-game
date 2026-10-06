// Whisker Lake · the lake world: state, sounds, creatures, places, and the update step
const WORLD_W = 3600, PX_PER_M = 50, MAX_L = 1440;
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const deepBed = x => AREA.deep + AREA.amp[0]*Math.sin(x*0.0035+(AREA.ph||0)) + AREA.amp[1]*Math.sin(x*0.011+1.3) + (AREA.id==='maple'?14*Math.sin(x*.05):0);
const smooth=(a,b,x)=>{ const u=Math.max(0,Math.min(1,(x-a)/(b-a))); return u*u*(3-2*u); };
// the lake floor rises to shallow, sandy shores at both ends
const bed = x => { const s=Math.min(smooth(100,1300,x),smooth(100,1300,WORLD_W-x)); return AREA.shore+(deepBed(x)-AREA.shore)*s; };
const wave = (x,t) => AREA.waveK*(3.5*Math.sin(x*0.018+t*1.5) + 2*Math.sin(x*0.047-t*2.2));

// ---------- state ----------
const store = {
  get(k,d){try{const v=localStorage.getItem('whisker-'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem('whisker-'+k,JSON.stringify(v))}catch(e){}}
};
const S = {cat:store.get('cat',0), score:0, best:store.get('best',0), caught:store.get('caught',{}), mode:'select', sound:true};
let mods = {};
const boat={x:700,vx:0,facing:-1,y:0,tilt:0};
const hook={x:580,y:0,L:0,offset:0,prevY:0};
let fishes=[], parts=[], hooked=null, approacher=null, tension=0, phase='tired', phaseT=0, koiTimer=0, popT=0;
// shark attack: the shark hunting the boat (or null), seconds until the next attack, time the boat was bitten
let attack=null, attackT=35, overT=0, alarmT=0;
const cam={x:0,y:-200};
const keys={left:false,right:false,up:false,down:false};
let t=0, viewW=800, viewH=680, scale=1, dpr=1;

const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
const $=id=>document.getElementById(id);

// ---------- sound ----------
let ac=null;
function audio(){ if(!ac){ try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(ac&&ac.state==='suspended') ac.resume(); return ac; }
function tone(freq,dur,type='sine',vol=.15,slide=0,delay=0){
  if(!S.sound) return; const a=audio(); if(!a) return;
  const o=a.createOscillator(), g=a.createGain(), st=a.currentTime+delay;
  o.type=type; o.frequency.setValueAtTime(freq,st); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide),st+dur);
  g.gain.setValueAtTime(vol,st); g.gain.exponentialRampToValueAtTime(.001,st+dur);
  o.connect(g); g.connect(a.destination); o.start(st); o.stop(st+dur+.02);
}
const sfx={
  plop(){tone(520,.12,'sine',.12,-380)},
  bite(){tone(660,.08,'square',.06);tone(880,.1,'square',.06,0,.09)},
  snap(){tone(300,.25,'sawtooth',.08,-220)},
  catch(){[523,659,784,1047].forEach((f,i)=>tone(f,.18,'triangle',.12,0,i*.08))},
  trash(){tone(220,.18,'square',.06,-80);tone(160,.3,'square',.06,-60,.16)},
  zap(){for(let i=0;i<5;i++) tone(900+Math.random()*600,.05,'sawtooth',.05,0,i*.05)},
  rare(){[523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.22,'triangle',.12,0,i*.07))},
  chomp(){tone(140,.12,'sawtooth',.1,-70);tone(95,.18,'square',.08,-40,.08)},
  alarm(){tone(196,.18,'square',.05);tone(233,.18,'square',.05,0,.2)},
  over(){[392,330,262,196].forEach((f,i)=>tone(f,.28,'triangle',.12,0,i*.18))},
  roar(){tone(110,.5,'sawtooth',.09,-50);tone(82,.6,'square',.05,-30,.05)},
  crack(){tone(1800,.04,'square',.04,-1200);tone(900,.06,'triangle',.05,-500,.03)},
  shimmer(up){ [1568,1319,1175,988].forEach((f,i)=>tone(up?f*.75+i*120:f,.12,'sine',.05,0,i*.05)); },
  phew(){[440,554,659].forEach((f,i)=>tone(f,.14,'triangle',.1,0,i*.07))},
};

// ---------- creatures ----------
const isBottom=d=>d.move==='static'||d.move==='crawl';
function spawnX(def,avoid){
  for(let k=0;k<40;k++){
    const x=rand(80,WORLD_W-80);
    if(avoid && x>cam.x-160 && x<cam.x+viewW+160) continue;
    const b=bed(x);
    if(def.min!=null && b<def.min+def.len+20) continue;
    if(def.minBed!=null && b<def.minBed) continue;
    if(isBottom(def) && b<100) continue;
    return x;
  }
  return null;
}
function spawnDen(def,avoid){
  const h=AS.holes && AS.holes.find(h=>!h.occ && !(avoid && h.x>cam.x-160 && h.x<cam.x+viewW+160));
  if(!h) return 0;
  const f={def,x:h.x,y:h.y,baseY:h.y,dir:h.dir,speed:def.speed,ph:rand(0,6.28),cool:rand(0,2),state:'den',turnT:5,sz:rand(.9,1.1),life:Infinity,home:h};
  h.occ=f; fishes.push(f); return 1;
}
function spawn(def, avoidView){
  if(def.hole) return spawnDen(def,avoidView);
  const x0=spawnX(def,avoidView); if(x0==null) return 0;
  const n=def.school||1, dir=Math.random()<.5?-1:1, sp=(def.speed||0)*rand(.85,1.15);
  for(let i=0;i<n;i++){
    const x=clamp(x0+(n>1?rand(-45,45):0),80,WORLD_W-80), sz=def.sizes?rand(...def.sizes):rand(.88,1.14), len=def.len*sz;
    let y;
    if(def.move==='surface') y=wave(x,t)-2;
    else if(isBottom(def)) y=bed(x)-len*(def.move==='crawl'?.22:.2);
    else y=rand(def.min,Math.max(def.min,Math.min(def.max,bed(x)-len)));
    const f={def,x,baseY:y,y,dir,speed:sp*rand(.95,1.05),ph:rand(0,6.28),cool:rand(0,2),state:'swim',turnT:rand(5,12),sz,
      life:def.rare?rand(35,55):Infinity, pearl:def.id==='oyster'&&Math.random()<.18, col:Math.floor(Math.random()*3)};
    fishes.push(f);
  }
  return n;
}
function populate(avoid){
  if(AS.holes) for(const h of AS.holes) if(h.occ && (h.occ.dead || !fishes.includes(h.occ))) h.occ=null;
  for(const def of FISH){
    if(def.rare || def.legend || !inArea(def)) continue;
    let c=fishes.filter(f=>f.def===def && f!==hooked).length;
    while(c<def.count){ const n=spawn(def,avoid); if(!n) break; c+=n; }
  }
}
// keep swimmers out of the lake floor: push them up, and turn them around if the floor rises ahead
function keepOffFloor(f,len){
  if(f.def.move==='static'||f.def.move==='crawl') return;
  const top=bed(f.x)-len*.45;
  if(f.y>top){ f.y=top; if(f.baseY!=null) f.baseY=Math.min(f.baseY,top); }
  if(bed(f.x+f.dir*(len*.6+20))<f.y+len*.45){ f.dir*=-1; if(f.state==='flee') f.fleeT=Math.min(f.fleeT,.3); }
}
function updateFish(dt){
  const noticeR = 120*(mods.notice||1), cur=CURRENT();
  koiTimer-=dt;
  if(koiTimer<=0){ koiTimer=1; for(const d of FISH) if(d.rare && inArea(d) && !fishes.some(f=>f.def===d) && Math.random()<0.035*(mods.rare||1)) spawn(d,true); }
  updateLegend(dt);
  for(let i=fishes.length-1;i>=0;i--){
    const f=fishes[i]; if(f===hooked || f.dead) continue;
    const def=f.def, len=def.len*f.sz, mv=def.move||'swim';
    if(f.cool>0) f.cool-=dt;
    f.life-=dt;
    if(def.fade) updateFade(f,dt);
    if(f.life<0 && f!==approacher && (f.x<cam.x-200||f.x>cam.x+viewW+200)){ fishes.splice(i,1); continue; }
    if(mv==='static') continue;
    // cave fish live in their holes
    if(def.hole){
      if(f.state==='swim'||f.state==='flee') f.state='return';
      if(f.state==='den'||f.state==='peek'||f.state==='return'){ updateDen(f,dt,len); continue; }
      if(f.state==='approach' && stillT<.05){ f.state='return'; if(approacher===f) approacher=null; continue; }
    }
    if(f.state==='hunt'){ updateHunt(f,dt,len); continue; }
    if(f.state==='chase'){
      // hunters chase food; thieves (squid, frog, otter) chase the fish on your hook
      const th=def.thief, p=f.prey, ok=p && !p.dead && fishes.includes(p) && (th && p===hooked ? true : (p!==hooked || def.shark));
      f.chaseT-=dt;
      if(th && ok && p===hooked && Math.hypot(p.x-f.x,p.y-f.y)>th.giveUp){ f.state='swim'; f.prey=null; f.cool=6; toast('You got away from the '+th.name+'!',1.6); continue; }
      if(!ok || f.chaseT<0){ f.state='swim'; f.prey=null; f.cool=4; f.baseY=def.move==='surface'?0:clamp(f.y,def.min,def.max); }
      else{
        const mx=f.x+f.dir*len*.42, dx=p.x-mx, dy=p.y-f.y, d=Math.hypot(dx,dy)||1;
        if(Math.abs(dx)>6) f.dir=dx>0?1:-1;
        const sp=(th && p===hooked) ? th.speed : def.hunt&&def.hunt.speed ? def.hunt.speed : f.speed*(def.shark?2.2:1.7);
        f.x+=dx/d*sp*dt; f.y+=dy/d*sp*dt;
        if((def.shark||def.critter) && p.state==='swim' && d<150){ p.state='flee'; p.dir=p.x>f.x?1:-1; p.fleeT=1.4; p.baseY=clamp(p.y,p.def.min??p.y,p.def.max??p.y); }
        keepOffFloor(f,len);
        if(d<len*.12+p.def.len*p.sz*.35) eat(f,p);
      }
      continue;
    }
    if(f.state==='approach'){
      const mx=f.x+f.dir*len*.5, dx=hook.x-mx, dy=hook.y-f.y, d=Math.hypot(dx,dy)||1;
      const tooHigh = mv==='crawl' && hook.y < bed(f.x)-110;
      if(hooked || hook.y<14 || d>noticeR*1.9*(def.hole?1.6:1) || tooHigh){ f.state=def.hole?'return':'swim'; f.cool=3; approacher=null; f.baseY=clamp(f.y,def.min??f.y,def.max??f.y); }
      else{
        if(Math.abs(dx)>4) f.dir=dx>0?1:-1;
        if(mv==='crawl'){ f.x+=Math.sign(dx)*Math.max(30,f.speed*1.6)*dt; f.y=bed(f.x)-len*.22; if(Math.abs(dx)<14 && Math.abs(dy)<40) hookFish(f); }
        else{ const sp=Math.max(60,f.speed*1.3); f.x+=dx/d*sp*dt; f.y+=dy/d*sp*dt; f.y=Math.min(f.y,bed(f.x)-len*.3); if(d<8+len*.12+(def.legend?len*.08:0)) hookFish(f); }
      }
      continue;
    }
    if(f.state==='flee'){
      f.x+=f.dir*Math.max(40,f.speed)*2.6*dt; f.fleeT-=dt; if(mv==='crawl') f.y=bed(f.x)-len*.22; else f.y+=(f.baseY-f.y)*dt;
      if(f.fleeT<0) f.state='swim';
    } else if(mv==='surface'){
      // ducks paddle about on top of the water (and bob back up after a dive)
      f.x+=f.dir*f.speed*dt+cur*.5*dt; f.turnT-=dt; if(f.turnT<0){ if(Math.random()<.5) f.dir*=-1; f.turnT=rand(5,10); }
      f.y+=(wave(f.x,t)-2-f.y)*Math.min(1,dt*2.5);
    } else if(mv==='crawl'){
      f.x+=f.dir*f.speed*dt; f.turnT-=dt; if(f.turnT<0){ if(Math.random()<.5) f.dir*=-1; f.turnT=rand(4,9); }
      if(bed(f.x+f.dir*40)<(def.minBed||0)) f.dir*=-1;
      f.y=bed(f.x)-len*.22;
    } else if(mv==='drift'){
      f.x+=f.dir*f.speed*dt+cur*.6*dt;
      f.baseY+=Math.sin(t*.2+f.ph)*4*dt; f.baseY=clamp(f.baseY,def.min,Math.min(def.max,bed(f.x)-len));
      f.y=f.baseY+Math.sin(t*.8+f.ph)*14;
      if(bed(f.x+f.dir*40)<f.y+len) f.dir*=-1;
    } else {
      const sp = mv==='jerk' ? f.speed*Math.pow(Math.max(0,Math.sin(t*2.4+f.ph)),2)*2.4 : f.speed;
      f.x+=f.dir*sp*dt+cur*.3*dt;
      f.turnT-=dt; if(f.turnT<0){ if(Math.random()<.6) f.dir*=-1; f.turnT=rand(5,12); }
      if(bed(f.x+f.dir*(len*.6+20))<f.y+len*.5+8) f.dir*=-1;
      f.baseY+=Math.sin(t*.3+f.ph)*6*dt;
      f.baseY=clamp(f.baseY,def.min,Math.max(def.min,Math.min(def.max,bed(f.x)-len*.6)));
      f.y+=(f.baseY+Math.sin(t*1.3+f.ph)*8-f.y)*Math.min(1,dt*3);
    }
    if(f.x<60) f.dir=1; if(f.x>WORLD_W-60) f.dir=-1;
    if(mv!=='surface') keepOffFloor(f,len);
    // thieves go for the fish on your hook
    const th=def.thief;
    if(th && f.state==='swim' && f.cool<=0 && hooked && !hooked.def.inert && !hooked.def.thief && !hooked.def.shark && !hooked.def.legend && hook.y>30
       && Math.hypot(hooked.x-f.x,hooked.y-f.y)<th.range){ f.state='chase'; f.prey=hooked; f.chaseT=th.time; toast('A'+(/^[aeiou]/.test(th.name)?'n ':' ')+th.name+' wants your fish! Reel or row away!',1.8); }
    // hungry hunters look around for food
    if(def.hunt && f.state==='swim' && f.cool<=0 && Math.random()<dt*1.2){
      for(const p of fishes){
        if(p===f || p.dead || p.state==='approach' || p.def.critter || p.def.hole) continue;
        if(def.hunt.food(p) && Math.hypot(p.x-f.x,p.y-f.y)<def.hunt.R){ f.state='chase'; f.prey=p; f.chaseT=5; break; }
      }
    }
    if(mv!=='drift' && mv!=='surface' && Math.random()<dt*.08) parts.push({x:f.x+f.dir*len*.5,y:f.y-3,vx:0,vy:-30,life:2.5,max:2.5,r:rand(1.5,3),k:'b'});
  }
  if(fishes.some(f=>f.dead)) fishes=fishes.filter(f=>!f.dead);
  if(S.mode!=='play' || hooked || hook.y<=10) return;
  // snagging shellfish, jellyfish and trash
  for(const f of fishes){
    if(!f.def.snag || f.state!=='swim' || f.cool>0) continue;
    if(Math.hypot(hook.x-f.x,hook.y-f.y)<f.def.snag*f.sz){ hookFish(f); return; }
  }
  // fish and lobsters noticing the bait (cave fish only come out of their holes while you keep still)
  if(!approacher){
    for(const f of fishes){
      const mv=f.def.move||'swim';
      if(f.def.inert || f.def.critter || f.def.hole || f.state!=='swim' || f.cool>0) continue;
      if(mv==='crawl' && hook.y<bed(hook.x)-110) continue;
      if(f.def.legend && hook.y<650) continue;
      const mx=f.x+f.dir*f.def.len*f.sz*.5;
      if(Math.hypot(hook.x-mx,hook.y-f.y)<noticeR*(f.def.legend?1.5:1) && Math.random()<dt*(f.def.legend?.8:1.6)*(f.def.shy||1) && !(f.def.fade && f.vis<.9)){ f.state='approach'; approacher=f; break; }
    }
  }
}
// a shark or turtle eats its prey (a shark can even take the fish on your line)
function eat(f,p){
  p.dead=true;
  if(p===approacher) approacher=null;
  if(p===hooked){ hooked=null; tension=0; hook.offset=0; $('fight').hidden=true; setMood('sad',2.4); toast('A '+f.def.name.toLowerCase()+' ate your '+p.def.name+'!',2); }
  for(let k=0;k<10;k++) parts.push({x:p.x+rand(-8,8),y:p.y+rand(-8,8),vx:0,vy:rand(-50,-20),life:rand(1,2),max:2,r:rand(1.5,3.5),k:'b'});
  if(p.x>cam.x-50 && p.x<cam.x+viewW+50) sfx.chomp();
  f.state='swim'; f.prey=null; f.cool=f.def.shark?rand(8,14):f.def.thief?rand(10,16):rand(5,9); f.baseY=f.def.move==='surface'?0:clamp(f.y,f.def.min,f.def.max);
}
// every so often a shark comes for the boat. It arrives from the open-water side, so you can always row
// away from it or into the shallows near the shore, where it can't follow.
const SHALLOW=340;   // a shark can't swim where the lake floor is shallower than this (world px)
function maybeStartAttack(dt){
  if(AREA.id!=='whisker' || attack || S.mode!=='play') return;
  attackT-=dt; if(attackT>0) return;
  if(hooked && hooked.def.shark){ attackT=8; return; }
  attackT=rand(40,70);
  const side = boat.x<WORLD_W/2 ? 1 : -1;     // the side with more open water
  let s=fishes.find(f=>f.def.shark && f!==hooked && !f.dead && f.state!=='hooked' && Math.sign(f.x-boat.x)===side && Math.abs(f.x-boat.x)>450 && Math.abs(f.x-boat.x)<1000 && f.y<450);
  if(!s){
    const x=clamp(boat.x+side*rand(600,680),80,WORLD_W-80);
    const n=fishes.length; spawnAt(FISH_BY_ID.shark,x,rand(180,340)); s=fishes[n];
  }
  if(s===approacher) approacher=null;
  s.state='hunt'; s.huntT=0; s.prey=null; attack=s; alarmT=0;
  toast('Shark! Row away!',2.2);
}
function updateHunt(f,dt,len){
  f.huntT+=dt;
  const dx=boat.x-f.x, dy=24-f.y, d=Math.hypot(dx,dy)||1;
  if(Math.abs(dx)>4) f.dir=dx>0?1:-1;
  const sp=Math.min(185,105+f.huntT*45);
  const nx=f.x+dx/d*sp*dt;
  if(bed(nx)<SHALLOW || bed(boat.x)<SHALLOW-40){ endAttack('The shark can\'t follow you into the shallows!'); return; }
  f.x=nx; f.y=Math.max(22,f.y+dy/d*sp*dt);
  if(Math.random()<dt*6) parts.push({x:f.x-f.dir*len*.4,y:f.y,vx:0,vy:rand(-40,-20),life:1.2,max:1.2,r:rand(1.5,3),k:'b'});
  if(Math.abs(f.x-boat.x)<78 && f.y<70){ gameOver('shark',f); return; }
  if(f.huntT>9 || Math.abs(f.x-boat.x)>800) endAttack('You got away from the shark!');
}
function endAttack(msg){
  const f=attack; attack=null; if(!f) return;
  f.state='flee'; f.fleeT=3; f.dir=f.x>boat.x?1:-1; f.cool=12; f.baseY=rand(450,800);
  if(msg){ toast(msg,2.2); sfx.phew(); setMood('happy',1.6); }
}
function spawnAt(def,x,y){
  fishes.push({def,x,baseY:y,y,dir:1,speed:def.speed*rand(.95,1.1),ph:rand(0,6.28),cool:2,state:'swim',turnT:rand(5,12),sz:def.sizes?rand(...def.sizes):rand(.95,1.1), col:Math.floor(Math.random()*3),life:Infinity});
}
function gameOver(kind,f){
  S.mode='over'; overT=t; attack=null;
  if(kind==='shark'){ f.state='flee'; f.fleeT=3; f.dir=-f.dir; f.cool=12; f.baseY=rand(450,800); }
  if(hooked){ hooked.state='swim'; hooked.cool=4; hooked=null; } tension=0; $('fight').hidden=true;
  for(const k in keys) keys[k]=false;
  for(let i=0;i<30;i++) parts.push({x:boat.x+rand(-60,60),y:0,vx:rand(-160,160),vy:rand(-300,-90),life:1.1,max:1.1,r:rand(2,5),k:'s'});
  sfx.chomp(); sfx.over(); setMood('sad',99);
  if(S.score>S.best) S.best=S.score; store.set('best',S.best); store.set('trip',{score:0,cat:S.cat,x:Math.round(boat.x)});
  $('help').hidden=true; $('touch').hidden=true;
  setTimeout(()=>{
    $('overTitle').textContent=kind==='bear'?'Swipe!':'Chomp!';
    $('overText').textContent=`${kind==='bear'?'A bear swiped at':'A shark bit'} ${CATS[S.cat].name}'s boat. You scored ${S.score} ${S.score===1?'point':'points'} this trip. Best trip: ${S.best}.`;
    $('over').hidden=false; $('againBtn').focus();
  },1100);
}
function newTrip(){
  S.score=0; hooked=null; approacher=null; tension=0; hook.L=0; hook.offset=0; boat.vx=0; moodOv.until=0; idleT=0;
  if(attack) endAttack(null); attackT=rand(30,45);
  // send any sharks near the boat away
  for(const f of fishes) if(f.def.shark && Math.abs(f.x-boat.x)<700){ f.state='swim'; f.x=clamp(boat.x+(boat.x<WORLD_W/2?1:-1)*rand(900,1300),80,WORLD_W-80); f.y=f.baseY=rand(500,900); }
  if(AS.bears){ AS.bears=initAreaState(AREA).bears; boat.x=WORLD_W/2; }
  $('over').hidden=true; $('fight').hidden=true;
}
function hookFish(f){
  hooked=f; approacher=null; f.state='hooked'; tension=0; moodOv.until=0;
  const def=f.def; f.away = f.x>boat.x?1:-1;
  if(def.legend) f.stam=1;
  if(def.inert){ phase='tired'; phaseT=99; } else { phase='thrash'; phaseT=rand(...def.thrash); }
  sfx.bite();
  toast(def.legend?'The Guardian took the bait! Hold on!':def.trash?'Snagged something…':def.inert?'Got something!':'Fish on!',def.legend?2.4:1.6);
  $('fight').hidden=false; $('fightName').textContent=def.name;
}
function setPhase(p){ phase=p; phaseT = rand(...(p==='thrash'?hooked.def.thrash:hooked.def.tired));
  // the Guardian gets a little weaker every time it rests
  if(hooked.def.legend){ if(p==='tired') hooked.stam=Math.max(.4,hooked.stam*.88); else phaseT*=hooked.stam; } }

// creatures that turn see-through for a while, then appear again (the Crystal Axolotl)
function updateFade(f,dt){
  if(f.vis==null){ f.vis=1; f.fadeTo=1; f.fadeT=rand(5,8); }
  f.fadeT-=dt;
  if(f.fadeT<=0){ f.fadeTo=f.fadeTo>.5?0:1; f.fadeT=f.fadeTo?rand(5,8):rand(3,5);
    if(f.x>cam.x-50 && f.x<cam.x+viewW+50 && f.y>cam.y-50 && f.y<cam.y+viewH+50) sfx.shimmer(f.fadeTo); }
  f.vis+=clamp(f.fadeTo-f.vis,-dt*1.2,dt*1.2);
}
function updateHooked(dt, reeling){
  const def=hooked.def;
  if(def.inert){
    tension=0; hook.offset*=Math.pow(.2,dt);
    if(reeling) hook.L-=reelSpeed()*(def.heavy?.5:.85)*dt;
    if(hook.L<=0) return land();
    $('tensionFill').style.width='0%';
    const st=$('fightState'); st.textContent=def.trash?'Ugh, trash… reel it up':'Reel it up!'; st.style.color=def.trash?'var(--ink-soft)':'var(--good)';
    return;
  }
  phaseT-=dt; if(phaseT<=0) setPhase(phase==='thrash'?'tired':'thrash');
  if(def.fade){ updateFade(hooked,dt); if(hooked.vis<.5) reeling=false; }   // while see-through it slips through the line
  if(phase==='thrash'){
    hook.L=Math.min(MAX_L, hook.L+def.pull*(hooked.stam||1)*(def.fade&&hooked.vis<.5?.25:1)*dt);
    hook.offset=Math.sin(t*7)*55*hooked.away + hooked.away*30;
    if(reeling) tension+= (55+def.pull*(hooked.stam||1)*.38)*(mods.tension||1)*(def.legend?1.25:1)*dt; else tension-=22*dt;
    if(reeling) hook.L-=reelSpeed()*.3*dt;
  } else {
    hook.offset*=Math.pow(.2,dt);
    tension-=35*dt;
    if(reeling) hook.L-=reelSpeed()*(def.heavy?.8:1)*dt;   // heavy fish come up slowly
    if(def.legend) hook.L=Math.min(MAX_L, hook.L+def.pull*.45*hooked.stam*dt);   // even resting, the Guardian pulls back
  }
  tension=clamp(tension,0,100);
  if(tension>=100) return snap();
  if(hook.L<=0) return land();
  const fill=$('tensionFill'); fill.style.width=tension+'%';
  fill.style.background = tension>70?'var(--bad)':tension>40?'var(--warn)':'var(--good)';
  const st=$('fightState');
  const ghost = def.fade && hooked.vis<.5;
  st.textContent = ghost ? 'It turned see-through! Wait…' : phase==='thrash' ? 'Thrashing! Wait…' : 'Tired! Reel in!';
  st.style.color = ghost ? 'var(--ink-soft)' : phase==='thrash' ? 'var(--bad)' : 'var(--good)';
}
const reelSpeed=()=>230*(mods.reel||1);

function snap(){
  const f=hooked; f.state='flee'; f.fleeT=2.5; f.cool=8; f.dir=f.away; f.baseY=clamp(f.y,f.def.min,f.def.max);
  hooked=null; tension=0; hook.offset=0; $('fight').hidden=true;
  if(f.def.legend){ f.life=2; f.fleeT=4; }
  sfx.snap(); setMood('sad',2.4); toast(f.def.legend?'Snap! The Guardian broke free and vanished into the deep':'Snap! The '+f.def.name+' got away',f.def.legend?2.6:1.6);
}
function land(){
  const f=hooked, def=f.def; hooked=null; tension=0; hook.L=0; hook.offset=0; $('fight').hidden=true;
  fishes.splice(fishes.indexOf(f),1);
  const isNew=!S.caught[def.id];
  S.caught[def.id]=(S.caught[def.id]||0)+1;
  let pts=def.pts, pearl=false;
  if(def.id==='oyster' && f.pearl){ pts+=250; pearl=true; }
  S.score+=pts;
  if(S.score>S.best) S.best=S.score;
  store.set('caught',S.caught); store.set('best',S.best);
  for(let i=0;i<22;i++) parts.push({x:hook.x,y:0,vx:rand(-140,140),vy:rand(-260,-80),life:.9,max:.9,r:rand(2,4),k:'s'});
  if(def.trash){ sfx.trash(); setMood('disgust',2.4); toast('Trash! '+def.pts+' points'); }
  else if(def.id==='jelly'){ sfx.zap(); setMood('shocked',2); toast('Zap! It stings!'); }
  else { (def.rare||def.legend||pearl?sfx.rare:sfx.catch)(); setMood('happy',def.legend?5:2.4); if(pearl) toast('A pearl inside! +250',2.2); if(def.legend) toast('You caught the Guardian Dragon! +'+pts,3.4); }
  showCatch(def,isNew,pts,pearl);
  updateHud();
  const ai=AREAS.findIndex(a=>a.id===def.area);
  if(isNew && !def.trash && ai>=0 && areaDone(ai)){
    if(ai<AREAS.length-1) setTimeout(()=>{ toast(AREAS[ai].name+' complete! '+AREAS[ai+1].name+' is open on the map.',4); $('mapBtn').classList.add('new'); sfx.rare(); },900);
    else setTimeout(showWin,1400);
  }
}

// ---------- places: travelling, and the special rules of each place ----------
let stillT=0, legendT=20, iceSmash=null, moveHintT=0;
function initAreaState(a){
  const st={};
  if(a.id==='maple'){
    // bears wade in the shallows near each shore and pace up and down
    st.bears=[{x:620,lo:300,hi:1000,dir:1,st:'walk',t:0,close:0,roarT:0,pause:0},{x:2980,lo:2600,hi:3300,dir:-1,st:'walk',t:0,close:0,roarT:0,pause:0}];
  }
  if(a.id==='cave'){
    // little dens in the rock where the deep floor is
    st.holes=[]; const xs=[1250,1520,1760,1980,2230,2470,2700,2930];
    xs.forEach((x,i)=>{ const dir=i%2?-1:1; st.holes.push({x, y:bed(x)-16, dir, occ:null}); });
  }
  if(a.id==='frozen') st.ice=[];
  return st;
}
function travel(i, keepPlace){
  AREA=AREAS[i]; S.area=i; store.set('area',i);
  if(attack) endAttack(null);
  fishes=[]; parts=[]; hooked=null; approacher=null; tension=0; hook.L=0; hook.y=0; hook.offset=0; iceSmash=null;
  phase='tired'; $('fight').hidden=true; moodOv.until=0;
  AS=initAreaState(AREA); SCENERY=makeScenery(i); attackT=rand(30,45); legendT=rand(15,30);
  if(!keepPlace){ boat.x=WORLD_W/2; boat.vx=0; }
  populate(false);
  cam.x=clamp(boat.x-viewW/2,0,WORLD_W-viewW);
  $('helpArea').textContent=AREA.help;
  updateHud();
  if(typeof setAreaMusic==='function') setAreaMusic();
}
const CURRENT=()=>AREA.current||0;

// --- Maple River: bears ---
function updateBears(dt){
  if(!AS.bears) return;
  for(const b of AS.bears){
    const d=Math.abs(b.x-boat.x);
    b.t+=dt;
    if(b.st==='swipe'){
      if(b.t>.4 && !b.hit){ b.hit=true; if(Math.abs(b.x-boat.x)<205){ gameOver('bear',b); return; } }
      if(b.t>1.1){ b.st='growl'; b.t=0; b.close=0; }
      continue;
    }
    if(d<330 && S.mode==='play'){
      if(b.st!=='growl'){ b.st='growl'; b.t=0; toast('Bear! Row away from the shore!',1.8); }
      b.dir=boat.x>b.x?1:-1;
      b.x=clamp(b.x+b.dir*34*dt,b.lo,b.hi);
      b.roarT-=dt; if(b.roarT<=0){ b.roarT=1.3; sfx.roar(); }
      if(d<175){ b.close+=dt; if(b.close>.7){ b.st='swipe'; b.t=0; b.hit=false; sfx.roar(); } }
      else b.close=Math.max(0,b.close-dt);
    } else {
      if(b.st==='growl'){ b.st='walk'; b.close=0; }
      if(b.pause>0){ b.pause-=dt; continue; }
      b.x+=b.dir*24*dt;
      if(b.x<b.lo){ b.x=b.lo; b.dir=1; } if(b.x>b.hi){ b.x=b.hi; b.dir=-1; }
      if(Math.random()<dt*.12){ b.pause=rand(2,4); b.st='fish'; b.t=0; }
      else if(b.pause<=0 && b.st==='fish') b.st='walk';
    }
  }
}
const nearBear=()=>AS.bears && AS.bears.find(b=>b.st==='growl'||b.st==='swipe');

// --- The Luminous Cave: fish in holes come out only while you keep still ---
function updateDen(f,dt,len){
  const h=f.home;
  if(f.state==='den'){
    f.x=h.x; f.y=h.y; f.dir=h.dir;
    if(f.cool<=0 && !hooked && !approacher && stillT>1.1 && hook.y>40 && Math.hypot(hook.x-h.x,hook.y-h.y)<200){ f.state='peek'; f.peekT=0; }
    return;
  }
  if(f.state==='peek'){
    f.peekT+=dt; f.x=h.x+h.dir*Math.min(1,f.peekT/.9)*len*.55; f.y=h.y;
    if(stillT<.05 || hooked || approacher){ f.state='return'; return; }
    if(f.peekT>1.1){ f.state='approach'; approacher=f; }
    return;
  }
  // 'return': dart back into the hole
  const dx=h.x-f.x, dy=h.y-f.y, d=Math.hypot(dx,dy);
  if(d<5){ f.state='den'; f.cool=2.5; return; }
  f.dir = dx>0?1:-1; const sp=Math.min(d,160*dt); f.x+=dx/d*sp; f.y+=dy/d*sp;
}

// --- The Frozen Lake: holes in the ice ---
const holeAt = x => AS.ice && AS.ice.find(h=>Math.abs(h.x-x)<34);
function updateIce(dt){
  if(!AREA.frozen) return;
  const h=holeAt(boat.tipX);
  if(keys.down && !h && hook.L<1){
    if(!iceSmash || Math.abs(iceSmash.x-boat.tipX)>20) iceSmash={x:boat.tipX,p:0,k:0};
    iceSmash.p+=dt; if(iceSmash.p>iceSmash.k*.28){ iceSmash.k++; sfx.crack(); for(let i=0;i<5;i++) parts.push({x:iceSmash.x+rand(-10,10),y:-6,vx:rand(-90,90),vy:rand(-200,-80),life:.5,max:.5,r:rand(1.5,3),k:'ice'}); }
    if(iceSmash.p>=1.1){ AS.ice.push({x:iceSmash.x,r:22}); iceSmash=null; sfx.plop(); for(let i=0;i<14;i++) parts.push({x:boat.tipX+rand(-14,14),y:-6,vx:rand(-120,120),vy:rand(-260,-90),life:.7,max:.7,r:rand(2,4),k:'ice'}); }
  } else if(!keys.down && iceSmash) iceSmash.p=Math.max(0,iceSmash.p-dt*.5);
}

// --- The Guardian's Lake: the legendary dragon shows up now and then ---
function updateLegend(dt){
  if(AREA.id!=='guardian') return;
  if(fishes.some(f=>f.def.legend)) return;
  legendT-=dt; if(legendT>0) return;
  legendT=rand(45,75);
  const def=FISH_BY_ID.dragon, n=fishes.length;
  for(let k=0;k<20;k++){ const x=rand(900,WORLD_W-900); if(Math.abs(x-boat.x)<500) continue; spawnAt(def,x,rand(def.min+60,Math.min(def.max,bed(x)-120))); break; }
  const f=fishes[n]; if(!f) return; f.life=rand(60,80); f.dir=f.x<boat.x?1:-1;
  toast('The water shimmers… the Guardian is near!',2.6); sfx.rare();
}

// ---------- update ----------
function update(dt){
  t+=dt;
  // boat
  const acc=520*(mods.boat||1), maxV=220*(mods.boat||1);
  let dirIn=(keys.right?1:0)-(keys.left?1:0);
  if(AREA.frozen && hook.L>3 && dirIn){ dirIn=0; if(t>moveHintT){ moveHintT=t+3; toast('Reel in your line before you move',1.4); } }
  const slow = hooked && !attack;   // a fish on the line slows the boat, but not while a shark is after you
  if(dirIn) boat.vx+=dirIn*acc*dt*(slow?.4:1); else if(CURRENT() && !AREA.frozen) boat.vx+=(CURRENT()*.5-boat.vx)*Math.min(1,dt*1.2); else boat.vx*=Math.pow(.15,dt);
  boat.vx=clamp(boat.vx,-maxV*(slow?.5:1),maxV*(slow?.5:1));
  boat.x+=boat.vx*dt;
  if(boat.x<160){boat.x=160;boat.vx=0} if(boat.x>WORLD_W-160){boat.x=WORLD_W-160;boat.vx=0}
  if(typeof blockBoat==='function') blockBoat();   // fallen boulders in the cave (rockfall.js)
  if(boat.vx>25) boat.facing=1; else if(boat.vx<-25) boat.facing=-1;
  boat.y=AREA.frozen?-24:wave(boat.x,t); boat.tilt=AREA.frozen?0:(wave(boat.x+40,t)-wave(boat.x-40,t))/80;
  const tp=sprTip(currentMood()), ra=boat.tilt*.6, rtx=-boat.facing*tp[0], rty=tp[1]-14;
  const tipX=boat.x+rtx*Math.cos(ra)-rty*Math.sin(ra), tipY=boat.y+rtx*Math.sin(ra)+rty*Math.cos(ra);
  boat.tipX=tipX; boat.tipY=tipY;

  idleT = (keys.left||keys.right||keys.up||keys.down) ? 0 : idleT+dt;
  stillT = (keys.left||keys.right||keys.up||keys.down||Math.abs(boat.vx)>15) ? 0 : stillT+dt;
  updateIce(dt);
  // line
  const reeling=keys.up;
  if(hooked) updateHooked(dt,reeling);
  else{
    if(reeling) hook.L-=reelSpeed()*dt;
    if(keys.down && (!AREA.frozen || holeAt(tipX))) hook.L+=280*dt;
    hook.offset*=Math.pow(.2,dt);
  }
  hook.L=clamp(hook.L,0,MAX_L);
  const iceH=AREA.frozen&&holeAt(tipX), baseX=iceH?iceH.x:tipX;
  hook.x+=(baseX+hook.offset+CURRENT()*1.4*Math.min(1,hook.L/350)-hook.x)*Math.min(1,dt*(hooked?3:2.2));
  const floor=bed(hook.x)-(hooked&&!hooked.def.inert&&hooked.def.move!=='crawl' ? Math.max(12,hooked.def.len*hooked.sz*.5) : 12); if(hook.L>floor) hook.L=floor;
  hook.prevY=hook.y; hook.y=hook.L;
  if(hook.prevY<=2 && hook.y>2 && !hooked) { sfx.plop(); for(let i=0;i<8;i++) parts.push({x:hook.x,y:0,vx:rand(-60,60),vy:rand(-120,-40),life:.6,max:.6,r:rand(1.5,3),k:'s'}); }

  updateFish(dt);
  if(hooked && hooked.def.inert){
    const len=hooked.def.len*hooked.sz; hooked.x=hook.x; hooked.y=hook.y+len*.42; hooked.heading=null;
  } else if(hooked){
    const len=hooked.def.len*hooked.sz, wig=phase==='thrash'?Math.sin(t*16)*.5:Math.sin(t*4)*.15;
    const a=Math.PI/2 - hooked.away*.75 + wig;
    hooked.x=hook.x+Math.cos(a)*len*.45; hooked.y=hook.y+Math.sin(a)*len*.45; hooked.heading=a+Math.PI;
    const fl=bed(hooked.x)-len*.18;
    if(hooked.y>fl){ const a2=a-hooked.away*1.1*clamp((hooked.y-fl)/(len*.4),0,1); hooked.x=hook.x+Math.cos(a2)*len*.45; hooked.y=Math.min(hook.y+Math.sin(a2)*len*.45, bed(hook.x+Math.cos(a2)*len*.45)-len*.18); hooked.heading=a2+Math.PI; }
    if(hook.y<1) { hooked.y=Math.max(hooked.y,2); }
  }
  popT-=dt; if(popT<=0){ popT=1; populate(true); }
  maybeStartAttack(dt);
  if(S.mode==='play') updateBears(dt);
  if(typeof updateRockfall==='function') updateRockfall(dt);   // falling rocks in the cave (rockfall.js)
  if(AREA.id==='maple' && Math.random()<dt*1.6) parts.push({k:'leaf',x:cam.x+viewW+20,y:0,rot:rand(0,6),c:['#d2462c','#e8782f','#f0a53a'][Math.floor(rand(0,3))],life:40,max:40});
  if(attack){ alarmT-=dt; if(alarmT<=0){ alarmT=.7; sfx.alarm(); } }

  // particles
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i]; p.life-=dt;
    if(p.k==='leaf'){ p.x+=CURRENT()*1.2*dt; p.rot+=dt*.4; if(p.x<cam.x-60) p.life=0; }
    else if(p.k==='b'){ p.x+=Math.sin(t*3+i)*12*dt+CURRENT()*.4*dt; p.y+=p.vy*dt; if(p.y<(AREA.frozen?16:0)) p.life=0; }
    else { p.vy+=600*dt; p.x+=p.vx*dt; p.y+=p.vy*dt; }
    if(p.life<=0) parts.splice(i,1);
  }
  if(Math.random()<dt*2){ const x=cam.x+rand(0,viewW); parts.push({x,y:bed(x)-4,vx:0,vy:rand(-45,-25),life:8,max:8,r:rand(1.5,3.5),k:'b'}); }

  // camera
  const tx=clamp(boat.x-viewW/2,0,WORLD_W-viewW);
  const top=-.4*viewH, maxTop=Math.max(top,AREA.deep+90-viewH);
  const ty=clamp(Math.max(top,hook.y-viewH*.62),top,maxTop);
  cam.x+=(tx-cam.x)*Math.min(1,dt*5); cam.y+=(ty-cam.y)*Math.min(1,dt*4);

  $('depth').textContent=(hook.y/PX_PER_M).toFixed(1)+' m';
}
