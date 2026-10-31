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
