/* Replace only the baked-in professor portrait, preserving the rest of the map. */
(() => {
  const previousIsland = renderIsland;
  renderIsland = function () {
    const portrait = '<img class="wobblehorn-map-portrait" src="' + CupcakeCharacters.sources.wobblehorn.url + '" alt="Professor Wobblehorn, a white unicorn with a golden horn, rainbow mane and purple wizard clothes" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;clip-path:inset(0 19.8% 85% 64.5%);pointer-events:none;z-index:1">';
    const maeveEyes = '<svg class="maeve-map-eyes" viewBox="0 0 1536 1024" role="img" aria-label="Maeve with brown eyes" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="maeve-map-eye-clip"><ellipse cx="96" cy="85" rx="8" ry="10"/><ellipse cx="124" cy="85" rx="8" ry="10"/></clipPath></defs><image href="assets/maeve-map-brown-eyes.png" width="1536" height="1024" clip-path="url(#maeve-map-eye-clip)"/></svg>';
    return previousIsland().replace('<div class="mapStage">', '<div class="mapStage">' + portrait + maeveEyes);
  };
  render();
})();
