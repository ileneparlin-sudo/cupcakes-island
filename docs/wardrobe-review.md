# Wardrobe and character review

Maeve's wardrobe uses a layered illustration with brown eyes, chestnut curls,
colored streaks, rosy cheeks, hoodies, pleated skirts, sneakers and accessories.
The shared implementation is in `wardrobe.js` and `wardrobe.css`.

`wardrobe-preview.html` is an isolated interactive preview with sample state.
It never reads or writes game storage. Run a static server from the repository
root (`python3 -m http.server 8000`) and open that file through the server.
The game uses the same component through its existing Wardrobe navigation.

Existing `cupcake-island-v1` outfit fields and save function are retained. Only
hair, top, bottom, shoes and accessory fields change. No progress reset or save
migration is introduced. An absent accessory defaults to a bow. Shop ownership
and prices are unchanged. A storage failure displays an explicit save error.
Brown eyes are fixed independently of outfit choices, including Maeve's small
dashboard portrait (a localized eye overlay preserves the rest of the map).

## Full-body animal characters

`characters.js` defines one transparent full-body sprite each for Fizzbert and
Professor Wobblehorn. The dashboard, lab and flying celebration all reuse the
same sprites. Fizzbert has feathery external gills, four feet and a long finned
tail. Wobblehorn has a golden horn, goofy grin, crooked glasses, floppy wizard
hat and four hooves. Both use playful expressions and poses.

The flight renders the animals without picture frames, cards or rectangular
backgrounds. Existing rainbow flight, cleanup and reduced-motion behavior remain.
`island-portraits.js` clears only the original mascot regions with a clipped
sky background plate, then draws the shared animal sprites above it. Map labels,
tap targets and navigation are preserved. `assets/island-map.png` remains the
original map and is unchanged outside the displayed localized corrections.

## Validation

With the static server running:

- `python3 tests/characters_smoke.py`
- `python3 tests/maeve_eyes_smoke.py`
- `python3 tests/wardrobe_smoke.py`

Tests require Python Playwright, Pillow and Chromium at `/usr/bin/chromium`,
provided by the cloud environment. Browser/socket execution may require tool
sandbox permission. Tests use disposable browser contexts, never personal game
progress. Coverage includes sprite consistency and transparency, frameless flight
movement and cleanup, reduced motion, brown eyes, all wardrobe options,
reward gating/purchase, save/reload, preservation of non-outfit progress,
touch targets, all 11 navigation destinations, and responsive layouts.
Real iPhone Safari and Samsung hardware testing remains a manual review step.
No production deployment or merge is part of this change.

## Cottage interior

`cottage.js` and `cottage.css` render a furnished illustrated cottage with timber
beams, a patchwork bed, fireplace, kitchen, garden window and bookshelves.
Owned beanbag, moon lamp and aquarium decorations appear as illustrated objects
at fixed positions in the room. Their scene controls and inventory buttons use
the existing ownership, placement, toggle and save logic. Decorations can be
added or put away with touch or keyboard; no new purchases or progression rules
are introduced. Existing room colors become pink, ocean and sunset lighting.

`python3 tests/cottage_smoke.py` checks furnished/empty-inventory rendering,
existing owned placement, touch targets, adding/removing decorations, visible
theme changes, save/reload, unchanged unrelated progress, navigation and a new
shop purchase across phone, tablet and desktop sizes. Placement is fixed; this
change does not introduce dragging or a furniture editor.

## Wobbleworks laboratory

`wobbleworks.js` and `wobbleworks.css` render a furnished magical laboratory with
bubbling flasks, copper pipes, glass coils, colorful smoke and a rainbow machine.
The same full-body character sprites stand inside the scene. The existing
experiment button now triggers a brief cartoon cloud/star burst and the existing
animal flight. The button pauses for two seconds to prevent stacked bursts and
then becomes available again. Status text announces the experiment; no stars,
rewards, routines or saved progress change. Reduced-motion mode uses static
smoke/burst feedback and retains the readable status without flying animals.

Run `python3 tests/wobbleworks_smoke.py` to check the scene, image loading,
phone/tablet/desktop layouts, smoke, button touch size, temporary effects,
repeated and keyboard activation, cleanup, navigation during effects, unchanged
saves and reduced-motion behavior.
