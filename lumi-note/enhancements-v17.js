/* Lumi Note 1.7 | additive productivity and performance improvements.
   Changes only UI and small optional metadata fields; no migration or deletion.
   Works with classic-script globals from Lumi Note 1.5+.
*/
(function lumiEnhance17(){
'use strict';
if(window.lumiEnhancementVersion==='1.7')return;
window.lumiEnhancementVersion='1.7';

const byId=id=>document.getElementById(id);
const elSafe=()=>typeof el!=='undefined'&&el&&typeof data!=='undefined'&&data;
const htmlEscape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const style=document.createElement('style');
style.id='lumi-v17-styles';
style.textContent=`
.lumi-action{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:35px;min-width:36px;border-radius:11px;border:1px solid rgba(119,130,185,.14);background:rgba(255,255,255,.34);color:var(--ink);font-weight:800;cursor:pointer;transition:background .16s}
.lumi-action:hover{background:rgba(120,133,237,.14)} .lumi-action svg{width:16px;height:16px}
.lumi-action.active{color:var(--accent);background:rgba(116,124,229,.14)}
.lumi-actions17{display:flex;gap:5px;align-items:center}.lumi-action span{font-size:11px}
.lumi-note-pin{min-width:29px;flex:0 0 29px;align-self:center;height:32px;border-radius:9px;color:#9da6bd;font-size:19px;line-height:1}
.lumi-note-pin.is-pinned{color:#dc9f2d;background:rgba(240,183,68,.13)}
.lumi-note-pin:hover,.lumi-note-pin:focus-visible{background:rgba(240,183,68,.16)}
.lumi-quick-menu{position:fixed;z-index:45;width:min(290px,calc(100vw - 24px));padding:8px;border-radius:18px;border:1px solid var(--border);box-shadow:0 18px 60px #27305c38;background:rgba(255,255,255,.97);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}
.lumi-quick-menu[hidden]{display:none}.lumi-quick-menu button{display:flex;align-items:center;gap:10px;width:100%;min-height:42px;padding:9px 12px;text-align:left;border-radius:10px;color:#374064;font-size:12px;font-weight:700}
.lumi-quick-menu button:hover{background:#eef1fd}.lumi-quick-menu .shortcut{margin-left:auto;color:#9da5bb;font-size:10px;font-weight:650}
.lumi-quick-menu .separate{border-top:1px solid #edf0fa;margin-top:5px;padding-top:5px}
.lumi-quick-menu [data-lumi-action="clear"]{color:#d15a6a}
.lumi-overlay{position:fixed;inset:0;z-index:60;background:rgba(19,26,55,.45);display:flex;align-items:flex-start;justify-content:center;padding:calc(env(safe-area-inset-top) + 7vh) 16px 24px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.lumi-overlay[hidden]{display:none}.lumi-dialog17{width:min(670px,100%);max-height:min(82dvh,780px);overflow:hidden;display:flex;flex-direction:column;border-radius:25px;background:rgba(255,255,255,.985);color:#222b43;box-shadow:0 22px 80px #0d153a55;border:1px solid #fff}
.lumi-head17{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:21px 23px 15px}
.lumi-head17 h2{font-size:20px;font-weight:850;letter-spacing:-.6px;margin:3px 0 0}.lumi-eyebrow17{color:#717de0;font-size:10px;letter-spacing:1.65px;font-weight:850}
.lumi-close17{height:32px;width:32px;border-radius:10px;background:#edf0f8;color:#536079;font-size:23px}
.lumi-searchbox17{display:flex;align-items:center;margin:0 22px 12px;border-radius:14px;border:1px solid #dce2f2;background:#f6f8fe;padding:0 13px}
.lumi-searchbox17:focus-within{border-color:#7b83ef;box-shadow:0 0 0 3px #8189ef22}.lumi-searchbox17 svg{width:18px;height:18px;color:#777eaf}
.lumi-searchbox17 input{width:100%;border:0;outline:0;padding:15px 10px;background:transparent;color:#29304b;font-size:15px}
.lumi-searchhint17{font-size:11px;color:#8790aa;padding:0 23px 8px}.lumi-search-results17{padding:4px 14px 18px;overflow:auto;min-height:90px;max-height:56dvh}
.lumi-hit17{width:100%;display:flex;align-items:flex-start;gap:12px;padding:12px 13px;margin:5px 0;border-radius:13px;text-align:left;background:#f6f8fd;color:#27314d}
.lumi-hit17:hover,.lumi-hit17:focus-visible{background:#ebeffd}.lumi-hit-icon{font-size:20px;min-width:23px;line-height:1.2}.lumi-hittext{flex:1;min-width:0}
.lumi-hittext strong{display:block;font-size:13px;font-weight:820;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lumi-hittext small{display:block;margin-top:4px;color:#7d879e;font-size:11px;line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lumi-hit-page{font-size:10px;color:#6774cd;white-space:nowrap;margin-top:3px;font-weight:800}
.lumi-empty17{padding:42px 16px;text-align:center;color:#8c95a8;line-height:1.75;font-size:13px}
.lumi-page-toolbar17{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 23px 15px;font-size:12px;color:#7e87a1}
.lumi-pill17{font-size:11px;font-weight:780;padding:9px 13px;border-radius:10px;color:#6b70df;background:#eef0fc}
.lumi-pages-body17{padding:5px 19px 22px;overflow:auto;min-height:120px;max-height:59dvh}
.lumi-pages-grid17{display:grid;grid-template-columns:repeat(auto-fill,minmax(115px,1fr));gap:14px}
.lumi-page-card17{min-width:0;padding:8px;border:1px solid #e2e6f2;border-radius:15px;background:#f7f9fc;position:relative}
.lumi-page-card17.current{border-color:#7d86eb;background:#eef1ff;box-shadow:0 0 0 2px #7e89ef24}
.lumi-page-thumb17{position:relative;width:100%;height:140px;background:#fff;border:1px solid #e5e7f1;border-radius:7px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 3px 12px #36395d12}
.lumi-page-thumb17 svg{width:100%;height:100%;fill:none;stroke:none}.lumi-page-thumb17 .lumi-pdf-label17{font-size:27px;color:#8b8fdf;letter-spacing:1px}
.lumi-page-caption17{display:flex;align-items:center;justify-content:space-between;gap:3px;padding:8px 2px 6px}
.lumi-page-caption17 strong{font-size:12px;font-weight:850}.lumi-page-caption17 small{font-size:10px;color:#969eb0}
.lumi-page-actions17{display:flex;gap:4px}.lumi-page-actions17 button{min-width:24px;height:27px;border-radius:7px;background:#e9edf8;color:#66708e;font-size:12px;font-weight:800}
.lumi-page-actions17 button:disabled{opacity:.3}.lumi-page-actions17 button:hover:not(:disabled){background:#dce2f6}
.lumi-page-star17{font-size:18px!important;color:#a9b0c1}.lumi-page-star17.active{color:#d7a02c;background:#fff2d9}
.lumi-pages-more17[hidden]{display:none}.lumi-pages-more17{margin:18px auto 0;display:block;padding:12px 18px;border-radius:12px;background:#eceeff;color:#6974ca;font-weight:800}
.lumi-performance17 .ambient{display:none!important}.lumi-performance17 .glass,.lumi-performance17 .floating-focus-exit,.lumi-performance17 .lumi-quick-menu{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
.lumi-performance17 *,body.lumi-performance17 *::before,body.lumi-performance17 *::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
@media(max-width:800px){.lumi-action span{display:none}.lumi-action{min-width:31px;min-height:32px}.lumi-actions17{gap:3px}.lumi-head17{padding:17px 18px 12px}.lumi-overlay{padding:calc(env(safe-area-inset-top) + 20px) 12px 12px}.lumi-searchbox17{margin:0 14px 12px}.lumi-page-thumb17{height:118px}.lumi-pages-grid17{grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}.lumi-pages-body17{padding:4px 12px 16px}}
@media(prefers-reduced-motion:reduce){.lumi-overlay,.lumi-quick-menu{backdrop-filter:none;-webkit-backdrop-filter:none}}
`;
document.head.appendChild(style);

const headerActions=document.querySelector('.topbar-actions');
if(!headerActions){console.warn('Lumi 1.7: topbar unavailable');return;}
const buttons=document.createElement('div');buttons.className='lumi-actions17';buttons.innerHTML=`
 <button type="button" class="lumi-action" id="lumiSearchBtn17" aria-label="전체 노트 검색" title="전체 노트 검색 (⌘K)"><svg><use href="#i-search"/></svg></button>
 <button type="button" class="lumi-action" id="lumiPagesBtn17" aria-label="페이지 전체보기" title="페이지 전체보기"><svg><use href="#i-grid"/></svg></button>
 <button type="button" class="lumi-action" id="lumiQuickBtn17" aria-label="노트 도구 더보기" title="노트 도구"><span style="display:inline;font-size:19px">···</span></button>
`;
headerActions.insertBefore(buttons,headerActions.firstChild);

const menu=document.createElement('div');menu.id='lumiQuickMenu17';menu.className='lumi-quick-menu';menu.hidden=true;
menu.innerHTML=`
<button data-lumi-action="pin">⭐ <span>현재 노트 즐겨찾기</span><small class="shortcut">⌘⇧F</small></button>
<button data-lumi-action="duplicate">▣ <span>현재 노트 복제</span></button>
<button data-lumi-action="move">📁 <span>다른 노트북으로 이동</span></button>
<button data-lumi-action="stats">◫ <span>노트 학습 통계</span></button>
<button data-lumi-action="pages">▦ <span>페이지 한눈에 보기</span></button>
<button data-lumi-action="png">🖼️ <span>현재 페이지 PNG 저장</span></button>
<div class="separate"><button data-lumi-action="performance">⚡ <span>저전력·성능 모드</span><small class="shortcut" id="lumiPerfValue17">OFF</small></button>
<button data-lumi-action="backup">⤓ <span>전체 노트 백업</span></button></div>
<div class="separate"><button data-lumi-action="clear">⌫ <span>현재 페이지의 필기만 지우기</span></button></div>`;
document.body.appendChild(menu);

const searchModal=document.createElement('section');searchModal.className='lumi-overlay';searchModal.id='lumiSearchModal17';searchModal.hidden=true;
searchModal.innerHTML=`<div class="lumi-dialog17" role="dialog" aria-modal="true" aria-labelledby="lumiSearchTitle17">
<div class="lumi-head17"><div><div class="lumi-eyebrow17">SMART SEARCH · ALL NOTEBOOKS</div><h2 id="lumiSearchTitle17">모든 노트에서 검색</h2></div><button type="button" class="lumi-close17" data-close="search" aria-label="닫기">×</button></div>
<label class="lumi-searchbox17"><svg><use href="#i-search"/></svg><input id="lumiSearchField17" placeholder="노트 이름 · 텍스트 · 암기 카드 검색" type="search" autocomplete="off"/></label>
<div class="lumi-searchhint17" id="lumiSearchHint17">제목, 텍스트 상자, 암기 카드, 체크리스트를 검색합니다. 손글씨는 텍스트 인식 후 검색할 수 있습니다.</div>
<div class="lumi-search-results17" id="lumiSearchResults17"></div></div>`;
document.body.appendChild(searchModal);
const secondaryModal=document.createElement('section');secondaryModal.className='lumi-overlay';secondaryModal.id='lumiSecondaryModal17';secondaryModal.hidden=true;
secondaryModal.innerHTML=`<div class="lumi-dialog17" role="dialog" aria-modal="true" aria-labelledby="lumiSecondaryTitle17"><div class="lumi-head17"><div><div class="lumi-eyebrow17">NOTE ORGANIZER</div><h2 id="lumiSecondaryTitle17">노트 관리</h2></div><button type="button" class="lumi-close17" data-close="secondary" aria-label="닫기">×</button></div><div id="lumiSecondaryContent17" class="lumi-search-results17"></div></div>`;
document.body.appendChild(secondaryModal);
const pagesModal=document.createElement('section');pagesModal.className='lumi-overlay';pagesModal.id='lumiPagesModal17';pagesModal.hidden=true;
pagesModal.innerHTML=`<div class="lumi-dialog17" role="dialog" aria-modal="true" aria-labelledby="lumiPagesTitle17">
<div class="lumi-head17"><div><div class="lumi-eyebrow17">PAGE ORGANIZER · FAST VIEW</div><h2 id="lumiPagesTitle17">페이지 한눈에 보기</h2></div><button type="button" class="lumi-close17" data-close="pages" aria-label="닫기">×</button></div>
<div class="lumi-page-toolbar17"><span id="lumiPagesSubtitle17">페이지 이동 · 순서 변경 · 즐겨찾기</span><button type="button" class="lumi-pill17" id="lumiAddPage17">+ 새 페이지</button></div>
<div class="lumi-pages-body17"><div class="lumi-pages-grid17" id="lumiPagesGrid17"></div><button type="button" class="lumi-pages-more17" id="lumiPagesMore17" hidden>다음 페이지 더 보기</button></div></div>`;
document.body.appendChild(pagesModal);

const setVisible=(node,on)=>{node.hidden=!on;};
const noteById=id=>elSafe()?data.notes.find(note=>note.id===id):null;
const activeNote=()=>elSafe()?currentNote():null;
const closeMenu=()=>setVisible(menu,false);
function closeAll(){setVisible(searchModal,false);setVisible(pagesModal,false);setVisible(secondaryModal,false);closeMenu();}
function perfSync(){const on=!!(elSafe()&&data.settings?.performanceMode);document.body.classList.toggle('lumi-performance17',on);const label=byId('lumiPerfValue17');if(label)label.textContent=on?'ON':'OFF';}
function quickMenu(){if(!menu.hidden){closeMenu();return;}if(!elSafe())return;
 const anchor=byId('lumiQuickBtn17').getBoundingClientRect();menu.style.left=Math.max(12,Math.min(innerWidth-302,anchor.right-280))+'px';menu.style.top=Math.min(innerHeight-355,anchor.bottom+12)+'px';perfSync();setVisible(menu,true);}
function togglePin(id=activeNote()?.id){const note=noteById(id);if(!note)return;note.pinned=!note.pinned;queueSave();renderLibrary();showToast(note.pinned?'즐겨찾기에 추가했습니다.':'즐겨찾기를 해제했습니다.');}
function decorateLibrary(){if(!elSafe())return;
 const list=el.noteList;if(!list)return;
 const rows=Array.from(list.querySelectorAll('.note-row'));
 for(const row of rows){const entry=row.querySelector('[data-note]');if(!entry)continue;
  const note=noteById(entry.dataset.note);if(!note)continue;
  const star=document.createElement('button');star.className='lumi-note-pin'+(note.pinned?' is-pinned':'');star.type='button';star.title=note.pinned?'즐겨찾기 해제':'즐겨찾기에 추가';star.setAttribute('aria-label',star.title);star.textContent=note.pinned?'★':'☆';star.onclick=e=>{e.preventDefault();e.stopPropagation();togglePin(note.id);};
  row.insertBefore(star,row.querySelector('[data-delete-note]')||row.lastChild);
 }
 rows.sort((a,b)=>{const na=noteById(a.querySelector('[data-note]')?.dataset.note),nb=noteById(b.querySelector('[data-note]')?.dataset.note);return Number(!!nb?.pinned)-Number(!!na?.pinned)||(Number(nb?.updatedAt)||0)-(Number(na?.updatedAt)||0);});
 for(const row of rows)list.appendChild(row);
 perfSync();
}
const oldLibrary=renderLibrary;
renderLibrary=function(){oldLibrary();decorateLibrary();};

function moveCurrentNote(){const note=activeNote();if(!note)return;closeAll();
 byId('lumiSecondaryTitle17').textContent='노트북 이동';
 byId('lumiSecondaryContent17').innerHTML='<div style="font-size:12px;color:#8a94aa;padding:0 8px 8px">이동할 노트북을 선택하세요. 필기와 PDF는 그대로 유지됩니다.</div>'+
 data.notebooks.map(book=>`<button class="lumi-hit17" type="button" data-move-book="${htmlEscape(book.id)}"><span class="lumi-hit-icon">📁</span><span class="lumi-hittext"><strong>${htmlEscape(book.name)}</strong><small>${data.notes.filter(n=>n.notebookId===book.id).length}개 노트 ${note.notebookId===book.id?'· 현재 위치':''}</small></span></button>`).join('');
 setVisible(secondaryModal,true);
 byId('lumiSecondaryContent17').querySelectorAll('[data-move-book]').forEach(button=>button.onclick=()=>{
  const target=data.notebooks.find(b=>b.id===button.dataset.moveBook);if(!target)return;
  note.notebookId=target.id;data.activeNotebookId=target.id;note.updatedAt=Date.now();renderAll(true);queueSave();closeAll();showToast(`「${target.name}」으로 노트를 이동했습니다.`);
 });
}
function showNoteStats(){const note=activeNote();if(!note)return;closeAll();const pages=note.pages||[];
 const items=pages.flatMap(p=>p.items||[]),strokes=items.filter(i=>i.type==='stroke'),texts=items.filter(i=>i.type==='text'),words=texts.reduce((sum,i)=>sum+String(i.text||'').length,0);
 const nums=[['페이지',pages.length],['필기 획',strokes.length],['텍스트 상자',texts.length],['텍스트 글자 수',words],['PDF 페이지',pages.filter(p=>p.pdfSourceId).length],['학습용 객체',items.filter(i=>['timer','map','flashcard','checklist','graph','image'].includes(i.type)).length]];
 byId('lumiSecondaryTitle17').textContent='노트 학습 통계';
 byId('lumiSecondaryContent17').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${nums.map(([label,count])=>`<div style="padding:15px 16px;background:#f3f6fd;border:1px solid #e5e9f7;border-radius:14px"><div style="font-size:11px;color:#838eaa">${label}</div><div style="font-size:23px;font-weight:850;color:#5362b6;margin-top:5px">${count.toLocaleString()}</div></div>`).join('')}</div><div style="color:#8791aa;font-size:11px;padding:16px 3px 3px">마지막 수정: ${new Date(note.updatedAt||Date.now()).toLocaleString('ko-KR')}</div>`;
 setVisible(secondaryModal,true);
}
function duplicateCurrentNote(){if(!elSafe())return;commitTextEdit();const original=activeNote();if(!original)return;
 const copyOfNote=JSON.parse(JSON.stringify(original));copyOfNote.id=uid();copyOfNote.title=(original.title||'노트')+' 복사본';copyOfNote.createdAt=Date.now();copyOfNote.updatedAt=Date.now();copyOfNote.pinned=false;
 for(const page of copyOfNote.pages){page.id=uid();page.items=(page.items||[]).map(it=>({...it,id:uid()}));}
 data.notes.push(copyOfNote);data.activeNotebookId=copyOfNote.notebookId;data.activeNoteId=copyOfNote.id;data.pageIndex=0;
 renderAll(true);queueSave();showToast('노트를 복제했습니다. 원본 노트는 그대로 유지됩니다.');}

function textFromObject(item){if(!item||typeof item!=='object')return '';
 let parts=[];for(const key of ['text','label','title','front','back','question','answer','description']){const val=item[key];if(typeof val==='string'&&val.length<20000)parts.push(val);}
 const tasks=item.tasks||item.checklist||item.entries;if(Array.isArray(tasks))for(const item of tasks.slice(0,150)){if(typeof item==='string')parts.push(item);else if(typeof item==='object')for(const k of ['text','label','title'])if(typeof item[k]==='string')parts.push(item[k]);}
 return parts.join(' · ');
}
function normalizeText(s){return String(s||'').normalize('NFKC').toLocaleLowerCase('ko-KR');}
let searchTimer=0;
function searchAllNotes(raw){const q=normalizeText(raw.trim());if(!elSafe())return [];
 let results=[];const notes=[...data.notes].sort((a,b)=>Number(!!b.pinned)-Number(!!a.pinned)||(b.updatedAt||0)-(a.updatedAt||0));
 for(const note of notes){if(results.length>=70)break;
  const book=data.notebooks.find(b=>b.id===note.notebookId);
  if(!q||normalizeText(note.title).includes(q)||normalizeText(book?.name).includes(q)){
   results.push({noteId:note.id,pageIndex:0,title:note.title,book:book?.name||'노트북',snippet:`${note.pages.length}페이지 · ${note.pinned?'즐겨찾기 · ':''}${book?.name||''}`,pinned:!!note.pinned});
   if(!q)continue;
  }
  if(!q)continue;
  for(let i=0;i<note.pages.length&&results.length<70;i++){
   const pg=note.pages[i];
   const matched=(pg.items||[]).find(item=>normalizeText(textFromObject(item)).includes(q));
   if(!matched)continue;
   const content=textFromObject(matched),idx=normalizeText(content).indexOf(q),snippet=content.slice(Math.max(0,idx-35),Math.min(content.length,idx+100));
   results.push({noteId:note.id,pageIndex:i,title:note.title,book:book?.name||'노트북',snippet,pinned:!!note.pinned});
  }
 }
 return results.slice(0,70);
}
function renderSearch(){const field=byId('lumiSearchField17'),target=byId('lumiSearchResults17');if(!field||!target)return;
 const q=field.value,results=searchAllNotes(q);
 byId('lumiSearchHint17').textContent=q.trim()?`${results.length}${results.length>=70?'+':''}개의 결과 · 노트나 페이지를 선택하세요`:'최근 노트 · 즐겨찾기 우선 · 최대 70개 표시';
 if(!results.length){target.innerHTML='<div class="lumi-empty17">일치하는 노트를 찾을 수 없습니다.<br>손글씨는 OCR로 텍스트로 변환하면 검색할 수 있습니다.</div>';return;}
 target.innerHTML=results.map(item=>`<button class="lumi-hit17" type="button" data-hit-note="${htmlEscape(item.noteId)}" data-hit-page="${item.pageIndex}"><span class="lumi-hit-icon">${item.pinned?'⭐':'📓'}</span><span class="lumi-hittext"><strong>${htmlEscape(item.title)}</strong><small>${htmlEscape(item.book)} · ${htmlEscape(item.snippet)}</small></span><span class="lumi-hit-page">${item.pageIndex+1}쪽</span></button>`).join('');
}
function openSearch(){if(!elSafe())return;closeAll();setVisible(searchModal,true);byId('lumiSearchField17').value='';renderSearch();requestAnimationFrame(()=>byId('lumiSearchField17').focus());}
function openHit(noteId,index){const note=noteById(noteId);if(!note)return;closeAll();selectNote(noteId);if(index>0)changePage(index);showToast(`${note.title} · ${index+1}페이지`);}

let pageVisibleCount=24;
function makePreview(page){const thumb=document.createElement('div');thumb.className='lumi-page-thumb17';
 if(page.pdfSourceId){const pdf=document.createElement('span');pdf.className='lumi-pdf-label17';pdf.textContent='PDF';thumb.appendChild(pdf);return thumb;}
 if(page.bgImage){const pic=document.createElement('span');pic.className='lumi-pdf-label17';pic.textContent='IMG';thumb.appendChild(pic);return thumb;}
 if(page.template==='lines')thumb.style.backgroundImage='repeating-linear-gradient(to bottom,transparent 0 18px,#d6e0f3 19px,transparent 20px)';
 if(page.template==='grid')thumb.style.backgroundImage='linear-gradient(#ebeff8 1px,transparent 1px),linear-gradient(90deg,#ebeff8 1px,transparent 1px)',thumb.style.backgroundSize='10px 10px';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',`0 0 ${Number(page.w)||1190} ${Number(page.h)||1684}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet');
 for(const it of (page.items||[]).slice(0,140)){
  if(it.type==='stroke'&&it.points?.length){const pts=[];for(let k=0;k<it.points.length;k+=Math.max(1,Math.ceil(it.points.length/80)))pts.push(it.points[k]);const node=document.createElementNS('http://www.w3.org/2000/svg','polyline');node.setAttribute('points',pts.map(p=>`${p.x},${p.y}`).join(' '));node.setAttribute('stroke',/^#[\da-fA-F]{3,8}$/.test(it.color||'')?it.color:'#303b61');node.setAttribute('stroke-width',String(Math.max(3,Number(it.size||3)*1.25)));node.setAttribute('stroke-linecap','round');node.setAttribute('stroke-linejoin','round');node.setAttribute('fill','none');node.setAttribute('opacity',it.tool==='marker'?'0.5':'0.9');svg.appendChild(node);
  } else if(it.type==='text'&&it.text){const node=document.createElementNS('http://www.w3.org/2000/svg','text');node.setAttribute('x',String(it.x||0));node.setAttribute('y',String(it.y||0));node.setAttribute('font-size',String(it.fontSize||28));node.setAttribute('fill','#344063');node.textContent=String(it.text).slice(0,120);svg.appendChild(node);}
 }
 thumb.appendChild(svg);return thumb;
}
function renderPages(){if(!elSafe())return;const note=activeNote();if(!note)return;
 const list=byId('lumiPagesGrid17');list.replaceChildren();byId('lumiPagesTitle17').textContent=note.title||'페이지';
 byId('lumiPagesSubtitle17').textContent=`전체 ${note.pages.length}페이지 · 페이지를 눌러 이동 · ←/→ 순서 변경`;
 const frag=document.createDocumentFragment();const stop=Math.min(pageVisibleCount,note.pages.length);
 for(let i=0;i<stop;i++){
  const p=note.pages[i],card=document.createElement('div');card.className='lumi-page-card17'+(data.pageIndex===i?' current':'');card.dataset.index=i;
  const preview=makePreview(p);preview.tabIndex=0;preview.setAttribute('role','button');preview.setAttribute('aria-label',`${i+1}페이지로 이동`);preview.onclick=()=>openPage(i);preview.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPage(i);}};
  const caption=document.createElement('div');caption.className='lumi-page-caption17';caption.innerHTML=`<strong>${i+1}페이지</strong><small>${p.pdfSourceId?'PDF · ':''}${(p.items||[]).length}개 요소</small>`;
  const tools=document.createElement('div');tools.className='lumi-page-actions17';
  const actions=[['mark',p.bookmarked?'★':'☆',p.bookmarked],['left','←',i===0],['right','→',i===note.pages.length-1]];
  for(const [action,label,disabled] of actions){const b=document.createElement('button');b.type='button';b.textContent=label;b.title=action==='mark'?'페이지 즐겨찾기':action==='left'?'왼쪽으로 이동':'오른쪽으로 이동';if(action==='mark'){b.classList.add('lumi-page-star17');b.classList.toggle('active',!!p.bookmarked);}else b.disabled=disabled;b.onclick=()=>pageAction(action,i);tools.appendChild(b);}
  card.append(preview,caption,tools);frag.appendChild(card);
 }
 list.appendChild(frag);
 byId('lumiPagesMore17').hidden=stop===note.pages.length;
}
function openPages(){if(!elSafe())return;closeAll();pageVisibleCount=Math.max(24,Math.ceil((data.pageIndex+1)/24)*24);setVisible(pagesModal,true);renderPages();}
function openPage(index){setVisible(pagesModal,false);changePage(index);}
function pageAction(action,index){const note=activeNote();if(!note||!note.pages[index])return;const chosen=note.pages[index];
 if(action==='mark'){chosen.bookmarked=!chosen.bookmarked;queueSave();renderPages();return;}
 const to=index+(action==='left'?-1:1);if(to<0||to>=note.pages.length)return;
 const activeId=currentPage()?.id;[note.pages[index],note.pages[to]]=[note.pages[to],note.pages[index]];
 data.pageIndex=Math.max(0,note.pages.findIndex(p=>p.id===activeId));renderPage();queueSave();renderPages();}

let pngBusy=false;
async function exportPagePNG(){if(!elSafe()||pngBusy)return;pngBusy=true;closeMenu();const page=currentPage(),note=activeNote();
 const status=byId('saveStatus');const oldText=status?.textContent;
 try{
  if(!page)return;commitTextEdit();if(status)status.textContent='PNG 생성 중…';
  // Reuse the existing 300 dpi PDF/image base, then paint vector ink on top.
  const base=await makePageJPEG(page);
  const canvas=document.createElement('canvas');canvas.width=base.w;canvas.height=base.h;
  const ctx=canvas.getContext('2d',{alpha:false});const blob=new Blob([base.bytes],{type:'image/jpeg'});
  let bitmap=null;if('createImageBitmap' in window)bitmap=await createImageBitmap(blob);
  else bitmap=await new Promise((resolve,reject)=>{const img=new Image();const url=URL.createObjectURL(blob);img.onload=()=>{URL.revokeObjectURL(url);resolve(img);};img.onerror=e=>{URL.revokeObjectURL(url);reject(new Error('이미지 렌더링 실패'));};img.src=url;});
  ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  if(typeof bitmap.close==='function')bitmap.close();
  ctx.save();ctx.scale(base.w/page.w,base.h/page.h);
  for(const item of page.items||[])if(item.type==='stroke')drawStroke(ctx,item);
  ctx.restore();
  const out=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('PNG 생성 실패')),'image/png'));
  canvas.width=canvas.height=1;
  downloadBlob(out,`${(note.title||'Lumi Note').replace(/[\\/:*?"<>|]/g,'_')}_${data.pageIndex+1}페이지.png`);
  showToast(`고해상도 PNG 저장 완료 (${base.w} × ${base.h})`);
 }catch(e){console.error('PNG export',e);showToast('이미지 저장에 실패했습니다: '+e.message,4500);}finally{pngBusy=false;if(status)status.textContent=oldText==='저장 오류'?oldText:'저장됨';}
}
function clearInk(){const page=currentPage();if(!page)return;const count=(page.items||[]).filter(it=>it.type==='stroke').length;
 if(!count){showToast('지울 필기 획이 없습니다.');return;}
 if(!confirm(`현재 페이지의 손글씨와 형광펜 ${count}개 획을 지울까요?\nPDF 배경, 이미지, 텍스트, 학습 객체는 유지됩니다. (실행 취소 가능)`))return;
 commitTextEdit();pushHistory();page.items=page.items.filter(it=>it.type!=='stroke');renderInk();renderLive();if(typeof renderObjects==='function')renderObjects();queueSave();updateHistoryButtons();showToast('필기 획을 지웠습니다. 실행 취소할 수 있습니다.');
}
function togglePerformance(){if(!elSafe())return;data.settings.performanceMode=!data.settings.performanceMode;perfSync();queueSave();showToast(data.settings.performanceMode?'저전력 모드 켜짐 · 블러 및 애니메이션 최소화':'고급 화면 효과 복원');}
async function handleMenuAction(action){closeMenu();switch(action){case'pin':togglePin();break;case'duplicate':duplicateCurrentNote();break;case'move':moveCurrentNote();break;case'stats':showNoteStats();break;case'pages':openPages();break;case'png':await exportPagePNG();break;case'performance':togglePerformance();break;case'backup':await backupJSON();break;case'clear':clearInk();break;}}

