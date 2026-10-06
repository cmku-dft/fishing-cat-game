// Whisker Lake · drawings of every creature and the fish log pictures
// ---------- drawings of the new creatures (centered at origin, facing +x) ----------
const FSHAPE={trout:.19,pike:.12,deep:.33,catfish:.16,sturgeon:.12,small:.17,sculpin:.17,carp:.25,icefish:.15};
function drawGeneric(c,def,L,tt,o){
  const k=def.look, sh=k.shape, rx=L/2, wag=Math.sin(tt*(o.fast?18:9))*.28, ry=L*FSHAPE[sh]*(k.long?.85:1), finC=k.fin||k.top;
  c.save(); if(k.alpha) c.globalAlpha=k.alpha; c.lineJoin='round'; c.lineCap='round';
  // tail
  if(sh==='sturgeon'){ c.save(); c.translate(-rx+4,0); c.rotate(wag*.5); fin(c,[0,-ry*.3,-L*.2,-ry*2.4,-L*.13,0,-L*.15,ry*1,0,ry*.3],finC); c.restore(); }
  else tail(c,-rx+3,ry*(sh==='deep'?.9:sh==='carp'?1.2:k.long?.8:1.15),L*(sh==='pike'?.2:sh==='deep'?.24:k.long?.16:.27),wag,finC,false);
  // dorsal fins
  if(k.sail){ fin(c,[-rx*.3,-ry*.8,-rx*.28,-ry*2.5,rx*.1,-ry*2.4,rx*.38,-ry*.85],finC); c.fillStyle='rgba(255,255,255,.35)'; for(let i=0;i<5;i++){ ellipse(c,-rx*.2+i*rx*.11,-ry*1.6+((i*5)%3)*ry*.2,1.4,1.4); c.fill(); } }
  else if(sh==='pike') fin(c,[-rx*.5,-ry*.8,-rx*.62,-ry*1.9,-rx*.32,-ry*.85],finC);
  else if(sh==='deep') fin(c,[-rx*.55,-ry*.85,-rx*.25,-ry*1.35,rx*.25,-ry*1.2,rx*.38,-ry*.75],finC);
  else if(sh==='sturgeon') fin(c,[-rx*.55,-ry*.8,-rx*.68,-ry*1.9,-rx*.4,-ry*.85],finC);
  else if(sh==='catfish' && k.long) fin(c,[-rx*.7,-ry*.7,-rx*.6,-ry*1.3,rx*.1,-ry*1.2,rx*.2,-ry*.8],finC);
  else if(sh==='sculpin'){ fin(c,[-rx*.1,-ry*.8,rx*.05,-ry*1.6,rx*.25,-ry*.85],finC); fin(c,[-rx*.6,-ry*.6,-rx*.5,-ry*1.4,-rx*.1,-ry*.8],finC); }
  else { fin(c,[-rx*.15,-ry*.85,0,-ry*1.75,rx*.22,-ry*.85],finC); if(sh==='trout') fin(c,[-rx*.6,-ry*.65,-rx*.66,-ry*1.05,-rx*.5,-ry*.7],finC); }
  if(k.spines){ c.strokeStyle='#3a3a22'; c.lineWidth=1.2; for(let i=0;i<3;i++){ const x=rx*(.25-i*.18); c.beginPath(); c.moveTo(x,-ry*.85); c.lineTo(x-2,-ry*1.6); c.stroke(); } }
  // anal fin
  fin(c,[-rx*.45,ry*.75,-rx*.55,ry*1.4,-rx*.25,ry*.8],finC);
  // body
  if(sh==='sculpin'){ body(c,rx*.95,ry*.85,k.top,k.belly); c.save(); c.translate(rx*.35,0); body(c,rx*.5,ry*1.25,k.top,k.belly); c.restore(); }
  else body(c,rx,ry,k.top,k.belly);
  if(sh==='pike'||sh==='sturgeon'){ c.beginPath(); c.moveTo(rx*.78,-ry*.62); c.quadraticCurveTo(rx+L*(sh==='pike'?.1:.14),-ry*.35,rx+L*(sh==='pike'?.12:.16),ry*.05); c.quadraticCurveTo(rx+L*.04,ry*.6,rx*.78,ry*.62); c.closePath(); c.fillStyle=k.top; c.fill(); c.strokeStyle='rgba(30,20,10,.4)'; c.lineWidth=1.1; c.stroke(); }
  // pattern
  c.save(); ellipse(c,0,0,sh==='sculpin'?rx*.95:rx,sh==='sculpin'?ry*.85:ry); c.clip();
  const pc=k.patCol, R=(i,a)=>((i*a)%100)/100;
  switch(k.pat){
    case 'spots': c.fillStyle=pc; for(let i=0;i<16;i++){ ellipse(c,-rx*.85+R(i,37)*rx*1.6,-ry*.85+R(i,53)*ry*1.2,ry*.09+R(i,17)*ry*.05,ry*.09+R(i,17)*ry*.05); c.fill(); }
      if(k.pat2){ for(let i=0;i<6;i++){ const x=-rx*.6+R(i,41)*rx*1.1, y=-ry*.2+R(i,23)*ry*.5; c.fillStyle='rgba(255,255,255,.6)'; ellipse(c,x,y,ry*.13,ry*.13); c.fill(); c.fillStyle=k.pat2; ellipse(c,x,y,ry*.08,ry*.08); c.fill(); } } break;
    case 'stripe': c.fillStyle=pc; c.fillRect(-rx,-ry*.15,rx*2,ry*.38); if(k.pat2){ c.fillStyle=k.pat2; for(let i=0;i<22;i++){ ellipse(c,-rx*.9+R(i,37)*rx*1.8,-ry*.9+R(i,53)*ry*.7,1.2,1.2); c.fill(); } } break;
    case 'speckle': c.fillStyle=pc; for(let i=0;i<20;i++){ ellipse(c,-rx*.7+R(i,37)*rx*1.4,-ry*.7+R(i,53)*ry*.9,1.3,1.3); c.fill(); } break;
    case 'dots': c.fillStyle=pc; for(let i=0;i<14;i++){ ellipse(c,-rx*.8+R(i,37)*rx*1.5,-ry*.8+R(i,53)*ry*1.0,ry*.08,ry*.08); c.fill(); } break;
    case 'beans': c.fillStyle=pc; for(let i=0;i<14;i++){ ellipse(c,-rx*.8+R(i,37)*rx*1.5,-ry*.7+R(i,53)*ry*1.2,ry*.18,ry*.08); c.fill(); } break;
    case 'mottle': c.fillStyle=pc; c.globalAlpha*=.6; for(let i=0;i<10;i++){ ellipse(c,-rx*.8+R(i,37)*rx*1.6,-ry*.8+R(i,53)*ry*1.1,ry*.3,ry*.2); c.fill(); } break;
    case 'bars': c.fillStyle=pc; for(let i=0;i<6;i++) c.fillRect(-rx*.7+i*rx*.26,-ry,rx*.1,ry*2); break;
    case 'worms': c.strokeStyle=pc; c.lineWidth=1.2; for(let i=0;i<8;i++){ const x=-rx*.8+i*rx*.2, y=-ry*.5+R(i,37)*ry*.6; c.beginPath(); c.moveTo(x,y); c.quadraticCurveTo(x+5,y-4,x+10,y+1); c.stroke(); } break;
    case 'plates': c.fillStyle=pc; for(let i=0;i<9;i++){ const x=-rx*.75+i*rx*.18; for(const y of [-ry*.62,0]){ c.beginPath(); c.moveTo(x-3,y+2); c.lineTo(x,y-3); c.lineTo(x+3,y+2); c.fill(); } } break;
    case 'koi': c.fillStyle=pc; ellipse(c,-rx*.2,-ry*.55,rx*.32,ry*.45); c.fill(); ellipse(c,rx*.45,-ry*.6,rx*.18,ry*.35); c.fill(); ellipse(c,-rx*.7,-ry*.3,rx*.15,ry*.3); c.fill(); break;
    case 'scales': c.strokeStyle=pc; c.lineWidth=1; for(let i=0;i<9;i++) for(let j=0;j<4;j++){ const x=-rx*.75+i*rx*.18+(j%2)*rx*.09, y=-ry*.7+j*ry*.42; c.beginPath(); c.arc(x,y,ry*.18,-.3,Math.PI*.9); c.stroke(); } break;
  }
  c.restore();
  // pectoral fin, eye, mouth
  if(sh==='sculpin') fin(c,[rx*.2,ry*.1,-rx*.15,ry*1.2,rx*.25,ry*.7],finC); else fin(c,[rx*.35,ry*.25,rx*.12,ry*.95,rx*.3,ry*.65],finC);
  if(k.finEdge){ c.strokeStyle=k.finEdge; c.lineWidth=1.4; c.beginPath(); c.moveTo(-rx*.55,ry*1.4); c.lineTo(-rx*.25,ry*.8); c.moveTo(rx*.12,ry*.95); c.lineTo(rx*.3,ry*.65); c.stroke(); }
  if(k.earSpot){ c.fillStyle=k.earSpot; ellipse(c,rx*.4,-ry*.05,ry*.15,ry*.12); c.fill(); }
  const ex=sh==='pike'?rx*.72:sh==='sculpin'?rx*.62:rx*.66, ey=sh==='sculpin'?-ry*.55:-ry*.22;
  if(k.blind){ c.fillStyle='rgba(255,255,255,.55)'; ellipse(c,ex,ey,Math.max(1.5,ry*.12),Math.max(1.5,ry*.12)); c.fill(); }
  else eye(c,ex,ey,Math.max(2.2,ry*(sh==='deep'?.2:sh==='pike'||sh==='sturgeon'?.3:.27)));
  c.strokeStyle='rgba(30,20,10,.5)'; c.lineWidth=1.1; c.beginPath();
  if(sh==='catfish'||sh==='carp'||sh==='sturgeon'){ const mx=sh==='sturgeon'?rx+L*.08:rx*.95; c.moveTo(mx,ry*.25); c.quadraticCurveTo(mx+L*.08,ry*.6+Math.sin(tt*3)*2,mx+L*.03,ry*1.0); c.moveTo(mx-2,ry*.3); c.quadraticCurveTo(mx+L*.03,ry*.9,mx-L*.03,ry*1.2); if(sh==='catfish'){ c.moveTo(mx,-ry*.05); c.quadraticCurveTo(mx+L*.12,-ry*.4,mx+L*.1,ry*.2); } }
  else { c.moveTo(rx*.95,ry*.2); c.quadraticCurveTo(rx*.85,ry*.32,rx*.75,ry*.25); }
  c.stroke(); c.restore();
}
// a long wriggling body (glow eel and the Guardian dragon)
function serpentPts(L,tt,amp,N){ const pts=[]; for(let i=0;i<=N;i++){ const u=i/N; pts.push([-L/2+u*L*.9, Math.sin(tt*3-u*7)*L*amp*(1-u*.55)]); } return pts; }
function drawGlowEel(c,L,tt,o){
  const N=18, pts=serpentPts(L,tt*(o.fast?1.6:1),.06,N), w=L*.06;
  const th=u=>w*(u<.85?(.3+u*.82):1.0-(u-.85)*2.4);
  c.beginPath(); pts.forEach((p,i)=>{ const y=p[1]-th(i/N); i?c.lineTo(p[0],y):c.moveTo(p[0],y); }); for(let i=N;i>=0;i--) c.lineTo(pts[i][0],pts[i][1]+th(i/N)); c.closePath();
  c.fillStyle='#1f4a3a'; c.fill(); c.strokeStyle='rgba(10,30,20,.6)'; c.lineWidth=1.2; c.stroke();
  c.fillStyle='#b8ffb0'; for(let i=2;i<N-1;i+=2){ ellipse(c,pts[i][0],pts[i][1],1.8,1.8); c.fill(); }
  const h=pts[N]; c.fillStyle='#244f3e'; ellipse(c,h[0]+L*.04,h[1],L*.07,w*1.05); c.fill(); eye(c,h[0]+L*.07,h[1]-w*.35,w*.38);
}
function drawDragon(c,L,tt,o){
  const N=30, pts=serpentPts(L,tt*(o.fast?1.5:1),.05,N), w=L*.055;
  const th=u=>w*(u<.12?(.25+u*6.2):u>.9?1-(u-.9)*3:1);
  // tail flame
  const p0=pts[0]; c.fillStyle='#e8603a'; c.beginPath(); c.moveTo(p0[0]+6,p0[1]); for(let i=0;i<5;i++){ const a=-1.2+i*.6; c.lineTo(p0[0]-L*.08*Math.cos(a*.6)+Math.sin(tt*6+i)*3, p0[1]+L*.06*Math.sin(a)); c.lineTo(p0[0]-L*.02,p0[1]+L*.02*Math.sin(a+.3)); } c.closePath(); c.fill();
  // mane along the back
  for(let i=3;i<N-2;i++){ const u=i/N, p=pts[i], s=(i%2?1:.65)*w*1.4; c.fillStyle=i%2?'#e2563a':'#f59a3a'; c.beginPath(); c.moveTo(p[0]-w*.4,p[1]-th(u)+2); c.lineTo(p[0]-w*.2+Math.sin(tt*5+i)*2,p[1]-th(u)-s); c.lineTo(p[0]+w*.4,p[1]-th(u)+2); c.fill(); }
  // legs with claws
  for(const u of [.3,.68]){ const i=Math.round(u*N), p=pts[i]; c.strokeStyle='#2c7a5a'; c.lineWidth=w*.5; c.beginPath(); c.moveTo(p[0],p[1]); c.lineTo(p[0]+w*.6,p[1]+th(u)+w*1.1+Math.sin(tt*4+u*9)*3); c.stroke();
    c.strokeStyle='#f5d36b'; c.lineWidth=2; for(let k=-1;k<=1;k++){ c.beginPath(); c.moveTo(p[0]+w*.6,p[1]+th(u)+w*1.1); c.lineTo(p[0]+w*.6+k*5+5,p[1]+th(u)+w*1.6); c.stroke(); } }
  // body
  c.beginPath(); pts.forEach((p,i)=>{ const y=p[1]-th(i/N); i?c.lineTo(p[0],y):c.moveTo(p[0],y); }); for(let i=N;i>=0;i--) c.lineTo(pts[i][0],pts[i][1]+th(i/N)); c.closePath();
  const g=c.createLinearGradient(0,-w*2,0,w*2); g.addColorStop(0,'#2f8f6a'); g.addColorStop(.5,'#4fb488'); g.addColorStop(1,'#2f8f6a'); c.fillStyle=g; c.fill(); c.strokeStyle='rgba(20,50,35,.7)'; c.lineWidth=1.5; c.stroke();
  c.save(); c.clip();
  c.strokeStyle='#f2d27a'; c.lineWidth=w*.8; c.beginPath(); pts.forEach((p,i)=>{ const y=p[1]+th(i/N)*.65; i?c.lineTo(p[0],y):c.moveTo(p[0],y); }); c.stroke();
  c.strokeStyle='rgba(255,255,255,.28)'; c.lineWidth=1; for(let i=2;i<N;i++){ const p=pts[i]; c.beginPath(); c.arc(p[0],p[1]-w*.2,w*.45,-.4,Math.PI+.4); c.stroke(); }
  c.restore();
  // head
  const h=pts[N], hx=h[0]+L*.05, hy=h[1];
  c.strokeStyle='#f5d36b'; c.lineWidth=3; c.beginPath(); c.moveTo(hx-L*.01,hy-w*.6); c.quadraticCurveTo(hx-L*.04,hy-w*2.2,hx-L*.08,hy-w*2.5); c.moveTo(hx-L*.03,hy-w*1.6); c.lineTo(hx-L*.01,hy-w*2.1); c.stroke();
  c.fillStyle='#e2563a'; c.beginPath(); c.moveTo(hx-L*.05,hy-w*.4); for(let i=0;i<4;i++){ c.lineTo(hx-L*.07-i*4,hy-w*.9+i*w*.5+Math.sin(tt*5+i)*2); c.lineTo(hx-L*.045,hy-w*.3+i*w*.35); } c.fill();
  c.fillStyle='#3aa07a'; ellipse(c,hx,hy,L*.055,w*1.15); c.fill(); c.strokeStyle='rgba(20,50,35,.7)'; c.lineWidth=1.4; c.stroke();
  c.fillStyle='#4fb488'; ellipse(c,hx+L*.05,hy+w*.15,L*.035,w*.7); c.fill(); c.stroke();
  c.fillStyle='#f2d27a'; ellipse(c,hx+L*.045,hy+w*.55,L*.03,w*.25); c.fill();
  c.fillStyle='#ffe066'; ellipse(c,hx+L*.012,hy-w*.35,w*.32,w*.26); c.fill(); c.fillStyle='#1a1208'; ellipse(c,hx+L*.016,hy-w*.35,w*.1,w*.2); c.fill();
  c.strokeStyle='#f5d36b'; c.lineWidth=1.6; const wv=Math.sin(tt*2.4)*8; c.beginPath(); c.moveTo(hx+L*.08,hy+w*.1); c.quadraticCurveTo(hx+L*.02,hy+w*2+wv,hx-L*.1,hy+w*1.4-wv); c.moveTo(hx+L*.075,hy-w*.1); c.quadraticCurveTo(hx+L*.01,hy-w*1.6-wv,hx-L*.09,hy-w*1.1+wv); c.stroke();
}
function drawFrog(c,L,tt,o){
  const k=Math.max(0,Math.sin(tt*(o.fast?9:5))), ext=.5+k*.5, top='#5f9a3e', dk='#3f6f2a';
  const leg=(y,sgn)=>{ c.strokeStyle=dk; c.lineWidth=L*.08; c.beginPath(); c.moveTo(-L*.18,y); c.lineTo(-L*.18-L*.2*ext,y+sgn*L*.12*(1-ext)+sgn*L*.03); c.lineTo(-L*.18-L*.42*ext,y+sgn*L*.02); c.stroke();
    c.fillStyle=dk; c.beginPath(); c.moveTo(-L*.18-L*.42*ext,y+sgn*L*.02); c.lineTo(-L*.18-L*.56*ext,y-L*.07); c.lineTo(-L*.18-L*.56*ext,y+L*.09); c.closePath(); c.fill(); };
  c.lineCap='round'; leg(-L*.02,-1); leg(L*.05,1);
  c.fillStyle=top; ellipse(c,0,0,L*.3,L*.16); c.fill(); c.strokeStyle='rgba(20,40,10,.6)'; c.lineWidth=1.2; c.stroke();
  c.fillStyle='#d9e6a6'; ellipse(c,L*.02,L*.08,L*.24,L*.07); c.fill();
  c.fillStyle=dk; for(const [x,y] of [[-.12,-.06],[.02,-.09],[-.03,.0]]){ ellipse(c,L*x,L*y,L*.035,L*.025); c.fill(); }
  c.fillStyle=top; ellipse(c,L*.2,-L*.12,L*.06,L*.05); c.fill(); eye(c,L*.21,-L*.13,L*.04);
  c.strokeStyle='rgba(20,40,10,.7)'; c.beginPath(); c.moveTo(L*.3,L*.02); c.quadraticCurveTo(L*.2,L*.06,L*.1,L*.04); c.stroke();
  c.strokeStyle=top; c.lineWidth=L*.05; c.beginPath(); c.moveTo(L*.15,L*.1); c.lineTo(L*.24,L*.2*(.6+k*.4)); c.stroke();
}
function drawDuck(c,L,tt,o){
  const f=o.f||{}, under=f.y>14;
  if(under) c.rotate(f.state==='chase'?.55:-.45);
  else c.translate(0,-L*.06);
  const bob=under?0:Math.sin(tt*2)*1.2;
  c.translate(0,bob);
  c.fillStyle='#2b2b2b'; c.beginPath(); c.moveTo(-L*.36,-L*.05); c.lineTo(-L*.52,-L*.2); c.lineTo(-L*.46,-L*.02); c.fill();
  c.fillStyle='#9aa0a6'; ellipse(c,-L*.02,0,L*.4,L*.17); c.fill(); c.strokeStyle='rgba(30,30,30,.5)'; c.lineWidth=1.2; c.stroke();
  c.fillStyle='#7a4a2e'; ellipse(c,L*.24,L*.02,L*.16,L*.13); c.fill();
  c.fillStyle='#8a7a6a'; ellipse(c,-L*.06,-L*.05,L*.24,L*.09); c.fill(); c.fillStyle='#3a5fb8'; c.fillRect(-L*.16,-L*.03,L*.12,L*.04);
  c.fillStyle='#fff'; ellipse(c,L*.3,-L*.12,L*.08,L*.03); c.fill();
  c.fillStyle='#2f6b3a'; ellipse(c,L*.34,-L*.24,L*.12,L*.11); c.fill();
  c.fillStyle='#f2c230'; c.beginPath(); c.moveTo(L*.43,-L*.25); c.quadraticCurveTo(L*.58,-L*.24,L*.58,-L*.19); c.lineTo(L*.44,-L*.18); c.closePath(); c.fill();
  c.fillStyle='#111'; ellipse(c,L*.37,-L*.27,L*.022,L*.022); c.fill();
  if(under){ c.fillStyle='#f29a2a'; c.beginPath(); c.moveTo(-L*.1,L*.15); c.lineTo(-L*.22,L*.3+Math.sin(tt*14)*3); c.lineTo(-L*.02,L*.2); c.fill(); }
}
function drawOtter(c,L,tt,o){
  const sw=Math.sin(tt*(o.fast?10:5)), fur='#6b4a30', lt='#c9a27a';
  c.lineCap='round';
  c.strokeStyle=fur; c.lineWidth=L*.11; c.beginPath(); c.moveTo(-L*.3,0); c.quadraticCurveTo(-L*.42,sw*L*.05,-L*.55,sw*L*.08); c.stroke();
  c.lineWidth=L*.06; c.beginPath(); c.moveTo(-L*.15,L*.08); c.lineTo(-L*.25,L*.16+sw*4); c.moveTo(L*.15,L*.08); c.lineTo(L*.22,L*.16-sw*4); c.stroke();
  c.fillStyle=fur; ellipse(c,0,0,L*.34,L*.11); c.fill(); c.fillStyle=lt; ellipse(c,L*.08,L*.05,L*.24,L*.05); c.fill();
  c.fillStyle=fur; ellipse(c,L*.36,-L*.03,L*.11,L*.09); c.fill(); ellipse(c,L*.31,-L*.11,L*.025,L*.025); c.fill();
  c.fillStyle=lt; ellipse(c,L*.42,L*.0,L*.07,L*.05); c.fill(); c.fillStyle='#1b120c'; ellipse(c,L*.48,-L*.02,L*.018,L*.015); c.fill(); ellipse(c,L*.38,-L*.06,L*.016,L*.016); c.fill();
  c.strokeStyle='rgba(255,255,255,.7)'; c.lineWidth=.8; c.beginPath(); c.moveTo(L*.44,L*.01); c.lineTo(L*.54,-L*.01); c.moveTo(L*.44,L*.02); c.lineTo(L*.54,L*.04); c.stroke();
}
function drawOlm(c,L,tt,o){
  const sw=Math.sin(tt*(o.fast?9:4));
  c.fillStyle='#f2c6c0'; c.beginPath(); c.moveTo(L*.42,0); c.quadraticCurveTo(L*.3,-L*.08,0,-L*.065); c.quadraticCurveTo(-L*.35,-L*.05,-L*.5,sw*L*.04); c.quadraticCurveTo(-L*.35,L*.06,0,L*.065); c.quadraticCurveTo(L*.3,L*.08,L*.42,0); c.fill();
  c.strokeStyle='rgba(120,60,60,.5)'; c.lineWidth=1; c.stroke();
  c.strokeStyle='#f2c6c0'; c.lineWidth=2; for(const x of [L*.2,-L*.18]){ c.beginPath(); c.moveTo(x,L*.05); c.lineTo(x+sw*3,L*.13); c.stroke(); }
  c.strokeStyle='#e0566a'; c.lineWidth=1.6; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(L*.28,-L*.03+i*L*.02); c.lineTo(L*.22,-L*.1+i*L*.05+Math.sin(tt*6+i)*1.5); c.stroke(); }
}
function drawCrayfish(c,L,tt,o){
  const s=L/34, leg=Math.sin(tt*(o.fast?14:6)); c.save(); c.scale(s,s); c.lineCap='round';
  c.strokeStyle='#6b3f22'; c.lineWidth=1; c.beginPath(); c.moveTo(10,-2); c.quadraticCurveTo(22,-12,30,-6+leg); c.moveTo(10,-1); c.quadraticCurveTo(24,-6,32,0); c.stroke();
  c.lineWidth=1.4; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(4-i*4,3); c.lineTo(4-i*4+leg*(i%2?1:-1),9); c.stroke(); }
  for(let i=0;i<5;i++){ ellipse(c,-4-i*4.2,1+i*.4,4.4-i*.4,3.6-i*.3); fs(c,i%2?'#8a5530':'#9a6238',1); }
  c.beginPath(); c.moveTo(-24,1); c.lineTo(-30,-3); c.lineTo(-30,6); c.closePath(); fs(c,'#8a5530',1);
  ellipse(c,6,0,7,4.5); fs(c,'#9a6238',1.1);
  c.save(); c.translate(11,3); c.rotate(-.2+leg*.05); ellipse(c,7,0,6,3); fs(c,'#a8693a',1); c.restore();
  c.fillStyle='#111'; ellipse(c,10,-3,1,1); c.fill(); c.restore();
}
function drawCrab(c,L,tt,o){
  const s=L/40, leg=Math.sin(tt*(o.fast?14:6)); c.save(); c.scale(s,s); c.lineCap='round';
  c.strokeStyle='#9fb6d8'; c.lineWidth=2; for(let i=0;i<3;i++){ const x=-8+i*8; c.beginPath(); c.moveTo(x,2); c.lineTo(x-6+leg*(i%2?1:-1)*2,9); c.lineTo(x-9,14); c.stroke(); }
  ellipse(c,0,-2,14,9); fs(c,'#cfe0f2',1.2); c.fillStyle='rgba(255,255,255,.5)'; ellipse(c,-3,-6,7,3); c.fill();
  c.save(); c.translate(13,-1); c.rotate(-.3+leg*.06); ellipse(c,6,0,6,4); fs(c,'#dce9f7',1); c.restore();
  c.strokeStyle='#9fb6d8'; c.lineWidth=1.4; c.beginPath(); c.moveTo(6,-9); c.lineTo(7,-14); c.moveTo(2,-9); c.lineTo(2,-14); c.stroke(); c.fillStyle='#111'; ellipse(c,7,-14,1.4,1.4); c.fill(); ellipse(c,2,-14,1.4,1.4); c.fill();
  c.restore();
}
function drawMussel(c,L,tt,o){
  const w=L*.5, h=L*.22, open=o.open||0;
  ellipse(c,0,0,w,h); fs(c,'#2f3440',1.2); c.strokeStyle='rgba(140,160,120,.6)'; c.lineWidth=1; for(let i=1;i<4;i++){ c.beginPath(); c.ellipse(-w*.1,0,w*(1-i*.22),h*(1-i*.22),0,Math.PI*1.1,Math.PI*1.9); c.stroke(); }
  if(open>.3){ c.fillStyle='#e8964a'; ellipse(c,w*.1,h*.6,w*.5,h*.2*open); c.fill(); }
}
function drawSnail(c,L,tt,o){
  const s=L/18; c.save(); c.scale(s,s);
  c.fillStyle='#8a8676'; c.beginPath(); c.moveTo(-9,4); c.quadraticCurveTo(6,6,11,2); c.quadraticCurveTo(12,-1,9,-1); c.lineTo(-6,2); c.fill();
  c.strokeStyle='#8a8676'; c.lineWidth=1.2; c.beginPath(); c.moveTo(9,-1); c.lineTo(12,-6); c.moveTo(8,-1); c.lineTo(9,-6); c.stroke();
  ellipse(c,-1,-3,7,6.5); fs(c,'#b8863a',1); c.strokeStyle='#6b4a1e'; c.lineWidth=1.2; c.beginPath(); c.arc(-1,-3,4,0,Math.PI*1.6); c.stroke(); c.beginPath(); c.arc(-1,-3,1.8,0,Math.PI*1.6); c.stroke();
  c.restore();
}

