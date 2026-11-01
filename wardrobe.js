/* Shared by the isolated preview and the game. No storage or game-state ownership. */
window.MaeveWardrobe = (() => {
  const options = {
    hair: [['pink','Rose pink','#ec78b1'],['purple','Lilac','#b89ae6'],['brown','Natural','#855644']],
    top: [['purple','Lavender','#a78be4'],['pink','Bubblegum','#f596c3'],['mint','Mint','#86d9ca']],
    bottom: [['pink','Petal pink','#f6a0ce'],['purple','Lilac','#bfa0ec'],['blue','Sky blue','#91d0ed']],
    shoes: [['pink','Rose','#ec83b7'],['purple','Violet','#a18add'],['blue','Ocean','#7dc4e4']],
    accessory: [['bow','Ribbon bow','#f080b6'],['stars','Star clips','#ffdc7e'],['none','No accessory','#eee3f4']]
  };
  const labels = {hair:'Hair streaks',top:'Cozy hoodies',bottom:'Twirl skirts',shoes:'Sneakers',accessory:'Hair accessories'};
  function choices(data,key) {
    const list=options[key].slice();
    if(key==='top' && data.owned?.includes('rainbow')) list.push(['rainbow','Rainbow reward','#ffd278']);
    if(key==='shoes' && data.owned?.includes('starshoes')) list.push(['starshoes','Starry high-tops','#ffe092']);
    if(key==='accessory' && data.owned?.includes('cathead')) list.push(['cathead','Cat-ear headphones','#b39ae7']);
    return list;
  }
  function color(key,value) {return options[key].find(x=>x[0]===value)?.[2] || options[key][0][2]}
  function avatar(d) {
    const streak=color('hair',d.hair), hoodie=d.top==='rainbow'?'url(#maeve-rainbow)':color('top',d.top), skirt=color('bottom',d.bottom), shoes=d.shoes==='starshoes'?'#645090':color('shoes',d.shoes);
    const accessory=choices(d,'accessory').some(x=>x[0]===d.accessory)?d.accessory:'bow';
    return `<svg class="maeve-art" viewBox="0 0 320 420" role="img" aria-label="Maeve matching the island portrait, with glossy eyes, chestnut curls, ${d.hair==='brown'?'natural brown':'colored'} streaks and her chosen outfit" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="maeve-hair" x2=".8" y2="1"><stop stop-color="#98634b"/><stop offset=".5" stop-color="#684134"/><stop offset="1" stop-color="#482e32"/></linearGradient><linearGradient id="maeve-skin" x2=".7" y2="1"><stop stop-color="#ffe1cc"/><stop offset="1" stop-color="#f3b9a1"/></linearGradient><linearGradient id="maeve-rainbow" x2="1" y2="1"><stop stop-color="#ff9ac9"/><stop offset=".35" stop-color="#ffe295"/><stop offset=".65" stop-color="#9ce4d6"/><stop offset="1" stop-color="#b99bec"/></linearGradient><radialGradient id="maeve-iris"><stop stop-color="#c28a4e"/><stop offset="1" stop-color="#59372d"/></radialGradient></defs>
    <ellipse cx="160" cy="399" rx="93" ry="12" fill="#bba3d0" opacity=".3"/>
    <g stroke="#593948" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">
    <path d="M129 323L125 370H145L150 324M173 324L176 370H196L191 321" fill="url(#maeve-skin)"/>
    <path d="M119 226Q99 224 89 248L73 289Q78 303 91 296L113 266M201 226Q221 224 231 248L247 289Q242 303 229 296L207 266" fill="${hoodie}"/>
    <path d="M76 288Q65 305 80 310Q94 308 92 296M244 288Q255 305 240 310Q226 308 228 296" fill="url(#maeve-skin)"/>
    <path d="M128 215Q160 202 192 215L211 291Q160 307 109 291Z" fill="${hoodie}"/>
    <path d="M128 218Q160 245 192 218L184 207H136Z" fill="#fff5fa"/><path d="M144 229V249M176 229V249" stroke="white"/>
    <path d="M139 268Q160 260 181 268L185 285H135Z" fill="white" fill-opacity=".25"/>
    <path d="M160 245L164 254L174 255L167 262L169 272L160 267L151 272L153 262L146 255L156 254Z" fill="#ffe39d" stroke-width="1.5"/>
    <path d="M111 289Q160 303 209 289L224 333Q160 357 96 333Z" fill="${skirt}"/><path d="M123 302L116 331M145 307L142 339M175 307L178 339M198 302L204 331" fill="none" stroke="#fff1fa" stroke-width="3"/><path d="M101 330Q160 350 219 330" fill="none" stroke="#fff1fa" stroke-width="4"/>
    <path d="M122 363H145L149 387Q125 399 104 388Q100 374 122 371ZM176 363H199L198 371Q220 374 216 388Q195 399 171 387Z" fill="${shoes}"/><path d="M107 388Q128 397 149 387M171 387Q192 397 214 388" stroke="white" stroke-width="6"/><path d="M123 373H140M119 380H142M180 373H197M178 380H201" stroke="white"/>
    ${d.shoes==='starshoes'?'<path d="M110 373l3 4 5-1-3 4 1 5-4-3-4 2 1-5-3-3Z M207 373l3 4 5-1-3 4 1 5-4-3-4 2 1-5-3-3Z" fill="#ffe39d" stroke="none"/>':''}
    <image href="assets/maeve-portrait-head.png" x="25" y="-8" width="270" height="300" preserveAspectRatio="xMidYMid meet" data-portrait-head="true"/>
    ${d.hair==='brown'?'':`<g fill="none" stroke="${streak}" stroke-width="3" opacity=".65"><path d="M86 122Q69 142 83 155T76 185T82 218"/><path d="M238 139Q251 155 239 173T246 205T238 232"/></g>`}
    ${accessory==='bow'?'<path d="M93 63Q61 34 68 72Q65 93 94 76Q125 91 118 65Q121 38 93 63Z" fill="#72d9ed"/><path d="M75 60L85 66M104 62L111 69" stroke="#d69be9" stroke-width="5"/><circle cx="94" cy="70" r="8" fill="#f79dd2"/>':accessory==='stars'?'<path d="M84 55l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1Z M221 59l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1Z" fill="#ffe19b"/>':accessory==='cathead'?'<path d="M78 130Q53 28 160 26Q267 28 242 130" fill="none" stroke="#aa8bdf" stroke-width="11"/><path d="M89 59L84 13L121 36M199 36L236 13L231 59" fill="#c9adf0"/><rect x="68" y="122" width="21" height="47" rx="10" fill="#c9adf0"/><rect x="231" y="122" width="21" height="47" rx="10" fill="#c9adf0"/>':''}
    </g></svg>`;
  }
  function markup(d) {
    return `<section class="maeve-wardrobe"><header><span class="maeve-eyebrow">CUPCAKE ISLAND · STYLE STUDIO</span><h1>Made for Maeve <span>♡</span></h1><p>A little sparkle. A cozy hoodie. A look that’s all yours.</p></header><div class="maeve-layout"><div class="maeve-stage"><span class="maeve-sticker">✦ Hello, lovely!</span><div data-maeve-avatar>${avatar(d)}</div><p>Maeve’s outfit <span aria-hidden="true">✧</span></p></div><div class="maeve-options">${Object.keys(options).map(k=>`<fieldset><legend>${labels[k]}</legend><div class="maeve-swatches">${choices(d,k).map(([v,n,c])=>`<button type="button" data-outfit-key="${k}" data-outfit-value="${v}" aria-pressed="${(d[k] || (k==='accessory'?'bow':''))===v}" style="--swatch:${c}"><span class="maeve-dot" aria-hidden="true"></span>${n}<span class="maeve-check" aria-hidden="true">✓</span></button>`).join('')}</div></fieldset>`).join('')}<p class="maeve-save" role="status">Your look saves automatically ✨</p><p class="maeve-shop-note">Collected outfits stay yours. Find more in the Star Shop.</p></div></div></section>`;
  }
  function mount(root,data,onChange) {
    root.innerHTML=markup(data);
    root.onclick=e=>{
      const button=e.target.closest('button[data-outfit-key]');if(!button || !root.contains(button))return;
      const key=button.dataset.outfitKey,value=button.dataset.outfitValue;
      if(!choices(data,key).some(x=>x[0]===value))return;
      data[key]=value;
      root.querySelector('[data-maeve-avatar]').innerHTML=avatar(data);
      root.querySelectorAll(`[data-outfit-key="${key}"]`).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      try {onChange();root.querySelector('[role="status"]').textContent='Outfit saved ✨';}
      catch {root.querySelector('[role="status"]').textContent='Your look changed, but could not be saved. Check browser storage.';}
    };
  }
  return {mount,avatar};
})();
