/* Replace only the baked-in professor portrait, preserving the rest of the map. */
(() => {
  const previousIsland = renderIsland;
  renderIsland = function () {
    const portrait = '<img class="wobblehorn-map-portrait" src="assets/wobblehorn-map.png" alt="Professor Wobblehorn, a white unicorn with a golden horn, rainbow mane and purple wizard clothes" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;clip-path:inset(0 19.8% 85% 64.5%);pointer-events:none;z-index:1">';
    return previousIsland().replace('<div class="mapStage">', '<div class="mapStage">' + portrait);
  };
  render();
})();
