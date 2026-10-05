// Whisker Lake · screens and buttons: cat select, fish log, map, menu and saving, music, input, start-up
// ---------- UI ----------
let toastTimer=0;
function toast(msg,sec=1.6){ const el=$('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),sec*1000); }
let cardTimer=0;
function showCatch(def,isNew,pts,pearl){
  const el=$('catchCard'); el.innerHTML='';
  if(def.trash){ const n=document.createElement('span'); n.className='new'; n.style.background='var(--ink-soft)'; n.textContent='Trash'; el.append(n); }
  else if(isNew){ const n=document.createElement('span'); n.className='new'; n.textContent='New species'; el.append(n); }
  el.append(fishThumb(def,180,90,false));
  const h=document.createElement('h3'); h.textContent=def.name+(pearl?' + pearl':''); el.append(h);
  const p=document.createElement('p'); p.textContent=(pts>0?'+':'')+pts+' points · caught '+S.caught[def.id]+'×'; el.append(p);
  el.hidden=false; el.style.animation='none'; void el.offsetWidth; el.style.animation='';
  clearTimeout(cardTimer); cardTimer=setTimeout(()=>el.hidden=true,2600);
}
// ---------- saving ----------
// Auto-save: the trip (score, cat, boat position) is written every few seconds and when the page is hidden.
// The fish log and best score were already saved whenever they change.
const trip0=store.get('trip',null);
if(trip0){ S.score=trip0.score|0; if(trip0.cat!=null) S.cat=trip0.cat; if(trip0.x) boat.x=clamp(trip0.x,160,WORLD_W-160); }
function saveTrip(){ store.set('trip',{score:S.score, cat:S.cat, x:Math.round(boat.x)}); store.set('cat',S.cat); store.set('best',S.best); store.set('caught',S.caught); }
setInterval(()=>{ if(S.mode==='play') saveTrip(); },3000);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) saveTrip(); });
window.addEventListener('pagehide',saveTrip);
// Save code: version, cat, trip score, best, then how many of each creature you caught, in FISH order (new kinds go at the end).
function codeHash(str){ let h=7; for(const ch of str) h=(h*31+ch.charCodeAt(0))%46656; return h.toString(36).padStart(3,'0'); }
function makeCode(){
  const nums=[S.cat,S.score,S.best,...FISH.map(d=>S.caught[d.id]||0)];
  while(nums.length>3 && nums[nums.length-1]===0) nums.pop();
  const tok=[]; for(let i=0;i<nums.length;){ let j=i; while(i>2 && j<nums.length && nums[j]===0) j++;
    if(j-i>=2){ tok.push('z'+(j-i).toString(36)); i=j; } else { tok.push(nums[i].toString(36)); i++; } }   // runs of zeros -> zN
  const body=tok.join('.');
  return ('WL1-'+body+'-'+codeHash(body)).toUpperCase();
}
function readCode(txt){
  const m=String(txt).trim().toLowerCase().replace(/\s+/g,'').match(/^wl1-([0-9a-z.\-]+)-([0-9a-z]{3})$/);
  if(!m || codeHash(m[1])!==m[2]) return null;
  const n=[]; for(const x of m[1].split('.')){ if(x[0]==='z'){ const k=parseInt(x.slice(1),36); if(!(k>0&&k<500)) return null; for(let i=0;i<k;i++) n.push(0); } else n.push(parseInt(x,36)); }
  if(n.length<3 || n.some(x=>!Number.isFinite(x))) return null;
  const caught={}; FISH.forEach((d,i)=>{ const v=n[3+i]; if(v>0) caught[d.id]=v; });
  return {cat:clamp(n[0],0,CATS.length-1), score:n[1], best:n[2], caught};
}
let resetArmed=0;
function openSaves(){
  S.prevMode=S.mode; S.mode='saves'; for(const k in keys) keys[k]=false; saveTrip();
  $('saveCode').value=makeCode(); $('loadCode').value=''; $('saveMsg').textContent=''; resetArmed=0; $('resetBtn').textContent='Reset everything';
  $('saves').hidden=false;
}
function closeSaves(){ $('saves').hidden=true; S.mode=S.prevMode||'select'; if(S.mode==='over' && $('over').hidden){ S.mode='play'; $('help').hidden=false; $('touch').hidden=false; } if(S.mode==='select'){ buildCats(); selNote(); } }
function saveMsg(t,ok){ const e=$('saveMsg'); e.textContent=t; e.style.color=ok?'var(--good)':'var(--bad)'; }
function selNote(){
  $('pickNote').textContent = S.score ? `Welcome back! Your trip is saved with ${S.score} points. Set sail to keep fishing.` : 'Each cat has a fishing talent. Choose one to set sail.';
  $('startBtn').textContent = S.score ? 'Keep fishing' : 'Set sail';
}
$('saveBtn').onclick=openSaves; $('selSaveBtn').onclick=openSaves; $('savesClose').onclick=closeSaves;
$('copyBtn').onclick=async()=>{ const el=$('saveCode'); el.select(); let ok=false;
  try{ await navigator.clipboard.writeText(el.value); ok=true; }catch(e){ try{ ok=document.execCommand('copy'); }catch(e2){} }
  saveMsg(ok?'Copied! Keep the code somewhere safe.':'Select the code and copy it yourself.',ok); };