byId('lumiSearchBtn17').onclick=openSearch;
byId('lumiPagesBtn17').onclick=openPages;
byId('lumiQuickBtn17').onclick=quickMenu;
menu.querySelectorAll('[data-lumi-action]').forEach(button=>button.onclick=()=>handleMenuAction(button.dataset.lumiAction));
byId('lumiSearchField17').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(renderSearch,95);};
byId('lumiSearchResults17').onclick=e=>{const b=e.target.closest('[data-hit-note]');if(b)openHit(b.dataset.hitNote,Number(b.dataset.hitPage)||0);};
byId('lumiAddPage17').onclick=()=>{addPage();pageVisibleCount=24;renderPages();};
byId('lumiPagesMore17').onclick=()=>{pageVisibleCount+=24;renderPages();};
for(const button of document.querySelectorAll('[data-close]'))button.onclick=closeAll;
for(const modal of [searchModal,pagesModal,secondaryModal])modal.onclick=e=>{if(e.target===modal)closeAll();};
document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!byId('lumiQuickBtn17').contains(e.target))closeMenu();},true);

function isTypingTarget(target){return !!target?.closest?.('input,textarea,[contenteditable="true"],[role="textbox"]');}
window.addEventListener('keydown',e=>{
 const modifier=e.metaKey||e.ctrlKey;
 if(modifier&&e.key.toLowerCase()==='k'){e.preventDefault();e.stopPropagation();openSearch();return;}
 if(e.key==='Escape'&&(!searchModal.hidden||!pagesModal.hidden||!secondaryModal.hidden||!menu.hidden)){e.preventDefault();closeAll();return;}
 if(!searchModal.hidden||!pagesModal.hidden||!secondaryModal.hidden||!menu.hidden||isTypingTarget(e.target))return;
 if(modifier&&e.shiftKey&&e.key.toLowerCase()==='f'){e.preventDefault();togglePin();return;}
 if(e.altKey&&e.key==='ArrowRight'){e.preventDefault();changePage(data.pageIndex+1);return;}
 if(e.altKey&&e.key==='ArrowLeft'){e.preventDefault();changePage(data.pageIndex-1);return;}
},true);

document.addEventListener('visibilitychange',()=>{if(document.hidden&&elSafe()){try{saveImmediately();}catch(e){console.warn(e);}}});
window.addEventListener('pagehide',()=>{if(elSafe()){try{saveImmediately();}catch(e){console.warn(e);}}});

function ready(){if(!elSafe())return;perfSync();renderLibrary();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ready,0),{once:true});else setTimeout(ready,0);
// Smoke-test hooks: no additional data storage required.
window.lumi17={version:'1.7',openSearch,openPages,searchAllNotes,duplicateCurrentNote,moveCurrentNote,showNoteStats,togglePin,exportPagePNG,clearInk,performance:togglePerformance};
})();
