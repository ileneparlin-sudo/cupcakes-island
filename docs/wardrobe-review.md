# Maeve's wardrobe upgrade

The wardrobe uses a layered SVG illustration with brown eyes, wavy brown hair,
colored streaks, rosy cheeks, hoodies, pleated skirts, sneakers and accessories.
The shared implementation is in `wardrobe.js` and `wardrobe.css`.

`wardrobe-preview.html` is an isolated, interactive design preview using sample
state. It never reads or writes the game's storage. Run a static server from the
repository root (`python3 -m http.server 8000`) and open that file through it.
The normal game uses the same component through its existing Wardrobe navigation.

Existing `cupcake-island-v1` outfit fields and the existing save function are
retained. Only hair, top, bottom, shoes and the new accessory field are updated.
No save migration or progress reset is introduced. An absent accessory defaults
to a bow. Rainbow hoodies, starry shoes and cat-ear headphones remain gated by
existing shop ownership and existing prices. A storage failure displays an
honest save error; the outfit remains visible for the current session.

## Validation

With the static server running, run `python3 tests/wardrobe_smoke.py`.
Requires Python Playwright and Chromium at `/usr/bin/chromium` (provided by the
cloud environment). Browser/socket execution may require tool sandbox permission.
Tests use disposable contexts, never personal game progress. Coverage includes
all wardrobe options, reward gating/purchase, save/reload, preservation of
non-outfit progress, 48px touch targets, all 11 navigation destinations, storage
failure messaging, and phone/tablet/desktop layouts.

Real iPhone Safari and Samsung hardware validation remains a manual review step.
The browser checks emulate touch and viewport sizes in Chromium.
No production deployment or merge is part of this change.

## Portrait consistency update

The wardrobe head now uses a transparent illustration recreated from the island
portrait reference, replacing the simplified vector face and hair. The new
asset is `assets/maeve-portrait-head.png`; it is a close recreation, not an
identical extraction from the flattened map. The bow uses the reference’s blue
and pink palette. Outfit, streak and accessory layers remain independently
customizable, with the same save format and reward ownership rules.

## Professor Wobblehorn map correction

The baked-in owl-like professor portrait is replaced with a unicorn portrait
through `island-portraits.js`. The replacement map asset is clipped to the
professor area; the original map renders everywhere else, preserving labels,
landmarks, and tap targets. The overlay ignores pointer events and scales with
the map in whole-island and zoomed views. No progress or save changes are made.

## Shared character artwork

`characters.js` defines the canonical dashboard image and portrait viewport for
Professor Wobblehorn and Fizzbert. The lab and celebration reuse those exact
image regions rather than separate SVG interpretations. `assets/island-map.png`
is the original embedded map, moved unchanged to a cacheable asset; its Fizzbert
portrait is reused as-is. Wobblehorn uses the existing corrected dashboard asset.
Existing animation, captions, routines, rewards, and save logic are retained.
Run `python3 tests/characters_smoke.py` with the static server running to verify
shared image sources, loading, animation cleanup, navigation and unchanged saves.