// ---------- drawing helpers ----------
function setCam(p=1){ const s=scale*dpr; ctx.setTransform(s,0,0,s,-cam.x*p*s,-cam.y*s); }
function seeded(n){ let s=n*9301+49297; return ()=>{ s=(s*9301+49297)%233280; return s/233280; }; }
function ellipse(c,x,y,rx,ry){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);}
function eye(c,x,y,r){ c.fillStyle='#fff';ellipse(c,x,y,r,r);c.fill();c.fillStyle='#111';ellipse(c,x+r*.25,y,r*.58,r*.58);c.fill();c.fillStyle='#fff';ellipse(c,x+r*.4,y-r*.3,r*.2,r*.2);c.fill(); }
function tail(c,x,ry,len,wag,color,crescent){
  c.save();c.translate(x,0);c.rotate(wag);c.fillStyle=color;c.beginPath();
  if(crescent){c.moveTo(4,0);c.quadraticCurveTo(-len*.4,-ry*.3,-len,-ry*1.4);c.quadraticCurveTo(-len*.5,0,-len,ry*1.4);c.quadraticCurveTo(-len*.4,ry*.3,4,0);}
  else{c.moveTo(4,0);c.lineTo(-len,-ry);c.quadraticCurveTo(-len*.7,0,-len,ry);c.closePath();}
  c.fill();c.strokeStyle='rgba(30,20,10,.35)';c.lineWidth=1;c.stroke();c.restore();
}
function body(c,rx,ry,top,belly){
  const g=c.createLinearGradient(0,-ry,0,ry); g.addColorStop(0,top); g.addColorStop(.55,belly); g.addColorStop(1,belly);
  c.fillStyle=g; ellipse(c,0,0,rx,ry); c.fill(); c.strokeStyle='rgba(30,20,10,.4)'; c.lineWidth=1.2; c.stroke();
}
function fin(c,pts,color){ c.fillStyle=color; c.beginPath(); c.moveTo(pts[0],pts[1]); for(let i=2;i<pts.length;i+=2) c.lineTo(pts[i],pts[i+1]); c.closePath(); c.fill(); }

