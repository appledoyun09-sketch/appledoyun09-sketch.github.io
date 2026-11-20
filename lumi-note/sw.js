const CACHE='lumi-note-v1.7-study-suite-20261120';
const PRECACHE=['./','./index.html','./enhancements-v17.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lumi-note-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 if(r.mode==='navigate'){
  e.respondWith(fetch(r,{cache:'no-store'}).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(c=>c.put('./index.html',clone));}return response;}).catch(()=>caches.match('./index.html')));
  return;
 }
 e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(r,copy));}return response;
 })));
});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting();});