$('loadBtn').onclick=()=>{ const d=readCode($('loadCode').value);
  if(!d){ saveMsg('That code doesn\'t look right. Check it and try again.',false); return; }
  if(hooked){ hooked.state='swim'; hooked=null; $('fight').hidden=true; }
  S.cat=d.cat; S.score=d.score; S.best=Math.max(d.best,d.score); S.caught=d.caught; mods=CATS[S.cat].mods; if(S.area>unlockedUpTo()) travel(unlockedUpTo()); saveTrip(); updateHud();
  $('saveCode').value=makeCode(); saveMsg('Loaded! Welcome back, '+CATS[S.cat].name+'.',true); };
$('restartBtn').onclick=()=>{ newTrip(); saveTrip(); updateHud(); $('saveCode').value=makeCode(); saveMsg('New trip started. Your fish log and best score are kept.',true); };
$('resetBtn').onclick=()=>{
  if(!resetArmed){ resetArmed=1; $('resetBtn').textContent='Tap again to erase'; saveMsg('This erases your fish log and best score on this device. Tap again to confirm.',false); setTimeout(()=>{ resetArmed=0; $('resetBtn').textContent='Reset everything'; },4000); return; }
  resetArmed=0; $('resetBtn').textContent='Reset everything';
  newTrip(); S.caught={}; S.best=0; S.cat=0; mods=CATS[0].mods; travel(0);
  for(const k of ['trip','caught','best','cat','area','opened']) try{ localStorage.removeItem('whisker-'+k); }catch(e){}
  saveTrip(); updateHud(); $('saveCode').value=makeCode(); saveMsg('Everything has been reset. Happy fishing!',true); };

// ---------- music ----------
// each place can have its own track (data/places.js "music"); switching place fades one track into the next
const MUSIC_VOL=.35;
const music=new Audio(AREA.music||'assets/music.mp3'); music.loop=true; music.volume=MUSIC_VOL; music.preload='auto';
let musicFade=0;
function setAreaMusic(){
  const want=AREA.music||'assets/music.mp3';
  if(music.src.endsWith(want)) return;
  const wasPlaying=!music.paused; clearInterval(musicFade);
  if(!wasPlaying){ music.src=want; return; }
  musicFade=setInterval(()=>{ music.volume=Math.max(0,music.volume-.04);
    if(music.volume<=0){ clearInterval(musicFade); music.src=want; music.volume=MUSIC_VOL; playMusic(); } },50);
}
S.music=store.get('music',true);
function playMusic(){ if(S.music && !document.hidden){ const p=music.play(); if(p&&p.catch) p.catch(()=>{}); } }
$('musicBtn').onclick=()=>{ S.music=!S.music; store.set('music',S.music); if(S.music) playMusic(); else music.pause(); updateHud(); };
document.addEventListener('visibilitychange',()=>{ if(document.hidden) music.pause(); else if(S.mode!=='select') playMusic(); });

