# Adventure foundation: first tested milestone

## Audit and priority

The prototype has working illustrated destinations, layered clothing, a Star
Shop, cottage decorations, lab effects, and local browser saves. Its monolithic
HTML contains successive renderer overrides, duplicated quest/routine reward
handlers, index-based routine completions, competing navigation systems, and a
map with a baked-in balance and avatar. Mama Mode's PIN is plaintext local data.
Fishing is currently a randomized result; routine editing and richer minigames
are not implemented. Large artwork is served as external assets; the new boutique
uses lossless WebP with pixel-identical verification against the generated source.

1. **This milestone:** focused home/navigation, consistent daily rewards and
   migration, help/postponement, Gentle Day, and the approved layered character
   in Twinkle Threads and throughout the home/map.
2. **Parent tools:** stable-ID routine editing/reordering, schedules, difficulty,
   configurable rewards and extra chores, clearer summaries and allowance records.
3. **Play:** ingredient/prediction lab minigame, fishing collection and clear
   stopping points, optional woodland discoveries and Dream Garden progression.
4. **Polish:** character lab-coat/pink-axolotl variants from the newer design brief,
   further asset optimization, real-device Safari/Android testing, and sound that
   is optional and muted by default. No sound is currently played.

## What changed

`adventure-model.js` owns stable routine keys and `support.adventures` version 1.
The original `cupcake-island-v1` key remains. Existing Stars, outfits, collections,
allowance data, keys, reading counts, bedtime practice and unknown fields remain.
Today's `support.done`, legacy `completed`, and completed homework are imported
without granting or subtracting Stars. A pre-migration raw-save backup is saved
as `cupcake-island-v1-before-adventures-v1` when storage permits. Malformed or
unreadable records are left untouched and the session reports read-only saving.
A future routine-schema version also opens read-only rather than overwriting it.

Each unique routine step earns 5 Stars once per local calendar day. Both reading
entry points share one key/reward. Assignment effort shares the daily schoolwork
reward, including multiple assignments. Legacy quest reward handlers now route
to the canonical adventure instead of adding a second reward. Ordinary routines
never add allowance money. No historical balance is recalculated.

Numeric legacy routine positions map to explicit stable keys. Existing positions
were preserved; the after-school emotional check-in is appended. A future editor
must store/reorder stable IDs, never change the legacy mapping. Completed-homework
migration happens once, not on every subsequent day. Rollover is checked on
render and on completion. Reading/key counters increment only for a new claim.

Every step has completion, useful task-specific help, and a penalty-free later
option. Deferred steps are skipped by the home suggestion, but remain available
in My Day. Completion clears postponement. Gentle Day filters optional steps
without deleting completion or earned Stars. Own-bed practice is optional and
rewards an attempt, never falling asleep or staying asleep. Family comfort time
is preserved. The next suggestion uses the device's local time; editable parent
schedules are a later milestone.

`adventure-ui.js` connects the model to the existing application. A failed
routine write restores the in-memory balance/progress and displays an error.
The welcoming home shows one next step, progress, unrestricted island access,
Dress Up and Stars. The sidebar has four main destinations, one place selector
and a separate Mama Mode button. Secondary screens have Back to Island. The map
fits initially, retains optional zoom, and has seven building targets plus My Day with 44px
minimum sizes. The decorative painted-in bottom navigation is cropped from view. Duplicate quick links, legacy quest entries and development
floating controls are removed from the child interface. Selection is reflected
by the destination heading and a live route announcement.

Home, map portrait and wardrobe all render the same current layered avatar with
brown eyes. Stars in the map are live rather than the baked-in illustration.
Twinkle Threads has an illustrated boutique, blue/pink bows, star clips and
owned pink cat-ear headphones. Existing accessory IDs and reward ownership remain
compatible. The isolated `wardrobe-preview.html` uses the same component/artwork
and never accesses personal progress.

## Persistence and parent security limitations

LocalStorage is local to one browser profile and one origin; Netlify previews,
production, other devices and private browsing have separate progress. This is
not cross-device sync, secure authentication, or a multi-user transactional
backend. Avoid simultaneously changing progress from multiple tabs: the ledger
prevents repeat rewards within the tested single-session/reload flows, but
localStorage cannot provide an atomic cross-tab transaction.

The four-digit PIN only discourages accidental entry. It is readable/resettable
through browser tools and can be bypassed locally. The UI says this explicitly;
leaving Mama Mode now relocks it. Use a separate authenticated parent account
before adding private data, remote administration or payments.

Recommended future sync: authenticated parent accounts with child profiles,
a server-owned reward ledger with a unique (child, local-day, task-ID) constraint,
transactional balance updates, explicit parent authorization, and an offline queue
with idempotency keys and conflict handling. Never use a browser PIN or public
API key as server authentication. No backend, external transaction, automatic
purchase, production deployment or Netlify setting change is included here.

## Review and validation

This branch is based on `feature/maeve-wardrobe`, preserving the reviewed cottage,
characters and lab work. Review this as a stacked PR against that branch to see
only this milestone; nothing is merged into main. If the earlier PR merges, the
base can be changed after reconciling the branch history.

With `python3 -m http.server 8000` running in the checkout:

- `node tests/adventure-model.test.cjs`
- `python3 tests/adventure_smoke.py`
- Existing wardrobe, character, brown-eye, cottage and lab browser smoke scripts.

Tests use Chromium with touch viewports, disposable saves and injected failures.
Real iPhone Safari/Samsung hardware tests remain manual. Existing older renderers
remain behind the integration layer; extracting a single route registry and
removing unused legacy UI code is a follow-up architectural improvement.

Validated in this milestone: model migration/idempotency/day-rollover assertions;
acceptance flows at 360×800, 390×844, 800×1280 and 1280×900; failed-write rollback;
malformed/future-save preservation; non-overlapping map targets; parent relocking;
and the existing wardrobe, cottage, lab, brown-eye and full-body character tests.
A fresh Home request was also checked to avoid downloading the island map before
exploration. Sound remains absent/muted. No production settings were touched.

## Big-number Home dashboard

`dashboard.js` and `dashboard.css` render the approved dashboard concept with
live saved values instead of mock numbers. Little wins today counts unique true
claims in the daily routine ledger, including supported completion. Help and
postponement do not award a win. The counter does not shrink when Gentle Day hides
optional steps. Stars shows the current spendable balance, and Treasures counts
unique owned cosmetic/decor IDs, including starting clothes. Buying an item can
reduce Stars and increase Treasures; daily rollover resets only today's wins,
never earned currency or owned items.

Home shows one next adventure and an illustrated Explore Island entrance, with
Dress Up and My Day shortcuts. It does not display an overall unfinished-task
total, streaks, penalties or comparisons. The decorative island preview is an
external compressed WebP (~560 KB); the full interactive map still loads only
when exploration is opened. The preview illustration is decorative; its button
opens the actual interactive map.

`python3 tests/dashboard_smoke.py` checks real initial values, help/postponement,
reading deduplication, Gentle Day, purchases, duplicate inventory IDs, reload,
links, daily reset without lost Stars/treasures, and large-number page overflow
at 360×800, 390×844, 800×1280 and 1280×900. The adventure acceptance, wardrobe and
model regression checks also passed after this update. Real-device testing
remains manual.
