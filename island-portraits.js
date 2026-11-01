/* Replace baked-in mascots with shared transparent animals; preserve the map. */
(() => {
  const previousIsland = renderIsland;
  renderIsland = function () {
    // Clear only the old mascot silhouettes; retain the original map elsewhere.
    const sky = '<svg class="mascot-sky" viewBox="0 0 1536 1024" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="mascot-sky-clip"><rect x="360" y="0" width="145" height="124"/><rect x="990" y="0" width="245" height="154"/></clipPath></defs><image href="assets/mascot-sky.png" width="1536" height="1024" clip-path="url(#mascot-sky-clip)"/></svg>';
    const mascots = ['fizzbert','wobblehorn'].map(id=>'<div class="dashboard-mascot dashboard-mascot--'+id+'">'+CupcakeCharacters.sprite(id)+'</div>').join('');

    return previousIsland().replace('<div class="mapStage">', '<div class="mapStage">' + sky + mascots);
  };
})();
