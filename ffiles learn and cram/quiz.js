/* Learn + Cram modes. Loaded before app.js; uses its globals lazily (S,P,$,esc,sz,scroll,ov,savep). */
const TOP={'circulatory-system':[['Circulatory system','Overview'],['Heart','Heart structure'],['SA node','Cardiac cycle & pressure'],['Artery','Blood vessels'],['Systemic circulation','Circulation & blood flow'],['Blood','Blood components'],['ABO blood group','Blood types & transfusion'],['Whole blood specimen','Specimens'],['Hemostasis','Hemostasis & clotting'],['Hemorrhage','Bleeding & blood disorders'],['Atherosclerosis','Heart & vessel disease'],['CBC','Lab & cardiac tests'],['Lymphatic system','Lymphatic system']],
'infection-control':[['Antibiotic-resistant microorganism','Infection basics'],['Chain of infection: infectious agent','Chain of infection'],['Immune','Immunity & isolation'],['Transmission: direct contact','Transmission'],['CDC','Agencies & regulations'],['NFPA diamond: blue','Hazard labels & SDS'],['HICPAC','Agencies & regulations'],['Fomite','Transmission'],['Exposure incident: immediate action','Exposure & bloodborne'],['Work practice control','Precautions & controls'],['Radiation: time','Radiation safety'],['Fire triangle','Fire safety'],['Hypovolemic shock: symptoms','Shock']]};
let Q=null,M2=0;
const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const QP=d=>{const p=P(d);p.qz=p.qz||{};p.st=p.st||{lt:0,lc:0,ct:0,cc:0};return p};
const acc=(t,c)=>t?Math.round(100*c/t)+'% acc':'new';
function topics(d){if(d._t)return d._t;const a=TOP[d.id]||[],t=[];let cur='General';d.cards.forEach((c,i)=>{const h=a.find(x=>x[0]==c.q);if(h)cur=h[1];t[i]=cur});return d._t=t}
function opts(d,i){const t=topics(d),me=d.cards[i].q.toLowerCase(),o=d.cards.map((c,k)=>k).filter(k=>k!=i&&d.cards[k].q.toLowerCase()!=me);
 const pick=sh(o.filter(k=>t[k]==t[i])).concat(sh(o.filter(k=>t[k]!=t[i]))).slice(0,3);return sh([i].concat(pick))}
