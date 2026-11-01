/* Read-only Home presentation: counters always come from the existing game save. */
window.HomeDashboard = (() => {
  function render(data,model,hour=new Date().getHours()) {
    const next=model.next(hour);
    const wins=Object.values(model.state().claims).filter(value=>value===true).length;
    const treasures=new Set(data.owned).size;
    const counters=[
      {id:'wins',value:wins,label:'Little wins today',icon:'✦'},
      {id:'stars',value:data.stars,label:'Stars',icon:'★'},
      {id:'treasures',value:treasures,label:'Treasures',icon:'◆'}
    ];
    const number=value=>Number(value).toLocaleString();
    return `<section class="adventure-home dashboard-home"><div class="home-intro"><div><span class="adventure-eyebrow">YOUR LITTLE WORLD OF WONDER</span><h1>Hi, Maeve!</h1><p>Little adventures.<br><strong>Big imagination.</strong></p></div><div class="home-maeve">${MaeveWardrobe.avatar(data)}</div></div><dl class="dashboard-stats" aria-label="Your little wins and treasures">${counters.map(({id,value,label,icon})=>`<div class="dashboard-stat dashboard-stat--${id}"><span class="dashboard-stat-icon" aria-hidden="true">${icon}</span><dt>${label}</dt><dd data-home-stat="${id}" style="--digits:${number(value).length}">${number(value)}</dd></div>`).join('')}</dl><p class="dashboard-encouragement">${wins?'Every little win counts, including the ones with help.':'A fresh start. Every little try counts.'}</p><section class="next-adventure dashboard-next"><span class="adventure-eyebrow">YOUR NEXT LITTLE ADVENTURE</span><h2>${next?safeText(next.name):'A little time to just be you'}</h2><p>${next?'One small step. Help is welcome.':'Nothing urgent right now. Rest, play, or come back to a step later.'}</p>${next?`<button class="cta" onclick="openRoutine('${next.group}')">Let’s try it! →</button>`:'<button class="cta" onclick="go(\'day\')">See My Day</button>'}</section><button class="dashboard-explore" type="button" aria-label="Explore Island" onclick="go('island')"><span class="dashboard-explore-title">Explore Island →</span><span class="dashboard-explore-note">Your island is always open</span></button><div class="dashboard-shortcuts"><button type="button" onclick="go('wardrobe')"><strong>Dress Up</strong><span>Twinkle Threads →</span></button><button type="button" onclick="go('day')"><strong>My Day</strong><span>Little adventures →</span></button></div><p class="adventure-reassurance">Play is always welcome. Treasures include your collected outfits and decorations.</p></section>`;
  }
  return {render};
})();
