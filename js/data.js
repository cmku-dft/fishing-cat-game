// Whisker Lake · game data and pictures (lists come from data/*.js)
// Whisker Lake: game data. The lists themselves live in data/*.js (loaded by js/loader.js into DATA).
const CATS = DATA.cats;
const FISH = DATA.creatures;
const AREAS = DATA.places;
const FISH_BY_ID = Object.fromEntries(FISH.map(f=>[f.id,f]));
let AREA = AREAS[0];
// living area state (bears, holes in the ice and cave, ...), rebuilt on every trip to a place
let AS = {};
// hunters: who chases whom (not your hooked fish; that is what thieves do)
FISH_BY_ID.shark.hunt={R:180, food:p=>!p.def.inert && !p.def.shark && !p.def.turtle && p.def.len*p.sz<76};
for(const id of ['turtle1','turtle2','turtle3']) FISH_BY_ID[id].hunt={R:150, food:p=>p.def.id==='jelly' && p!==hooked};
FISH_BY_ID.squid.thief={speed:92, range:260, giveUp:300, time:9, name:'squid'};
FISH_BY_ID.otter.hunt={R:170, food:p=>!p.def.inert && p.def.len*p.sz<46 && p!==hooked};
FISH_BY_ID.duck.hunt={R:210, speed:115, food:p=>!p.def.inert && !p.def.critter && p.def.id!=='frog' && p.def.len*p.sz<44 && p.y<240 && p!==hooked};

const inArea = d => d.trash ? d.areas.includes(AREA.id) : d.area===AREA.id;
const areaLife = a => FISH.filter(d=>d.area===a.id && !d.trash && !d.critter);
const LIFE = FISH.filter(d=>!d.trash && !d.critter), JUNK = FISH.filter(d=>d.trash);
const areaDone = i => areaLife(AREAS[i]).every(d=>S.caught[d.id]);
// a place opens once you have found everything in the place before it
// once a place has been opened it stays open, even if a new creature is added to an earlier place later
function unlockedUpTo(){ let i=0; while(i<AREAS.length-1 && areaDone(i)) i++; const o=store.get('opened',0)|0; if(i>o) store.set('opened',i); return Math.max(i,o); }

// ---------- pictures ----------
function loadImg(src){ const i=new Image(); i.src=src; return i; }
for(const c of CATS) for(const m in c.poses) c.poses[m].img=loadImg(c.poses[m].image);
const squidImgs = FISH_BY_ID.squid.images.map(loadImg);
// your own creature drawings: add "image" to a creature in data/creatures.js
for(const f of FISH) if(f.image) f.img=loadImg(f.image);