// fish drawn at origin, facing +x, total body length L
const SPECIAL_DRAW={crayfish:drawCrayfish, mussel:drawMussel, snail:drawSnail, frog:drawFrog, duck:drawDuck, otter:drawOtter, olm:drawOlm, gloweel:drawGlowEel, mooncrab:drawCrab, dragon:drawDragon};
// see-through fading for creatures that do that: faint body plus a few drifting sparkles
function fadeSparkles(c,def,L,h,tt,vis){
  if(def.fade && vis<.6){ c.globalAlpha=.25*(1-vis); c.fillStyle='#d8fbff'; for(let i=0;i<6;i++){ ellipse(c,-L*.4+((i*37+tt*20)%100)/100*L*.8,-h*.3+((i*53)%100)/100*h*.6,1.6,1.6); c.fill(); } }
}
// animated sprite sheet: one cell per frame, lined up on the snout, flipped so it faces +x like every other drawing
function drawSprite(c,def,sp,L,tt,o){
  const f=o.f||{}, vis=f.vis??1, k=L/sp.len;
  const fr=o.still ? 0 : Math.floor(((tt*sp.fps)%sp.frames+sp.frames)%sp.frames);
  const sx=(fr%sp.cols)*sp.w, sy=Math.floor(fr/sp.cols)*sp.h;
  // body centre = halfway along the body from the snout
  const cx=sp.snout[0]+sp.len/2, cy=sp.snout[1];
  c.save();
  if(sp.faces==='left') c.scale(-1,1);
  c.globalAlpha*= .07+.93*vis;
  c.drawImage(sp.img, sx,sy,sp.w,sp.h, -cx*k,-cy*k, sp.w*k,sp.h*k);
  c.restore();
  c.save(); fadeSparkles(c,def,L,L*.27,tt,vis); c.restore();
}
function drawFish(c,def,L,tt,o={}){
  const sp=def.sprite;
  if(sp && sp.img && sp.img.complete && sp.img.naturalWidth) return drawSprite(c,def,sp,L,tt,o);
  if(def.img && def.img.complete && def.img.naturalWidth){
    // your own drawings: a gentle swimming sway, and see-through fading for creatures that do that
    const h=L*def.img.naturalHeight/def.img.naturalWidth, f=o.f||{}, vis=f.vis??1, sw=Math.sin(tt*(o.fast?8:3));
    c.save(); c.rotate(sw*.05); c.scale(1+sw*.02,1-sw*.02);
    c.globalAlpha*= .07+.93*vis;
    c.drawImage(def.img,-L/2,-h/2,L,h);
    fadeSparkles(c,def,L,h,tt,vis);
    c.restore(); return; }
  if(def.look) return drawGeneric(c,def,L,tt,o);
  if(SPECIAL_DRAW[def.id]) return SPECIAL_DRAW[def.id](c,L,tt,o);
  if(def.id==='crystalshrimp'){ c.save(); c.globalAlpha=.55; drawCritter(c,FISH_BY_ID.shrimp,L,tt,o); c.restore(); return; }
  if(def.id==='glowjelly'){ c.save(); c.globalAlpha=.8; drawCritter(c,FISH_BY_ID.jelly,L,tt,o); c.restore(); return; }
  const rx=L/2, wag=Math.sin(tt*(o.fast?18:9))*.28;
  switch(def.id){
    case 'minnow':{ const ry=L*.18; tail(c,-rx+2,ry*1.1,L*.32,wag,'#7d977f'); body(c,rx,ry,'#6f8f72','#d9e6d5');
      c.strokeStyle='rgba(60,80,60,.5)';c.lineWidth=1.2;c.beginPath();c.moveTo(-rx*.7,0);c.lineTo(rx*.6,-1);c.stroke(); eye(c,rx*.6,-ry*.2,ry*.38); break; }
    case 'sardine':{ const ry=L*.17; tail(c,-rx+2,ry*1.2,L*.3,wag,'#365f88',true); body(c,rx,ry,'#2c5a88','#dfe9ef');
      c.fillStyle='rgba(30,50,80,.6)'; for(let i=0;i<4;i++){ellipse(c,rx*.35-i*rx*.28,-ry*.15,1.6,1.6);c.fill();} eye(c,rx*.62,-ry*.2,ry*.36); break; }
    case 'perch':{ const ry=L*.3; tail(c,-rx+3,ry*.9,L*.3,wag,'#e0583a');
      fin(c,[-rx*.5,-ry*.7,-rx*.1,-ry*1.55,rx*.25,-ry*1.3,rx*.4,-ry*.8],'#d7682f');
      body(c,rx,ry,'#e2a43a','#f8dd86');
      c.save();ellipse(c,0,0,rx,ry);c.clip();c.fillStyle='rgba(100,70,20,.42)';for(let i=0;i<5;i++)c.fillRect(-rx*.65+i*rx*.3,-ry,L*.05,ry*1.4);c.restore();
      fin(c,[-rx*.1,ry*.6,rx*.15,ry*1.2,rx*.3,ry*.6],'#e0583a'); eye(c,rx*.6,-ry*.15,ry*.3); break; }
    case 'mackerel':{ const ry=L*.19; tail(c,-rx+3,ry*.9,L*.3,wag,'#2b6f68',true); body(c,rx,ry,'#2a7d73','#e4ece6');
      c.save();ellipse(c,0,0,rx,ry);c.clip();c.strokeStyle='rgba(10,40,40,.7)';c.lineWidth=1.5;
      for(let i=0;i<7;i++){c.beginPath();const x=-rx*.8+i*rx*.26;c.moveTo(x,-ry);c.quadraticCurveTo(x+6,-ry*.6,x,-ry*.2);c.stroke();}c.restore();
      c.fillStyle='#d4c04a'; for(let i=0;i<4;i++) fin(c,[-rx*.55+i*6,-ry*.1-ry*.0,-rx*.55+i*6+3,-ry*.0-ry*.35,-rx*.55+i*6+5,-ry*.1],'#d4c04a');
      eye(c,rx*.65,-ry*.15,ry*.32); break; }
    case 'puffer':{ const p=o.puff?1.3:1, ry=L*.42*p, rxx=rx*p*.95; tail(c,-rxx+3,L*.14,L*.22,wag,'#b8954d');
      c.strokeStyle='#8a6b30';c.lineWidth=1.4; for(let i=0;i<18;i++){const a=i/18*Math.PI*2;c.beginPath();c.moveTo(Math.cos(a)*rxx*.95,Math.sin(a)*ry*.95);c.lineTo(Math.cos(a)*(rxx+L*.1*p),Math.sin(a)*(ry+L*.1*p));c.stroke();}
      body(c,rxx,ry,'#c9a456','#f4e8c4');
      c.fillStyle='rgba(90,60,20,.55)'; [[-.3,-.5],[.1,-.6],[-.5,-.1],[.2,-.25],[-.1,-.2]].forEach(([a,b])=>{ellipse(c,a*rxx,b*ry,L*.04,L*.04);c.fill();});
      fin(c,[0,ry*.1,-L*.12,ry*.45,-L*.04,ry*.15],'#c9a456'); eye(c,rxx*.5,-ry*.25,L*.1); c.fillStyle='#8a5a3a';ellipse(c,rxx*.95,ry*.1,2.2,1.6);c.fill(); break; }
    case 'salmon':{ const ry=L*.22; tail(c,-rx+3,ry*.95,L*.26,wag,'#6f8c9b'); fin(c,[-rx*.1,-ry*.8,rx*.15,-ry*1.4,rx*.3,-ry*.85],'#6f8c9b');
      body(c,rx,ry,'#5f7f91','#e7ecee');
      c.save();ellipse(c,0,0,rx,ry);c.clip();c.fillStyle='rgba(232,120,120,.55)';c.fillRect(-rx,-ry*.05,L,ry*.45);
      c.fillStyle='rgba(20,30,40,.6)';for(let i=0;i<14;i++){ellipse(c,-rx*.8+((i*37)%100)/100*rx*1.5,-ry*.7+((i*53)%40)/100*ry,1.3,1.3);c.fill();}c.restore();
      eye(c,rx*.66,-ry*.15,ry*.26); c.strokeStyle='rgba(30,20,10,.45)';c.beginPath();c.moveTo(rx*.92,ry*.25);c.lineTo(rx*.6,ry*.2);c.stroke(); break; }
    case 'eel':{ const N=18, w=L*.065, pts=[];
      for(let i=0;i<=N;i++){const u=i/N, x=-rx+u*L, y=Math.sin(tt*5-u*6)*L*.06*(1-u*.7); const th=w*(u<.85?(.35+.65*u/.85):1-(u-.85)/.15*.45); pts.push([x,y,th]);}
      c.fillStyle='#5f6b2c'; c.beginPath(); pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]-p[2]):c.moveTo(p[0],p[1]-p[2])); for(let i=N;i>=0;i--) c.lineTo(pts[i][0],pts[i][1]+pts[i][2]); c.closePath(); c.fill();
      c.strokeStyle='rgba(30,20,10,.45)';c.lineWidth=1.2;c.stroke();
      c.strokeStyle='#c8c27a';c.lineWidth=1.5;c.beginPath();pts.slice(2).forEach((p,i)=>i?c.lineTo(p[0],p[1]+p[2]*.55):c.moveTo(p[0],p[1]+p[2]*.55));c.stroke();
      const h=pts[N-1]; eye(c,h[0]+2,h[1]-w*.35,w*.38); break; }
    case 'swordfish':{ const ry=L*.15; tail(c,-rx+3,ry*1.2,L*.3,wag,'#22336a',true);
      fin(c,[-rx*.05,-ry*.8,rx*.15,-ry*2.6,rx*.4,-ry*.9],'#22336a');
      c.fillStyle='#3a4a7a';c.beginPath();c.moveTo(rx*.8,-ry*.25);c.lineTo(rx+L*.42,-ry*.05);c.lineTo(rx*.8,ry*.15);c.closePath();c.fill();
      body(c,rx,ry,'#24397a','#c4cde0'); fin(c,[rx*.2,ry*.5,rx*.05,ry*1.6,-rx*.05,ry*.6],'#2c3e78'); eye(c,rx*.66,-ry*.2,ry*.38); break; }
    case 'angler':{ const ry=L*.42; tail(c,-rx+3,ry*.6,L*.25,wag,'#3b2d27');
      c.strokeStyle='#5d4a3a';c.lineWidth=2;c.beginPath();c.moveTo(rx*.2,-ry*.9);c.quadraticCurveTo(rx*.6,-ry*2.1,rx+L*.25,-ry*1.2);c.stroke();
      body(c,rx,ry,'#3f312b','#6a5444');
      c.fillStyle='#1c120e';c.beginPath();c.moveTo(rx*1.02,-ry*.15);c.quadraticCurveTo(rx*.4,ry*.25,rx*1.02,ry*.6);c.closePath();c.fill();
      c.fillStyle='#f1eadc';for(let i=0;i<4;i++){const y=-ry*.1+i*ry*.17;c.beginPath();c.moveTo(rx*.98,y);c.lineTo(rx*.8,y+ry*.07);c.lineTo(rx*.98,y+ry*.12);c.fill();}
      eye(c,rx*.35,-ry*.45,ry*.18);
      c.fillStyle='#e9ff8a';ellipse(c,rx+L*.25,-ry*1.2,L*.06,L*.06);c.fill(); break; }
    case 'koi':{ const ry=L*.26; c.globalAlpha=.85; tail(c,-rx+3,ry*1.3,L*.4,wag*1.3,'#f6c64a'); c.globalAlpha=1;
      fin(c,[-rx*.4,-ry*.8,0,-ry*1.4,rx*.3,-ry*.85],'rgba(246,198,74,.85)');
      body(c,rx,ry,'#f0a316','#ffe08a');
      c.save();ellipse(c,0,0,rx,ry);c.clip();c.fillStyle='rgba(255,255,255,.8)';ellipse(c,-rx*.3,-ry*.4,rx*.3,ry*.4);c.fill();ellipse(c,rx*.4,ry*.3,rx*.22,ry*.3);c.fill();
      c.fillStyle='rgba(214,70,30,.55)';ellipse(c,rx*.1,-ry*.5,rx*.18,ry*.3);c.fill();c.restore();
      c.strokeStyle='#c98a20';c.lineWidth=1.2;c.beginPath();c.moveTo(rx*.95,ry*.2);c.quadraticCurveTo(rx*1.15,ry*.6,rx*1.05,ry*.9);c.stroke();
      eye(c,rx*.62,-ry*.2,ry*.24);
      if(o.sparkle!==false){c.fillStyle='rgba(255,250,200,'+(.5+.5*Math.sin(tt*6))+')';const sx=Math.sin(tt*2)*rx*.6;c.beginPath();c.moveTo(sx,-ry-8);c.lineTo(sx+2,-ry-2);c.lineTo(sx+8,-ry);c.lineTo(sx+2,-ry+2);c.lineTo(sx,-ry+8);c.lineTo(sx-2,-ry+2);c.lineTo(sx-8,-ry);c.lineTo(sx-2,-ry-2);c.fill();}
      break; }
    case 'shark':{ const ry=L*.15, jaw=o.jaw||0, top='#62788d', bel='#eef2f4';
      tail(c,-rx+6,ry*1.7,L*.26,wag*.7,top,true);
      fin(c,[-rx*.62,-ry*.55,-rx*.72,-ry*1.35,-rx*.5,-ry*.6],top);
      fin(c,[-rx*.12,-ry*.8,rx*.02,-ry*2.7,rx*.32,-ry*.85],top);
      const g=c.createLinearGradient(0,-ry,0,ry); g.addColorStop(0,top); g.addColorStop(.5,'#8fa3b4'); g.addColorStop(.62,bel); g.addColorStop(1,bel);
      c.beginPath(); c.moveTo(rx,ry*.12); c.bezierCurveTo(rx*.92,-ry*1.15,-rx*.3,-ry*1.2,-rx*.96,-ry*.22); c.lineTo(-rx*.96,ry*.22); c.bezierCurveTo(-rx*.3,ry*1.05,rx*.75,ry*1.1,rx,ry*.12); c.closePath();
      c.fillStyle=g; c.fill(); c.strokeStyle='rgba(30,40,50,.55)'; c.lineWidth=1.3; c.stroke();
      c.strokeStyle='rgba(40,55,70,.55)'; c.lineWidth=1.1; for(let i=0;i<4;i++){ const x=rx*(.46-i*.06); c.beginPath(); c.moveTo(x,-ry*.35); c.quadraticCurveTo(x-2,0,x,ry*.3); c.stroke(); }
      fin(c,[rx*.3,ry*.55,rx*.05,ry*1.9,-rx*.05,ry*.7],'#56697d');
      c.fillStyle='#10161c'; ellipse(c,rx*.72,-ry*.28,ry*.13,ry*.13); c.fill(); c.fillStyle='#fff'; ellipse(c,rx*.74,-ry*.33,ry*.04,ry*.04); c.fill();
      if(jaw){ const open=.5+.5*Math.abs(Math.sin(tt*6));
        c.beginPath(); c.moveTo(rx*.98,ry*.18); c.lineTo(rx*.55,ry*.35); c.lineTo(rx*.9,ry*(.4+.5*open)); c.closePath(); c.fillStyle='#5a1f22'; c.fill();
        c.fillStyle='#fff'; for(let i=0;i<4;i++){ const x=rx*(.6+i*.09); c.beginPath(); c.moveTo(x,ry*.3); c.lineTo(x+3,ry*.45); c.lineTo(x+6,ry*.3); c.fill(); }
      } else { c.strokeStyle='rgba(30,40,50,.6)'; c.lineWidth=1.2; c.beginPath(); c.moveTo(rx*.92,ry*.3); c.quadraticCurveTo(rx*.75,ry*.42,rx*.6,ry*.34); c.stroke(); }
      break; }
    case 'turtle1': case 'turtle2': case 'turtle3': drawTurtle(c,def,L,tt,o); break;
    case 'squid':{ const squidImg=squidImgs[(o.f&&o.f.col)||0]; if(!squidImg.complete||!squidImg.naturalWidth) break;
      const f=o.f||{}, col=f.col||0, grab=f.state==='chase'||f.state==='approach'||f.state==='hooked';
      const h=L*squidImg.naturalHeight/squidImg.naturalWidth, pulse=1+Math.sin(tt*(o.fast?9:3))*.05;
      c.save(); if(grab) c.scale(-1,1);   // swims mantle-first, but reaches for food tentacles-first
      c.scale(pulse,1/pulse); c.drawImage(squidImg,-L/2,-h/2,L,h); c.restore(); break; }
    default: drawCritter(c,def,L,tt,o);
  }
}
// sea turtles (side view, facing +x). Three kinds share one shape with their own colours.
const TURTLE_LOOK={
  turtle1:{shell:'#9a8442', dark:'#6b5a26', belly:'#e3d39a', skin:'#a8b46e', spots:'#7d8a4a'},
  turtle2:{shell:'#6f7f3c', dark:'#4a5628', belly:'#e9dfae', skin:'#93ad78', spots:'#5f7a4c'},
  turtle3:{shell:'#2f3b4a', dark:'#1b232c', belly:'#c9ced6', skin:'#53606f', spots:'#e6ebf0', ridges:true},
};
function drawTurtle(c,def,L,tt,o){
  const k=TURTLE_LOOK[def.id], rx=L*.36, ry=L*.2, sw=Math.sin(tt*(o.fast?7:2.4));
  c.lineCap='round'; c.lineJoin='round';
  const flipper=(x,y,len,w,ang,col)=>{ c.save(); c.translate(x,y); c.rotate(ang); c.beginPath(); c.moveTo(0,-w*.5); c.quadraticCurveTo(-len*.6,-w*.9,-len,0); c.quadraticCurveTo(-len*.55,w*.6,0,w*.5); c.closePath(); fs(c,col,1.1); c.restore(); };
  // far flippers (behind the shell)
  flipper(rx*.35,ry*.35,L*(def.id==='turtle3'?.42:.34),L*.09,-(.45+sw*.35),k.dark);
  flipper(-rx*.65,ry*.3,L*.16,L*.07,-(.25-sw*.2),k.dark);
  // head and neck
  c.save(); c.translate(rx*.95,-ry*.05+Math.sin(tt*1.3)*1.2);
  c.beginPath(); c.moveTo(-L*.1,-L*.05); c.quadraticCurveTo(L*.05,-L*.1,L*.14,-L*.03); c.quadraticCurveTo(L*.16,L*.04,L*.06,L*.06); c.quadraticCurveTo(-L*.04,L*.07,-L*.12,L*.05); c.closePath(); fs(c,k.skin,1.1);
  if(!k.ridges){ c.fillStyle=k.spots; for(const [a,b] of [[0,-.03],[.05,0],[-.04,.01]]){ ellipse(c,L*a,L*b,L*.012,L*.01); c.fill(); } }
  c.fillStyle='#14100c'; ellipse(c,L*.085,-L*.025,L*.016,L*.016); c.fill(); c.fillStyle='#fff'; ellipse(c,L*.09,-L*.03,L*.006,L*.006); c.fill();
  c.strokeStyle='rgba(30,20,10,.6)'; c.lineWidth=1; c.beginPath(); c.moveTo(L*.14,L*.0); c.quadraticCurveTo(L*.1,L*.03,L*.06,L*.02); c.stroke();
  c.restore();
  // shell: high dome, flat plastron
  c.beginPath(); c.moveTo(rx,ry*.25); c.bezierCurveTo(rx*.9,-ry*1.5,-rx*.9,-ry*1.6,-rx*1.05,ry*.2); c.quadraticCurveTo(0,ry*.75,rx,ry*.25); c.closePath();
  const g=c.createLinearGradient(0,-ry*1.3,0,ry*.6); g.addColorStop(0,k.shell); g.addColorStop(1,k.dark);
  c.fillStyle=g; c.fill(); c.strokeStyle='rgba(30,20,10,.75)'; c.lineWidth=1.4; c.stroke();
  c.save(); c.clip();
  if(k.ridges){ c.strokeStyle='rgba(200,210,220,.35)'; c.lineWidth=1.3; for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(-rx*1.05,ry*.1+i*ry*.1); c.bezierCurveTo(-rx*.6,-ry*1.1+i*ry*.32,rx*.6,-ry*1.05+i*ry*.32,rx,ry*.15+i*ry*.08); c.stroke(); }
    c.fillStyle=k.spots; for(let i=0;i<9;i++){ ellipse(c,-rx*.7+(i*.53%1.4)*rx,-ry*.7+((i*.37)%1)*ry,1.3,1.3); c.fill(); } }
  else { c.strokeStyle='rgba(40,30,10,.55)'; c.lineWidth=1.2;
    for(const [x0,y0] of [[-.55,-.35],[-.12,-.62],[.32,-.45],[-.35,.05],[.1,-.1],[.55,-.02]]){ const cx=rx*x0, cy=ry*y0, r=ry*.36;
      c.beginPath(); for(let j=0;j<6;j++){ const a=j/6*Math.PI*2; c.lineTo(cx+Math.cos(a)*r*1.15,cy+Math.sin(a)*r*.8); } c.closePath(); c.stroke(); }
    c.fillStyle='rgba(255,240,200,.18)'; ellipse(c,-rx*.15,-ry*.75,rx*.45,ry*.22); c.fill(); }
  c.restore();
  // plastron rim
  c.beginPath(); c.moveTo(rx*.95,ry*.28); c.quadraticCurveTo(0,ry*.8,-rx*1.0,ry*.22); c.strokeStyle=k.belly; c.lineWidth=ry*.22; c.stroke();
  c.strokeStyle='rgba(30,20,10,.6)'; c.lineWidth=1; c.beginPath(); c.moveTo(rx*.95,ry*.4); c.quadraticCurveTo(0,ry*.92,-rx*1.0,ry*.32); c.stroke();
  // near flippers (in front)
  flipper(rx*.42,ry*.42,L*(def.id==='turtle3'?.46:.38),L*.1,-(.6-sw*.4),k.skin);
  flipper(-rx*.6,ry*.38,L*.18,L*.08,-(.35+sw*.25),k.skin);
}
function fishThumb(def,w,h,silhouette){
  const c=document.createElement('canvas'), d=2; c.width=w*d; c.height=h*d; const x=c.getContext('2d');
  const extra={crayfish:1.6,mussel:1.05,snail:1.2,frog:1.5,olm:1.1,gloweel:1.05,crystalshrimp:1.5,glowjelly:1.0,mooncrab:1.3,dragon:1.2,sturgeon:1.45,pike:1.4,squid:1.05,shark:1.35,turtle1:1.45,turtle2:1.45,turtle3:1.5,swordfish:1.55,angler:1.35,eel:1.05,puffer:1.3,koi:1.35,shrimp:1.5,lobster:1.6,jelly:1.0,clam:1.05,oyster:1.15,boot:1.15,can:1.2,tire:1.0,bottle:1.0,bag:1.0}[def.id]||1.3;
  const hf={crayfish:.9,mussel:.6,snail:1.0,frog:.8,olm:.35,gloweel:.32,crystalshrimp:.9,glowjelly:1.25,mooncrab:1.0,dragon:.5,sturgeon:.45,pike:.45,grayling:.85,bluegill:.9,jadeperch:.9,lotuskoi:.7,mooncarp:.7,sculpin:.6,squid:.95,shark:.55,turtle1:.8,turtle2:.8,turtle3:.8,perch:1.05,puffer:1.25,angler:1.35,swordfish:.75,koi:.85,salmon:.7,eel:.3,shrimp:.9,lobster:.95,jelly:1.25,clam:1.0,oyster:1.35,boot:1.1,can:1.0,tire:1.05,bottle:1.15,bag:1.4}[def.id]||.55;
  const L=Math.min(w*.82/extra, h*.88/hf);
  x.scale(d,d); const cx={swordfish:-L*.2,shrimp:-L*.15,crystalshrimp:-L*.15,pike:-L*.08,sturgeon:-L*.1,lobster:-L*.05}[def.id]; const cy={angler:h*.12,jelly:-h*.08,glowjelly:-h*.08,grayling:h*.15,clam:h*.12,oyster:h*.2,bag:h*.05}[def.id]||0;
  x.translate(w/2+(cx??(def.move?0:L*.08)),h/2+cy);
  drawFish(x,def,L,0.6,{still:true,sparkle:false,open:def.id==='oyster'?.8:0,f:{pearl:def.id==='oyster'}});
  if(silhouette){ x.setTransform(1,0,0,1,0,0); x.globalCompositeOperation='source-atop'; x.fillStyle='#4a3a2c'; x.fillRect(0,0,c.width,c.height); }
  return c;
}

