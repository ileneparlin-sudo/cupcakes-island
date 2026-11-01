/* One transparent full-body sprite per character, shared across every surface. */
window.CupcakeCharacters = (() => {
  const sources = {
    wobblehorn: {url:'assets/wobblehorn-sprite.png',name:'Professor Wobblehorn, a silly unicorn with a golden horn, crooked glasses and a floppy wizard hat'},
    fizzbert: {url:'assets/fizzbert-sprite.png',name:'Fizzbert, a silly turquoise axolotl with feathery pink gills, four feet and a long finned tail'}
  };
  function sprite(id) {
    const character=sources[id];
    if(!character) throw new Error('Unknown Cupcake Island character');
    return `<img class="character-sprite" data-character="${id}" src="${character.url}" alt="${character.name}" draggable="false">`;
  }
  return {sources,sprite};
})();