function updateHud(){
  const c=CATS[S.cat]; $('hudCat').src=c.image; $('hudName').textContent=c.name+' · '+AREA.name; $('hudPerk').textContent=c.perk+': '+c.perkText.toLowerCase();
  $('score').textContent=S.score; { const al=areaLife(AREA); $('dexCount').textContent=al.filter(d=>S.caught[d.id]).length+'/'+al.length; }
  $('soundBtn').textContent=S.sound?'Sound on':'Sound off';
  $('musicBtn').textContent=S.music?'Music on':'Music off';
}
function buildCats(){
  const wrap=$('cats'); wrap.innerHTML='';
  CATS.forEach((c,i)=>{
    const b=document.createElement('button'); b.className='catcard'; b.id='cat-'+c.id; b.setAttribute('aria-pressed',String(i===S.cat));
    b.innerHTML=`<img alt="" src="${c.image}"><b>${c.name}</b><span class="clan">${c.clan} · ${c.rank}</span><span class="perk"><em>${c.perk}.</em> ${c.perkText}</span>`;
    b.onclick=()=>{ S.cat=i; store.set('cat',i); [...wrap.children].forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i))); $('pickNote').textContent=c.name+' is ready to fish.'; };
    b.ondblclick=start;
    wrap.append(b);
  });
  if(typeof selNote==='function') selNote();
}
function start(){
  mods=CATS[S.cat].mods; S.mode='play'; audio();
  $('select').hidden=true; $('hud').hidden=false; $('help').hidden=false; $('touch').hidden=false;
  updateHud(); playMusic(); saveTrip(); toast(S.score?CATS[S.cat].name+' is back on the lake!':CATS[S.cat].name+' sets sail!');
}
function dexWhere(def){
  if(def.rare) return 'Rare · any depth';
  if(def.legend) return 'Legendary · deep water';
  if(def.hole) return 'Holes in the cave floor';
  const a=AREAS.find(a=>a.id===def.area)||AREA;
  if(def.move==='static'||def.move==='crawl') return def.minBed>=550?'Deep '+a.floor.toLowerCase():a.floor;
  return Math.round(def.min/PX_PER_M)+'–'+Math.round(def.max/PX_PER_M)+' m';
}
function dexItem(def,g){
  const n=S.caught[def.id]||0;
  const d=document.createElement('div'); d.className='dexitem'+(def.trash?' trash':'');
  d.append(fishThumb(def,150,64,!n&&!def.trash));
  const b=document.createElement('b'); b.textContent=(n||def.trash)?def.name:'???'; d.append(b);
  const s=document.createElement('span');
  s.textContent=dexWhere(def)+' · '+def.pts+' pts'+(def.id==='oyster'?' (+250 with a pearl)':'')+(n?' · caught '+n+'×':'');
  d.append(s); g.append(d);
}
function openDex(){
  S.mode='dex'; $('dex').hidden=false;
  const g=$('dexGrid'); g.innerHTML=''; const un=unlockedUpTo();
  AREAS.forEach((a,i)=>{
    const life=areaLife(a), n=life.filter(d=>S.caught[d.id]).length;
    const h=document.createElement('h3'); h.className='junkhead'; h.textContent=a.name+' ';
    const sp=document.createElement('span'); sp.textContent = i>un ? 'Not discovered yet' : n+' of '+life.length+' found'+(n===life.length?' · complete!':''); h.append(sp); g.append(h);
    if(i>un) return;
    const grid=document.createElement('div'); grid.className='dexgrid'; life.forEach(d=>dexItem(d,grid)); g.append(grid);
  });
  const j=$('junkGrid'); j.innerHTML=''; JUNK.forEach(d=>dexItem(d,j));
  const found=LIFE.filter(d=>S.caught[d.id]).length, junk=JUNK.reduce((a,d)=>a+(S.caught[d.id]||0),0);
  $('dexSummary').textContent=`You have found ${found} of ${LIFE.length} kinds of sea life and pulled ${junk} ${junk===1?'piece':'pieces'} of trash out of the lake. Score this trip: ${S.score}. Best trip: ${S.best}.`;
}
$('dexBtn').onclick=openDex;
// ---------- map ----------
$('mapImg').src='assets/map.jpg';
let mapSel=0;
function openMap(){ S.prevMode=S.mode; S.mode='map'; for(const k in keys) keys[k]=false; $('mapBtn').classList.remove('new'); mapSel=S.area; buildMap(); $('map').hidden=false; }
function closeMap(){ $('map').hidden=true; S.mode=S.prevMode==='map'?'play':(S.prevMode||'play'); }
function buildMap(){
  const un=unlockedUpTo(), wrap=$('mapWrap');
  wrap.querySelectorAll('.pin').forEach(p=>p.remove());
  let svg=''; for(let i=0;i<AREAS.length-1;i++){ const a=AREAS[i].map, b=AREAS[i+1].map, open=i<un;
    svg+=`<line x1="${a[0]}" y1="${a[1]*.75}" x2="${b[0]}" y2="${b[1]*.75}" stroke="${open?'#ffd76a':'rgba(255,255,255,.8)'}" stroke-width="${open?.9:.6}" stroke-dasharray="${open?'none':'1.6 1.3'}" stroke-linecap="round"/>`; }
  $('mapPath').innerHTML=svg;
  AREAS.forEach((a,i)=>{
    const b=document.createElement('button'); b.className='pin'+(i>un?' locked':'')+(areaDone(i)?' done':'')+(i===S.area?' here':'');
    b.style.left=a.map[0]+'%'; b.style.top=a.map[1]+'%'; b.textContent=i+1; b.setAttribute('aria-pressed',String(i===mapSel));
    b.setAttribute('aria-label',a.name+(i>un?' (locked)':i===S.area?' (you are here)':''));
    b.onclick=()=>{ mapSel=i; buildMap(); };
    wrap.append(b);
  });
  const a=AREAS[mapSel], life=areaLife(a), n=life.filter(d=>S.caught[d.id]).length, go=$('mapGo');
  $('mapName').textContent=(mapSel+1)+'. '+a.name;
  if(mapSel>un){ const p=AREAS[mapSel-1], pl=areaLife(p), pn=pl.filter(d=>S.caught[d.id]).length;
    $('mapText').textContent=a.blurb+' '+(mapSel-1>un?'Still far away.':`Find all ${pl.length} kinds of creatures in ${p.name} to open the trail (${pn} of ${pl.length} so far).`);
    go.textContent='Locked'; go.disabled=true; }
  else { $('mapText').textContent=a.blurb+` You have found ${n} of ${life.length} kinds here.`;
    go.disabled=false; go.textContent= mapSel===S.area ? 'Keep fishing here' : 'Travel here'; }
}
$('mapGo').onclick=()=>{ const i=mapSel; closeMap();
  if(i!==S.area){ travel(i); saveTrip(); toast(CATS[S.cat].name+' arrives at '+AREAS[i].name+'!',2.2); if(AREAS[i].tip) setTimeout(()=>toast(AREAS[i].tip,3.4),2300); } };
