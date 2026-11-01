/* First milestone: focused navigation and one gentle daily adventure system. */
(() => {
  const backupKey=KEY+'-before-adventures-v1';
  let notice=saveReadOnly?'Your saved game could not be read. The original save has been left untouched. This visit cannot save changes. Please ask a grown-up for help before clearing browser data.':'';
  if(initialSaveRaw&&!saveReadOnly&&!sup.adventures){try{if(!localStorage.getItem(backupKey))localStorage.setItem(backupKey,initialSaveRaw);}catch{notice='Browser storage is unavailable. Please keep this tab open until saving works again.';}}
  let model;
  try{model=AdventureModel.create(data,dayKey);}catch(error){saveReadOnly=true;notice=error.message;delete sup.adventures;model=AdventureModel.create(data,dayKey);}
  try{if(save()===false)throw new Error('Saving unavailable');}catch{if(!notice)notice='Your progress could not be saved. Check browser storage before closing this tab.';}
  const names={home:'Home',island:'Explore Island',wardrobe:'Twinkle Threads',day:'My Day',learning:'Learning Tree',dream:'Dream Garden',room:'Maeve’s Cottage',pond:'Lily Pad Landing',lab:'Wobbleworks',rewards:'Star Shop',mama:'Mama Mode',routine:'Little Adventure'};
  function persist(action){
    const before=structuredClone(data);
    try{const result=action();if(save()===false)throw new Error('Saving unavailable');notice='';return result;}
    catch{
      for(const k of Object.keys(sup))delete sup[k];Object.assign(sup,before.support);
      for(const k of Object.keys(data))if(k!=='support')delete data[k];
      Object.assign(data,{...before,support:sup});
      notice='That change could not be saved. Your Stars have not changed. Please try again when browser storage is available.';
      return false;
    }
  }
  const progress=(g)=>{const p=model.progress(g);return `<div class="adventure-progress" role="progressbar" aria-label="Little steps celebrated" aria-valuemin="0" aria-valuemax="${p.total}" aria-valuenow="${p.done}"><span style="width:${p.total?p.done/p.total*100:0}%"></span></div><p class="adventure-progress-label">${p.done} of ${p.total} little steps celebrated${sup.hard?' · Gentle Day':''}</p>`;};
  function home(){return HomeDashboard.render(data,model);}

  function day(){return `<section class="adventure-day"><h1>Today’s Little Adventures</h1><p>Trying, asking for help, and taking a break all belong here.</p><button class="gentle-toggle" aria-pressed="${sup.hard}" onclick="toggleGentle()">${sup.hard?'Gentle Day is on · show full routines':'Make today gentler'}</button>${progress()}<div class="adventure-paths">${Object.entries(model.groups).map(([g,r])=>{const p=model.progress(g);return `<button class="adventure-path" onclick="openRoutine('${g}')"><strong>${r.title}</strong><span>${p.done} / ${p.total} little steps · Open adventure →</span></button>`;}).join('')}</div><p class="adventure-reassurance">Each unique step earns 5 Stars once a day. Reading counts in both places, with one reward. Stars you’ve earned stay yours.</p></section>`;}
  function routine(g){const r=model.groups[g];return `<section class="routine-adventure"><h1>${r.title}</h1><p>One little step at a time. Help counts. Breaks count, too.</p>${sup.hard?'<p class="gentle-notice">Gentle Day: just a few small steps. Everything else can wait.</p>':''}${progress(g)}<ol class="adventure-steps">${model.visible(g).map(s=>{const done=model.done(g,s.i),later=model.state().postponed[s.key];return `<li class="adventure-step ${done?'is-done':''}" data-step="${s.key}"><h2>${safeText(s.name)}</h2><p class="step-state">${done?'Celebrated! Your Stars are saved.':later?'Saved for later. No hurry.':'Try it your way, independently or with help. +5 Stars'}</p><div class="step-actions"><button class="step-complete" ${done?'disabled':''} onclick="completeStep('${g}',${s.i})">${done?'✓ Celebrated':'I did it!'}</button><details><summary>I need help</summary><div class="step-help"><ol>${s.hints.map(h=>`<li>${safeText(h)}</li>`).join('')}</ol><p>You can ask a trusted grown-up to do this with you.</p></div></details><button ${done?'disabled':''} onclick="AdventureUI.postpone('${g}',${s.i})">${later?'Ready now':'Try later'}</button></div></li>`;}).join('')}</ol><button class="cta" onclick="go('day')">Back to My Day</button><p class="adventure-reassurance">Comfort is always allowed. Bedtime practice is optional; sleep is never scored.</p></section>`;}
  const previousRender=render;
  render=function(){
    const rolled=model.ensureDay();if(rolled){try{if(save()===false)throw new Error('Saving unavailable');}catch{if(!notice)notice='The new day could not be saved yet. Please check browser storage.';}}
    const custom=['home','day','quests','routine','learning'].includes(page);
    if(!custom)previousRender();
    else{
      document.getElementById('main').onclick=null;
      document.getElementById('stars').textContent=data.stars;
      ['wardrobe-open','cottage-open','lab-open'].forEach(c=>document.body.classList.remove(c));
    }
    const main=document.getElementById('main');
    if(page==='home')main.innerHTML=home();
    if(page==='day'||page==='quests')main.innerHTML=day();
    if(page==='routine')main.innerHTML=routine(selectedRoutine);
    if(page==='learning')main.innerHTML=`<h1>The Learning Tree</h1><p>Reading, math and schoolwork, one little try at a time.</p><button class="cta" onclick="openRoutine('learning')">Start a learning adventure</button><p>Reading adventures: ${sup.reading} · Magic Keys: ${sup.keys}</p><h2>Schoolwork from Mama</h2>${sup.homework.length?sup.homework.map((h,i)=>`<div class="assignment"><strong>${safeText(h.name)}</strong><button ${h.done?'disabled':''} onclick="finishHomework(${i})">${h.done?'✓ Tried':'I worked on it!'}</button></div>`).join(''):'<p>No assignments waiting. A book or a little practice is welcome.</p>'}<p class="adventure-reassurance">Assignment effort shares the daily schoolwork reward. No duplicate Stars for the same activity.</p>`;
    if(page==='island'){
      const stage=main.querySelector('.mapStage');
      const canvas=document.createElement('div');canvas.className='map-canvas';
      while(stage.firstChild)canvas.append(stage.firstChild);stage.append(canvas);
      const stars=safeText(Number(data.stars).toLocaleString());
      canvas.insertAdjacentHTML('beforeend',`<div class="map-maeve" aria-label="Maeve’s current outfit">${MaeveWardrobe.avatar(data)}</div><svg class="map-live-stars" viewBox="0 0 1536 1024" aria-label="${stars} Stars" role="img"><rect x="220" y="62" width="99" height="49" rx="12" fill="#ffe9f6"/><text x="227" y="102" fill="#90219d" font-family="system-ui,sans-serif" font-size="${stars.length>4?25:37}" font-weight="900">${stars}</text></svg>`);
      main.querySelector('.quickPlaces')?.parentElement.remove();main.querySelector('.welcome')?.remove();
      main.querySelectorAll('.mapHotspot').forEach(b=>{if(["Visit Explore","Visit Beach & Fishing"].includes(b.getAttribute('aria-label')))b.remove();});
    }
    if(page==='mama'){const warning=document.createElement('p');warning.className='parent-security-note';warning.textContent='This PIN helps prevent accidental entry on this device. It is stored in the browser, can be inspected or reset, and is not secure authentication. Do not reuse a private PIN.';main.append(warning);}
    if(page!=='home'){const back=document.createElement('button');back.className='island-back';back.textContent='← Back to Island';back.onclick=()=>go('island');main.prepend(back);}
    document.getElementById('nav').innerHTML=[['home','Home'],['island','Explore Island'],['day','My Day'],['wardrobe','Dress Up']].map(([p,n])=>`<button class="${page===p?'active':''}" ${page===p?'aria-current="page"':''} onclick="go('${p}')">${n}</button>`).join('')+`<label class="more-places">More places<select aria-label="Visit another place" onchange="if(this.value)go(this.value)"><option value="">Choose a place</option>${['room','learning','dream','pond','lab','rewards'].map(p=>`<option value="${p}" ${page===p?'selected':''}>${names[p]}</option>`).join('')}</select></label><button class="mama-nav" onclick="go('mama')">Mama Mode 🔒</button>`;
    const route=document.getElementById('route-status');if(route)route.textContent=names[page]||'Little Adventure';
    if(notice){const el=document.createElement('p');el.className='save-warning';el.setAttribute('role','alert');el.textContent=notice;main.prepend(el);}
  };
  const previousGo=go;
  go=function(next){if(page==='mama'&&next!=='mama')mamaUnlocked=false;previousGo(next==='quests'?'day':next);};
  openRoutine=function(g){if(!model.groups[g])return;selectedRoutine=g;go('routine');};
  completeStep=function(g,i){if(!model.valid(g,i))return;if(persist(()=>model.complete(g,i))){render();celebrate('A little step celebrated! +5 Stars');}else render();};
  complete=function(id){const target={morning:'morning',bedtime:'evening',school:'learning',reading:'learning',help:'afternoon'}[id];if(target)openRoutine(target);};
  finishHomework=function(i){const h=sup.homework[i];if(!h||h.done)return;let awarded=false;if(persist(()=>{h.done=true;awarded=model.complete('learning',2);return true;})){render();celebrate(awarded?'Schoolwork effort! +5 Stars':'Schoolwork effort celebrated!');}else render();};
  toggleGentle=function(){persist(()=>{sup.hard=!sup.hard;return true;});render();};
  routineCount=g=>model.progress(g).done;
  window.AdventureUI={postpone(g,i){persist(()=>model.postpone(g,i));render();},model};
  const route=document.createElement('span');route.id='route-status';route.className='srOnly';route.setAttribute('aria-live','polite');document.body.append(route);
  document.body.classList.add('adventure-foundation');
  page='home';render();
})();