const QZ={
 start(mode){const d=S.deck,p=QP(d),z=i=>p.qz[d.cards[i].q]||{},all=d.cards.map((c,i)=>i);
  Q={mode,d,tot:0,cor:0,fc:0,fw:0,top:{},streak:{},mast:0,queue:[],cur:null,end:null,n:0};
  if(mode=='learn'){const un=all.filter(i=>!z(i).m);if(!un.length){Q.end='mastered';S.scr='result';return}
   const wr=i=>z(i).l===0||p.marks[d.cards[i].q]===0;
   Q.queue=sh(un.filter(wr)).concat(sh(un.filter(i=>!wr(i)))).slice(0,8).map(i=>({i,r:0}))}
  else{const wr=i=>z(i).l===0||p.marks[d.cards[i].q]===0;Q.queue=sh(all.filter(wr)).concat(sh(all.filter(i=>!wr(i)))).map(i=>({i,r:0}))}
  Q.n=Q.queue.length;S.scr='quiz';S.menu=false;this.next()},
 next(){if(!Q.queue.length){Q.end='done';S.scr='result';return}
  const it=Q.queue.shift(),type=Q.mode=='learn'||Math.random()<.6?'mc':'rc';
  Q.cur={i:it.i,r:it.r,type,opts:type=='mc'?opts(Q.d,it.i):null,sel:0,done:false,flip:false,ok:null}},
 answer(ok){const c=Q.cur,d=Q.d,p=QP(d),q=d.cards[c.i].q,z=p.qz[q]=p.qz[q]||{c:0,w:0},tp=topics(d)[c.i];
  ok?z.c++:(z.w++,z.m=0);z.l=ok?1:0;Q.tot++;if(ok)Q.cor++;c.done=true;c.ok=ok;
  if(!c.r){ok?Q.fc++:Q.fw++;const t=Q.top[tp]=Q.top[tp]||{n:0,w:0};t.n++;if(!ok)t.w++}
  const k=Q.mode=='learn'?'l':'c';p.st[k+'t']++;if(ok)p.st[k+'c']++;
  if(Q.mode=='learn'){const s=Q.streak[c.i]=ok?(Q.streak[c.i]||0)+1:0;
   if(s>=2){z.m=1;Q.mast++}else if(ok)Q.queue.push({i:c.i,r:1});else Q.queue.splice(Math.min(2,Q.queue.length),0,{i:c.i,r:1})}
  else if(!ok)Q.queue.splice(Math.min(5,Q.queue.length),0,{i:c.i,r:1});
  savep()},
 items(){return[['Resume',()=>{}],['End & see score',()=>{Q.end='ended';S.scr='result'}],['Study modes',()=>{S.scr='modes'}]]},
 key(k){
  if(S.scr=='modes'){if(k=='ArrowDown')M2=Math.min(2,M2+1);else if(k=='ArrowUp')M2=Math.max(0,M2-1);
   else if(k=='Escape'){S.scr='decks';S.deck=null}
   else if(k=='Enter'){if(M2==0){S.scr='card';S.i=P(S.deck).pos||0;S.flip=false}else this.start(M2==1?'learn':'cram')}return}
  if(S.scr=='result'){if(k=='Enter'&&Q.mode=='learn'&&Q.end!='mastered')this.start('learn');else if(k=='Enter'||k=='Escape')S.scr='modes';return}
  const c=Q.cur;if(k=='Escape'){S.menu=true;S.msel=0;return}
  if(c.type=='mc'){if(!c.done){if(k=='ArrowDown')c.sel=(c.sel+1)%4;else if(k=='ArrowUp')c.sel=(c.sel+3)%4;else if(k=='Enter')this.answer(c.opts[c.sel]==c.i)}
   else if(k=='Enter'||k=='ArrowRight')this.next()}
  else if(k=='Enter')c.flip=!c.flip;
  else if(c.flip&&(k=='ArrowUp'||k=='ArrowDown')){if(scroll(k=='ArrowDown'?1:-1))return 0;this.answer(k=='ArrowUp');this.next()}},
 render(h,m,f){const d=S.deck;
  if(S.scr=='modes'){const p=QP(d),k=d.cards.filter(c=>(p.qz[c.q]||{}).m).length;
   h.innerHTML='<span>'+esc(d.short||d.name)+'</span><span class=sub>'+d.cards.length+' cards</span>';
   m.innerHTML=[['Flashcards','flip + spaced repetition'],['Learn','mastered '+k+'/'+d.cards.length+' · '+acc(p.st.lt,p.st.lc)],['Cram','all cards · '+acc(p.st.ct,p.st.cc)]].map((x,n)=>'<div class="row'+(n==M2?' sel':'')+'"><span>'+x[0]+'</span><span class=sub>'+x[1]+'</span></div>').join('');
   f.textContent='↑↓ choose  Enter start  Esc back';return}
  if(S.scr=='result'){const t=Q.fc+Q.fw,wk=Object.entries(Q.top).filter(e=>e[1].w).sort((a,b)=>b[1].w/b[1].n-a[1].w/a[1].n||b[1].w-a[1].w).slice(0,3);
   h.innerHTML='<span>'+(Q.mode=='learn'?'Learn':'Cram')+' results</span>';
   m.innerHTML=Q.end=='mastered'?'<div class=msg>All '+d.cards.length+' cards mastered in Learn!</div>':'<div class=t style="font-size:32px"><div style="font-size:44px">'+(t?Math.round(100*Q.fc/t):0)+'% first try</div>'+Q.fc+' of '+t+' right first time'+(Q.mode=='cram'?' (of '+Q.n+' cards)':'')+'<br>'+(Q.tot-t)+' repeat answers'+(Q.mode=='learn'?'<br>Mastered this round: '+Q.mast:'')+'<br><b>Weak topics</b><br>'+(wk.length?wk.map(e=>'• '+esc(e[0])+' '+e[1].w+'/'+e[1].n+' missed').join('<br>'):'None – no misses!')+'</div>';
   f.textContent=Q.mode=='learn'&&Q.end!='mastered'?'Enter next round  Esc modes':'Enter modes';return}
  const c=Q.cur,card=d.cards[c.i];
  h.innerHTML='<span>'+(Q.mode=='learn'?'Learn '+Q.mast+'/'+Q.n+' ●':'Cram '+(Q.fc+Q.fw)+'/'+Q.n)+'</span><span>'+Q.cor+'✓ '+(Q.tot-Q.cor)+'✗</span>';
  if(c.type=='mc'){const def=card.a,fs=def.length<80?34:def.length<150?29:25;
   m.innerHTML='<div class=quiz><div id=qd class=t style="font-size:'+fs+'px"><div class=q>WHICH TERM?</div>'+esc(def)+'</div>'+c.opts.map((k,n)=>{let cl='opt',pre='';
    if(!c.done){if(n==c.sel){cl+=' sel';pre='▶ '}}else if(k==c.i){cl+=' ok';pre='✓ '}else if(n==c.sel){cl+=' bad';pre='✗ '}
    return'<div class="'+cl+'"'+(d.cards[k].q.length>30?' style="font-size:22px"':'')+'>'+pre+esc(d.cards[k].q)+'</div>'}).join('')+'</div>';
   f.textContent=!c.done?'↑↓ choose  Enter select':c.ok?'✓ Correct!  Enter next':'✗ Wrong – answer marked ✓  Enter next'}
  else{const t=c.flip?card.a:card.q;m.innerHTML='<div id=body class="t '+sz(t)+'"><div class=q>'+(c.flip?'DEFINITION':'RECALL THE DEFINITION')+'</div>'+esc(t)+'</div>';
   const b=$('body');b.style.height='100%';b.style.overflow='hidden';b.scrollTop=0;
   f.textContent=!c.flip?'Think, then Enter to reveal':ov()?'↑↓ scroll  then ↑ knew ↓ missed':'↑ I knew it   ↓ I missed it'}
  if(S.menu)drawMenu()}
};
