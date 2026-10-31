Maeve’s wardrobe now renders a detailed chibi character with brown eyes, wavy brown hair and pink streaks. Hoodies, skirts, sneakers and hair accessories update immediately and save through the existing game save, preserving routines, stars, rewards and other progress. Purchased rainbow hoodies, starry sneakers and cat-ear headphones appear only when owned.

Includes a standalone interactive preview using sample state, responsive touch controls, selected-state accessibility, and an explicit message when browser storage cannot save. Existing island navigation and reward prices remain intact.

Validation: `python3 tests/wardrobe_smoke.py`, `node --check wardrobe.js`, and `git diff --check`. Browser tests cover phone, tablet and desktop viewports, all outfit choices, save/reload, preservation of non-outfit data, all 11 navigation sections, reward purchases, and storage failure handling. Real iPhone Safari and Samsung hardware testing remains a manual review step.

No merge or production deployment authorized.
