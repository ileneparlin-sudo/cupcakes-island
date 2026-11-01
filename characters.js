/* Canonical character portraits: render the exact dashboard artwork everywhere. */
window.CupcakeCharacters = (() => {
  const sources = {
    wobblehorn: {url:'assets/wobblehorn-map.png',viewBox:'995 0 235 154',name:'Professor Wobblehorn, the unicorn professor'},
    fizzbert: {url:'assets/island-map.png',viewBox:'365 12 125 115',name:'Fizzbert, the blue and pink axolotl'}
  };
  function portrait(id) {
    const character=sources[id];
    if(!character) throw new Error('Unknown Cupcake Island character');
    return `<svg class="character-portrait" data-character="${id}" viewBox="${character.viewBox}" role="img" aria-label="${character.name}" xmlns="http://www.w3.org/2000/svg"><image href="${character.url}" width="1536" height="1024"/></svg>`;
  }
  return {sources,portrait};
})();
