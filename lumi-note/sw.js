const CACHE='lumi-note-v1.6-ipad-keyboard-safe-20261120';
const PRECACHE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lumi-note-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
   if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',clone));}
   return response;
  }).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(request).then(hit=>hit||fetch(request).then(response=>{
  if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(request,clone));}
  return response;
 })));
});
self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting();});