$('mapBtn').onclick=openMap; $('mapClose').onclick=closeMap;
function showWin(){ S.prevMode=S.mode; S.mode='win'; for(const k in keys) keys[k]=false;
  $('winText').textContent=`${CATS[S.cat].name} has found every creature in every place on the map, all the way to the Guardian of the lake. You are a true legend of the lakes! Best trip: ${S.best} points.`;
  $('win').hidden=false; $('winBtn').focus(); }
$('winBtn').onclick=()=>{ $('win').hidden=true; S.mode='play'; };
$('dexClose').onclick=()=>{ $('dex').hidden=true; S.mode='play'; };
$('catBtn').onclick=()=>{ if(attack) endAttack(null); $('saves').hidden=true; S.mode='select'; buildCats(); $('select').hidden=false; $('hud').hidden=true; $('help').hidden=true; $('touch').hidden=true; $('fight').hidden=true; if(hooked){hooked.state='swim';hooked=null;} };
$('startBtn').onclick=start;
$('againBtn').onclick=()=>{ newTrip(); start(); };
$('overCatBtn').onclick=()=>{ newTrip(); $('catBtn').click(); };
$('soundBtn').onclick=()=>{ S.sound=!S.sound; updateHud(); if(S.sound) audio(); };

const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',Space:'up',ArrowDown:'down',KeyS:'down'};
window.addEventListener('keydown',e=>{ const k=KEYMAP[e.code]; if(k&&S.mode==='play'){ keys[k]=true; e.preventDefault(); } if(e.code==='Escape'&&S.mode==='dex') $('dexClose').click(); if(e.code==='Escape'&&S.mode==='saves') closeSaves(); if(e.code==='Escape'&&S.mode==='map') closeMap(); });
window.addEventListener('keyup',e=>{ const k=KEYMAP[e.code]; if(k) keys[k]=false; });
window.addEventListener('blur',()=>{ for(const k in keys) keys[k]=false; });
document.querySelectorAll('#touch button').forEach(b=>{
  const k=b.dataset.k, on=e=>{e.preventDefault(); keys[k]=true; b.classList.add('on');}, off=()=>{keys[k]=false; b.classList.remove('on');};
  b.addEventListener('pointerdown',on); ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,off));
});

// ---------- boot ----------
function boot(data){
  if(data && data.score!=null){ S.score=data.score; S.cat=data.cat??S.cat; }
  resize(); travel(Math.min(store.get('area',0)|0,unlockedUpTo()),true); buildCats(); updateHud(); selNote();
  cam.x=clamp(boat.x-viewW/2,0,WORLD_W-viewW); cam.y=-.4*viewH;
  if(data && data.mode==='play') start();
  requestAnimationFrame(frame);
}
boot({});
