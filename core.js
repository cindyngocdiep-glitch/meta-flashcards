const Core={
 csv(t){const r=[];let row=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];
  if(q){if(c=='"'){if(t[i+1]=='"'){f+='"';i++}else q=false}else f+=c}
  else if(c=='"')q=true;else if(c==','){row.push(f);f=''}
  else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;row.push(f);r.push(row);row=[];f=''}else f+=c}
  row.push(f);r.push(row);return r.map(x=>[x[0]||'',x.slice(1).join(', ')])},
 parse(text){text=text.replace(/^\uFEFF/,'');let rows;
  if(text.includes('\t'))rows=text.split(/\r?\n/).filter(l=>l.trim()).map(l=>{const i=l.indexOf('\t');return i<0?[l,'']:[l.slice(0,i),l.slice(i+1).replace(/\t/g,' ')]});
  else rows=Core.csv(text);
  return rows.map(r=>({q:r[0].trim(),a:r[1].trim()})).filter(c=>c.q&&c.a)},
 get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}},
 slug:s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'deck'
};
