// Whisker Lake · loads the data files, then the game scripts in order.
// Plain <script> files work both on a website and when you double-click index.html.
window.DATA={};
// version from index.html (js/loader.js?v=...): added to every file so browsers don't keep using old copies
window.WL_V=(document.currentScript && new URL(document.currentScript.src).searchParams.get('v')) || '1';
const withV=src=>src+(src.includes('?')?'&':'?')+'v='+encodeURIComponent(WL_V);
(async()=>{
  const load=src=>new Promise((ok,fail)=>{ const s=document.createElement('script'); s.src=withV(src); s.onload=ok; s.onerror=()=>fail(src); document.body.appendChild(s); });
  try{
    for(const n of ['cats','creatures','places']) await load('data/'+n+'.js');
    for(const n of ['cats','creatures','places']) DATA[n]=DATA[n].items;
    for(const n of ['data','world','draw-creatures','draw-places','draw-game','ui','rockfall','freeze']) await load('js/'+n+'.js');
  }catch(e){
    document.body.insertAdjacentHTML('beforeend','<p style="position:fixed;inset:auto 0 0 0;margin:0;padding:12px;background:#fff;color:#000;font:16px sans-serif">The game could not load '+e+'. Check that the assets, data and js folders sit next to index.html.</p>');
  }
})();
