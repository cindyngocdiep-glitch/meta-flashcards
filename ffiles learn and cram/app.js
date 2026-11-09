let decks=[],prog=Core.get('fc.prog',{}),S={scr:'decks',sel:0,deck:null,i:0,flip:false,menu:false,msel:0};
const $=id=>document.getElementById(id),esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const IV=[0,1,3,7,14,30],DAY=864e5;
const P=d=>{const p=prog[d.id]=prog[d.id]||{marks:{},order:null,filter:'due',pos:0};p.sr=p.sr||{};return p};
const savep=()=>Core.set('fc.prog',prog);
async function init(){const local=Core.get('fc.decks',[]).filter(d=>d.src!=='file');let file=Core.get('fc.files',[]);
 try{const m=await (await fetch('decks/manifest.json',{cache:'no-cache'})).json();file=[];
  for(const e of m){try{const t=await (await fetch(e.file,{cache:'no-cache'})).text();file.push({id:e.id,name:e.name,short:e.short,src:'file',cards:Core.parse(t)})}catch(x){}}
  Core.set('fc.files',file)}catch(e){}
 decks=file.concat(local.filter(l=>!file.some(f=>f.id==l.id)));render()}
function order(d){const p=P(d);if(!p.order||p.order.length!=d.cards.length)p.order=d.cards.map((_,i)=>i);
 const n=Date.now();return p.filter=='missed'?p.order.filter(i=>p.marks[d.cards[i].q]===0):p.filter=='due'?p.order.filter(i=>{const s=p.sr[d.cards[i].q];return !s||s.due<=n}):p.order}
function stats(d){const p=P(d),m=p.marks,n=Date.now();let k=0,w=0,u=0;d.cards.forEach(c=>{if(m[c.q]===1)k++;else if(m[c.q]===0)w++;const s=p.sr[c.q];if(!s||s.due<=n)u++});return[k,w,u]}
function sz(t){return t.length<50?'s1':t.length<140?'s2':t.length<320?'s3':'s4'}
function render(){const h=$('head'),m=$('main'),f=$('foot');$('menu').hidden=!S.menu;
 if(S.scr!='decks'&&S.scr!='card')return QZ.render(h,m,f);
 if(S.scr=='decks'){h.innerHTML='<span>Decks</span><span class=sub>'+decks.length+'</span>';
  if(!decks.length){m.innerHTML='<div class=msg>No decks. Import on phone: /import.html</div>';f.textContent='';return}
  m.innerHTML=decks.map((d,n)=>{const[k,w,u]=stats(d);return'<div class="row'+(n==S.sel?' sel':'')+'"><span>'+esc(d.name)+'</span><span class=sub>'+d.cards.length+' cards · '+u+' due · '+k+'✓ '+w+'✗</span></div>'}).join('');
  f.textContent='↑↓ choose   Enter open';const s=m.querySelector('.sel');if(s)s.scrollIntoView({block:'nearest'});return}
 const d=S.deck,p=P(d),o=order(d);
 if(!o.length){h.innerHTML='<span>'+esc(d.name)+'</span>';m.innerHTML='<div class=msg>'+(p.filter=='due'?'All caught up! No cards due.':'No cards in this view.')+'<br><span class=sub>Esc → Show: change view</span></div>';f.textContent='Esc menu';if(S.menu)drawMenu();return}
 S.i=(S.i+o.length)%o.length;const c=d.cards[o[S.i]],mk=p.marks[c.q],[k,w]=stats(d);
 h.innerHTML='<span>'+esc(d.short||d.name.slice(0,14))+' '+(S.i+1)+'/'+o.length+'</span><span>'+(mk===1?'✓':mk===0?'✗':'')+(p.filter=='missed'?' Missed':p.filter=='due'?' Due':'')+'</span>';
 const t=S.flip?c.a:c.q;m.innerHTML='<div id=body class="t '+sz(t)+'"><div class=q>'+(S.flip?'ANSWER':'QUESTION')+'</div>'+esc(t)+'</div>';
 const b=$('body');b.style.height='100%';b.style.overflow='hidden';b.scrollTop=0;
 f.textContent=ov()?'↑↓ scroll  ←→ card  Enter flip':'←→ card  Enter flip  ↑✓ ↓✗';
 if(S.menu)drawMenu()}
function ov(){const b=$('body');return b&&b.scrollHeight>b.clientHeight+2}
const NX={due:'missed',missed:'all',all:'due'};
function items(){if(S.scr!='card')return QZ.items();const p=P(S.deck);return[['✓ Know it',()=>mark(1)],['✗ Missed it',()=>mark(0)],['Shuffle',shuffle],['Show: '+p.filter+' → '+NX[p.filter],()=>{p.filter=NX[p.filter];S.i=0;S.flip=false}],['Reset progress',()=>{p.marks={};p.sr={};p.qz={};p.st=null;p.filter='due';S.i=0}],['Study modes',()=>{S.scr='modes'}],['Deck list',()=>{S.scr='decks';S.deck=null}]]}
function drawMenu(){$('menu').innerHTML='<div id=head>Menu</div>'+items().map((x,n)=>'<div class="row'+(n==S.msel?' sel':'')+'">'+x[0]+'</div>').join('')+'<div id=foot>↑↓ choose  Enter select  Esc close</div>'}
function mark(v){const d=S.deck,o=order(d),c=d.cards[o[S.i]];if(!c)return;const p=P(d),s=p.sr[c.q]||{b:0},b=v?Math.min(5,s.b+1):1;p.marks[c.q]=v;p.sr[c.q]={b,due:Date.now()+(v?IV[b]*DAY:0)};savep();S.flip=false;if(order(d).includes(o[S.i]))S.i++}
function shuffle(){const d=S.deck,p=P(d);const a=d.cards.map((_,i)=>i);for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}p.order=a;S.i=0;S.flip=false}
function go(n){S.i+=n;S.flip=false;P(S.deck).pos=S.i;savep()}
function scroll(dir){const b=$('body');if(!b||!ov())return false;const max=b.scrollHeight-b.clientHeight,t=b.scrollTop+dir*b.clientHeight*.75;
 if(dir>0&&b.scrollTop>=max-2||dir<0&&b.scrollTop<=0)return false;b.scrollTop=Math.max(0,Math.min(max,t));return true}
document.addEventListener('keydown',e=>{const k=e.key;if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Escape'].includes(k))return;if(e.repeat&&k=='Enter')return;
 if(S.scr=='decks'){if(k=='Escape')return;e.preventDefault();
  if(k=='ArrowDown')S.sel=Math.min(decks.length-1,S.sel+1);else if(k=='ArrowUp')S.sel=Math.max(0,S.sel-1);
  else if(k=='Enter'&&decks[S.sel]){S.deck=decks[S.sel];S.scr='modes'}render();return}
 e.preventDefault();
 if(S.menu){if(k=='ArrowDown')S.msel=Math.min(items().length-1,S.msel+1);else if(k=='ArrowUp')S.msel=Math.max(0,S.msel-1);
  else if(k=='Enter'){const f=items()[S.msel][1];S.menu=false;f();savep()}else if(k=='Escape')S.menu=false;render();return}
 if(S.scr!='card'){if(QZ.key(k)!==0)render();return}
 if(k=='Escape'){S.menu=true;S.msel=0}else if(k=='Enter')S.flip=!S.flip;
 else if(k=='ArrowRight')go(1);else if(k=='ArrowLeft')go(-1);
 else if(k=='ArrowDown'){if(scroll(1))return;mark(0)}else if(k=='ArrowUp'){if(scroll(-1))return;mark(1)}
 render()});
init();
