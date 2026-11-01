/* Lab presentation and temporary effects; no game progress or reward changes. */
window.Wobbleworks = (() => {
  let resetTimer;
  function render() {
    clearTimeout(resetTimer);
    const cloud='<svg viewBox="0 0 120 80" aria-hidden="true"><path d="M25 67C-4 65-3 36 17 32C10 7 43 0 55 17C69-7 104 6 99 29C128 31 129 65 101 67Z" fill="currentColor"/><ellipse cx="36" cy="29" rx="13" ry="8" fill="white" opacity=".18"/></svg>';
    const smoke=[['left','pink'],['middle','mint'],['right','purple']].map(([position,color])=>`<div class="lab-smoke lab-smoke--${position} lab-smoke--${color}">${[0,1,2].map(i=>`<span class="lab-smoke-puff" style="--puff-delay:${i*-2}s">${cloud}</span>`).join('')}</div>`).join('');
    return `<section class="wobbleworks-page"><span class="lab-eyebrow">A LITTLE SCIENCE. A LOT OF SILLY.</span><h1 class="sectionTitle">The Wobbleworks 🦄🧪</h1><p class="hint">Welcome to the island’s wonderfully wobbly laboratory!</p><div class="wobbleworks-scene" role="group" aria-label="Inside the Wobbleworks laboratory" data-experiment-state="idle"><img class="lab-interior" src="assets/wobbleworks-interior.png" alt="A colorful laboratory with bubbling flasks, spiral glass tubes, copper pipes, workbenches and a rainbow experiment machine"><div class="lab-ambient" aria-hidden="true">${smoke}<span class="lab-bubble lab-bubble--one"></span><span class="lab-bubble lab-bubble--two"></span><span class="lab-bubble lab-bubble--three"></span></div><div class="labDuo"><div class="lab-scientist lab-scientist--wobblehorn">${CupcakeCharacters.sprite('wobblehorn')}<strong>Professor Wobblehorn</strong></div><div class="lab-scientist lab-scientist--fizzbert">${CupcakeCharacters.sprite('fizzbert')}<strong>Fizzbert</strong></div></div><div class="lab-explosion" aria-hidden="true"><span class="lab-burst-cloud lab-burst-cloud--pink">${cloud}</span><span class="lab-burst-cloud lab-burst-cloud--mint">${cloud}</span><span class="lab-burst-cloud lab-burst-cloud--purple">${cloud}</span><span class="lab-burst-word">POOMF!</span>${[0,1,2,3,4,5].map(i=>`<span class="lab-burst-star" style="--star-angle:${i*60}deg">✦</span>`).join('')}</div></div><div class="lab-experiment-panel"><h2>The Big Rainbow Experiment</h2><p class="lab-dialogue"><strong>Wobblehorn:</strong> “Fizzbert, why is the toaster wearing roller skates?”<br><strong>Fizzbert:</strong> “For SCIENCE!”</p><button class="cta lab-experiment-button" type="button" onclick="Wobbleworks.runExperiment()">🌈 Try the rainbow experiment</button><p class="lab-experiment-status" role="status">The rainbow machine is ready. What could possibly go wobbly?</p></div></section>`;
  }
  function runExperiment() {
    const scene=document.querySelector('.wobbleworks-scene');
    const button=document.querySelector('.lab-experiment-button');
    const status=document.querySelector('.lab-experiment-status');
    if(!scene || !button || button.disabled)return;
    clearTimeout(resetTimer);
    scene.dataset.experimentState='running';
    scene.classList.add('is-experimenting');
    button.disabled=true;
    status.textContent='POOMF! Rainbow clouds! Fizzbert may have added one extra bubble…';
    celebrate('Fizzbert pressed the BIG RAINBOW BUTTON!');
    resetTimer=setTimeout(()=>{
      scene.classList.remove('is-experimenting');
      scene.dataset.experimentState='idle';
      button.disabled=false;
      status.textContent='Experiment complete! Ready for another wonderfully wobbly try?';
    },2000);
  }
  return {render,runExperiment};
})();