// ---------- shellfish, jellyfish and trash (drawn centered at origin, facing +x) ----------
function drawCritter(c,def,L,tt,o){
  const f=o.f||{};
  c.lineCap='round'; c.lineJoin='round';
  switch(def.id){
    case 'shrimp':{ const r=L*.15;
      c.strokeStyle='rgba(200,90,60,.9)'; c.lineWidth=1;
      const ant=Math.sin(tt*4)*4; c.beginPath(); c.moveTo(L*.38,-r*.4); c.quadraticCurveTo(L*.7,-L*.45+ant,L*.95,-L*.2+ant); c.moveTo(L*.38,-r*.2); c.quadraticCurveTo(L*.75,-L*.25-ant,L*1.0,-L*.05); c.stroke();
      c.strokeStyle='#d96a4c'; c.lineWidth=1.2; for(let i=0;i<5;i++){ const x=L*.25-i*L*.1, sw=Math.sin(tt*14+i)*2; c.beginPath(); c.moveTo(x,r*.5); c.lineTo(x+sw,r*1.5); c.stroke(); }
      const pts=[]; for(let i=0;i<7;i++){ const u=i/6; pts.push([L*.32-u*L*.72, -r*.5*Math.sin(Math.PI*u)+u*u*r*2.2, r*(1-u*.55)]); }
      // tail fan
      const tp=pts[6]; c.beginPath(); c.moveTo(tp[0],tp[1]); c.lineTo(tp[0]-L*.16,tp[1]+r*1.2); c.lineTo(tp[0]-L*.04,tp[1]+r*1.6); c.lineTo(tp[0]+L*.04,tp[1]+r*1.4); c.closePath(); fs(c,'#f4a07f',1);
      for(let i=6;i>=0;i--){ const p=pts[i]; ellipse(c,p[0],p[1],p[2]*1.15,p[2]); fs(c,i%2?'#f39472':'#f7a989',1); }
      c.beginPath(); c.moveTo(L*.3,-r*.9); c.lineTo(L*.56,-r*.5); c.lineTo(L*.3,-r*.1); c.closePath(); fs(c,'#f39472',1);
      c.fillStyle='#111'; ellipse(c,L*.33,-r*.85,1.8,1.8); c.fill(); break; }
    case 'lobster':{ const s=L/58, leg=Math.sin(tt*(o.fast?14:6));
      c.save(); c.scale(s,s);
      c.strokeStyle='#8a2f20'; c.lineWidth=1.6;
      for(let i=0;i<4;i++){ const x=4-i*7, sw=(i%2?leg:-leg)*3; c.beginPath(); c.moveTo(x,4); c.lineTo(x+3+sw,12); c.lineTo(x+1+sw,16); c.stroke(); }
      c.strokeStyle='#a33a28'; c.lineWidth=1; c.beginPath(); c.moveTo(14,-5); c.quadraticCurveTo(-10,-30,-36,-24); c.moveTo(14,-4); c.quadraticCurveTo(0,-22,-28,-30); c.stroke();
      for(let i=0;i<4;i++){ ellipse(c,-8-i*6.5,1+i*.8,6-i*.5,5.4-i*.4); fs(c,i%2?'#b8432f':'#c44f37',1.1); }
      c.beginPath(); c.moveTo(-31,3); c.lineTo(-40,-3); c.lineTo(-42,4); c.lineTo(-40,10); c.closePath(); fs(c,'#b8432f',1.1);
      ellipse(c,6,-1,13,8); fs(c,'#c44f37');
      c.strokeStyle=OUT; c.lineWidth=.9; c.beginPath(); c.moveTo(0,-8); c.quadraticCurveTo(2,-1,0,6); c.stroke();
      const claw=(y,sz,open)=>{ c.strokeStyle=OUT; c.lineWidth=5; c.beginPath(); c.moveTo(14,y*.3); c.lineTo(22,y); c.stroke(); c.strokeStyle='#c44f37'; c.lineWidth=3.4; c.stroke();
        ellipse(c,30,y,10*sz,6*sz); fs(c,'#b8432f'); c.fillStyle='#f3e3c8'; c.beginPath(); c.moveTo(36*sz+4,y-1); c.lineTo(41*sz+2,y-3-open); c.lineTo(41*sz+2,y+1); c.closePath(); c.fill(); c.strokeStyle=OUT; c.lineWidth=1; c.stroke(); };
      claw(-9,1.05,1+Math.max(0,Math.sin(tt*3))*2); claw(8,.95,1+Math.max(0,Math.sin(tt*3+1))*2);
      c.fillStyle='#111'; ellipse(c,15,-6,1.8,1.8); c.fill();
      c.restore(); break; }
    case 'jelly':{ const pulse=Math.sin(tt*2.6), w=L*.46*(1+pulse*.08), h=L*.36*(1-pulse*.08), by=-L*.12;
      c.strokeStyle='rgba(225,150,225,.75)'; c.lineWidth=1.4;
      for(let i=0;i<6;i++){ const x=-w*.75+i*w*.3; c.beginPath(); c.moveTo(x,by); for(let k=1;k<=6;k++){ c.lineTo(x+Math.sin(tt*2+k*.9+i)*3.5,by+k*L*.12); } c.stroke(); }
      c.strokeStyle='rgba(240,170,230,.85)'; c.lineWidth=3.4; for(let i=0;i<2;i++){ const x=-w*.2+i*w*.4; c.beginPath(); c.moveTo(x,by); c.quadraticCurveTo(x+Math.sin(tt*1.6+i)*7,by+L*.3,x,by+L*.5); c.stroke(); }
      const g=c.createRadialGradient(0,by-h*.5,2,0,by,w); g.addColorStop(0,'rgba(255,215,245,.9)'); g.addColorStop(1,'rgba(215,130,215,.55)');
      c.beginPath(); c.moveTo(-w,by); c.quadraticCurveTo(-w,by-h*1.35,0,by-h*1.35); c.quadraticCurveTo(w,by-h*1.35,w,by);
      for(let i=0;i<6;i++){ const x1=w-(i+.5)*w/3, x2=w-(i+1)*w/3; c.quadraticCurveTo(x1,by+4,x2,by); } c.closePath();
      c.fillStyle=g; c.fill(); c.strokeStyle='rgba(150,70,150,.6)'; c.lineWidth=1.2; c.stroke();
      c.fillStyle='rgba(255,255,255,.35)'; ellipse(c,-w*.25,by-h*.85,w*.35,h*.25); c.fill(); c.fillStyle='rgba(190,90,190,.35)'; for(let i=0;i<3;i++){ ellipse(c,-w*.35+i*w*.35,by-h*.35,w*.12,h*.18); c.fill(); }
      if(o.zap){ c.strokeStyle='#ffe34d'; c.lineWidth=1.6; c.beginPath(); c.moveTo(-w,by-h); c.lineTo(-w-6,by-h+4); c.lineTo(-w-2,by-h+6); c.lineTo(-w-9,by-h+11); c.stroke(); }
      break; }
    case 'clam':{ const w=L*.5, h=L*.42, open=o.open||0;
      c.beginPath(); c.moveTo(-w,0); c.quadraticCurveTo(0,h*1.2,w,0); c.closePath(); fs(c,'#d9c08e');
      if(open>.05){ c.fillStyle='#f3b6b0'; c.beginPath(); c.ellipse(0,0,w*.85,h*.45*open+1,0,Math.PI,0); c.fill(); }
      c.save(); c.translate(-w,0); c.rotate(-open*.45); c.translate(w,0);
      c.beginPath(); c.moveTo(-w,0); c.quadraticCurveTo(-w,-h*1.5,0,-h*1.35); c.quadraticCurveTo(w,-h*1.5,w,0); c.closePath(); fs(c,'#ecd8ad');
      c.strokeStyle='rgba(150,115,60,.6)'; c.lineWidth=1.1; for(let i=1;i<6;i++){ const a=Math.PI*(i/6); c.beginPath(); c.moveTo(0,h*.1); c.lineTo(-Math.cos(a)*w*.95,-Math.sin(a)*h*1.25); c.stroke(); }
      c.restore(); break; }
    case 'oyster':{ const w=L*.55, h=L*.38, open=o.open||0;
      c.beginPath(); c.moveTo(-w,0); c.quadraticCurveTo(-w*.4,h*1.1,w*.2,h*.7); c.quadraticCurveTo(w*.9,h*.5,w,0); c.closePath(); fs(c,'#7f766b');
      if(open>.05){ c.fillStyle='#e8e1d6'; c.beginPath(); c.ellipse(w*.05,0,w*.8,h*.7*open+1,0,Math.PI,0); c.fill();
        if(f.pearl){ const gl=c.createRadialGradient(w*.15,-h*.25*open,0,w*.15,-h*.25*open,8); gl.addColorStop(0,'#fff'); gl.addColorStop(1,'#d9d6f0'); c.fillStyle=gl; ellipse(c,w*.15,-h*.22*open,4,4); c.fill(); } }
      c.save(); c.translate(-w,0); c.rotate(-open*.5); c.translate(w,0);
      c.beginPath(); c.moveTo(-w,0); c.quadraticCurveTo(-w*.8,-h*1.1,-w*.1,-h*1.2); c.quadraticCurveTo(w*.6,-h*1.3,w*1.02,-h*.3); c.quadraticCurveTo(w*1.05,0,w,0); c.closePath(); fs(c,'#9a9183');
      c.strokeStyle='rgba(70,62,52,.7)'; c.lineWidth=1.2; for(let i=0;i<3;i++){ c.beginPath(); c.moveTo(-w*.8+i*w*.15,-h*.15-i*h*.25); c.quadraticCurveTo(0,-h*(.5+i*.25),w*.9-i*w*.15,-h*.3-i*h*.2); c.stroke(); }
      c.restore(); break; }
    case 'boot':{ const s=L/34; c.save(); c.scale(s,s); c.rotate(-.12);
      c.beginPath(); c.moveTo(-12,-18); c.lineTo(2,-18); c.lineTo(3,-2); c.quadraticCurveTo(16,-2,18,6); c.lineTo(18,10); c.lineTo(-13,10); c.closePath(); fs(c,'#6b4a2e');
      c.fillStyle='#2d241d'; c.fillRect(-13,8,31,4); c.strokeStyle=OUT; c.lineWidth=1; c.strokeRect(-13,8,31,4);
      c.strokeStyle='#d8c9a0'; c.lineWidth=1.2; for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(-1,-14+i*4); c.lineTo(3,-12+i*4); c.stroke(); }
      c.strokeStyle='#3f8f3a'; c.lineWidth=2; c.beginPath(); c.moveTo(-12,-18); c.quadraticCurveTo(-16+Math.sin(tt*2)*3,-26,-12,-32); c.stroke();
      c.restore(); break; }
    case 'can':{ const w=L*.36, h=L*.5; c.save(); c.rotate(1.2);
      c.beginPath(); c.rect(-w,-h,w*2,h*2); fs(c,'#a7b0b5');
      c.fillStyle='#c8463a'; c.fillRect(-w,-h*.45,w*2,h*.9); c.fillStyle='#f3e3c8'; c.fillRect(-w*.5,-h*.15,w,h*.3);
      ellipse(c,0,-h,w,w*.35); fs(c,'#c8cfd3',1); c.strokeStyle='rgba(60,60,60,.6)'; c.beginPath(); c.moveTo(w*.6,h*.2); c.lineTo(w,h*.5); c.stroke();
      c.restore(); break; }
    case 'tire':{ const r=L*.5;
      c.strokeStyle='#1e1e1e'; c.lineWidth=r*.48; ellipse(c,0,0,r*.74,r*.74); c.stroke();
      c.strokeStyle='#3a3a3a'; c.lineWidth=2.5; for(let i=0;i<16;i++){ const a=i/16*Math.PI*2; c.beginPath(); c.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6); c.lineTo(Math.cos(a+.1)*r*.95,Math.sin(a+.1)*r*.95); c.stroke(); }
      c.strokeStyle='rgba(255,255,255,.12)'; c.lineWidth=2; ellipse(c,0,0,r*.5,r*.5); c.stroke(); break; }
    case 'bottle':{ c.save(); c.rotate(.5+Math.sin(tt*.8)*.15); const w=L*.18, h=L*.42;
      c.beginPath(); c.moveTo(-w,-h*.5); c.quadraticCurveTo(-w,-h*.8,-w*.45,-h*.95); c.lineTo(-w*.45,-h*1.1); c.lineTo(w*.45,-h*1.1); c.lineTo(w*.45,-h*.95); c.quadraticCurveTo(w,-h*.8,w,-h*.5); c.lineTo(w,h); c.lineTo(-w,h); c.closePath();
      c.fillStyle='rgba(185,225,240,.6)'; c.fill(); c.strokeStyle='rgba(60,110,130,.8)'; c.lineWidth=1.2; c.stroke();
      c.fillStyle='rgba(255,255,255,.75)'; c.fillRect(-w,-h*.1,w*2,h*.35); c.fillStyle='#2f6fb3'; c.fillRect(-w*.55,-h*1.25,w*1.1,h*.2);
      c.restore(); break; }
    case 'bag':{ const w=L*.42, h=L*.48, wv=Math.sin(tt*1.8)*3;
      c.beginPath(); c.moveTo(-w,-h*.6); c.quadraticCurveTo(-w*1.1+wv,0,-w*.8,h); c.quadraticCurveTo(0,h*1.15-wv,w*.8,h); c.quadraticCurveTo(w*1.1-wv,0,w,-h*.6); c.lineTo(w*.4,-h*.6); c.quadraticCurveTo(0,-h*.3,-w*.4,-h*.6); c.closePath();
      c.fillStyle='rgba(245,245,250,.62)'; c.fill(); c.strokeStyle='rgba(140,150,165,.8)'; c.lineWidth=1.2; c.stroke();
      c.beginPath(); c.moveTo(-w,-h*.6); c.quadraticCurveTo(-w*.9,-h*1.25,-w*.4,-h*.6); c.moveTo(w,-h*.6); c.quadraticCurveTo(w*.9,-h*1.25,w*.4,-h*.6); c.stroke();
      c.strokeStyle='rgba(200,70,60,.5)'; c.beginPath(); c.moveTo(-w*.4,h*.2); c.lineTo(w*.4,h*.2); c.stroke(); break; }
  }
}

const OUT='rgba(40,24,14,.9)';
function fs(c,fill,lw=1.4){ c.fillStyle=fill; c.fill(); c.strokeStyle=OUT; c.lineWidth=lw; c.stroke(); }
