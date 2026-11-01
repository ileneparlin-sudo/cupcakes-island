"""Verify transparent full-body animals are shared across dashboard, lab and flight."""
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
for name in ['fizzbert', 'wobblehorn']:
    image = Image.open(root / f'assets/{name}-sprite.png')
    assert image.mode == 'RGBA'
    for point in [(0, 0), (image.width-1, 0), (0, image.height-1), (image.width-1, image.height-1)]:
        assert image.getpixel(point)[3] == 0, (name, point, 'opaque rectangle')

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(390, 844), (800, 1280)]:
        context = browser.new_context(viewport={'width':width, 'height':height}, has_touch=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto('http://127.0.0.1:8000')
        sources = {name:page.locator(f'.dashboard-mascot [data-character="{name}"]').get_attribute('src') for name in ['fizzbert', 'wobblehorn']}
        before = page.evaluate('localStorage.getItem("cupcake-island-v1")')
        page.get_by_role('button', name='🔎 Explore close up', exact=True).tap()
        assert page.locator('.mapScroll.is-zoomed').count() == 1
        assert page.locator('.dashboard-mascot').count() == 2
        page.get_by_role('button', name='Visit The Wobbleworks', exact=True).tap()
        for character, source in sources.items():
            animal = page.locator(f'.labDuo [data-character="{character}"]')
            assert animal.count() == 1
            assert animal.get_attribute('src') == source
            assert animal.evaluate('async image => {await image.decode(); return image.naturalWidth > 0;}')
        page.get_by_role('button', name='🌈 Try the rainbow experiment', exact=True).tap()
        for character, source in sources.items():
            animal = page.locator(f'.celebration [data-character="{character}"]')
            assert animal.count() == 1
            assert animal.get_attribute('src') == source
            assert animal.evaluate('e => {const s=getComputedStyle(e);return s.borderTopWidth==="0px" && s.backgroundColor==="rgba(0, 0, 0, 0)" && s.boxShadow==="none";}')
        start = page.locator('.flightGroup').bounding_box()['x']
        page.wait_for_timeout(400)
        assert page.locator('.flightGroup').bounding_box()['x'] != start
        assert page.evaluate('localStorage.getItem("cupcake-island-v1")') == before
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.wait_for_timeout(4200)
        assert page.locator('.celebration').count() == 0
        page.get_by_role('button', name='🏝️ Island', exact=True).tap()
        assert page.locator('.mapArtwork').count() == 1
        assert not errors, errors
        context.close()
        print(f'PASS {width}x{height}: shared full-body sprites, transparent assets, no frames, flight movement, map zoom, unchanged saves, cleanup')
    context=browser.new_context(reduced_motion='reduce')
    page=context.new_page()
    page.goto('http://127.0.0.1:8000')
    page.evaluate("celebrate('Reduced motion check')")
    assert page.locator('.flightGroup').evaluate('e=>getComputedStyle(e).display') == 'none'
    print('PASS: reduced-motion preference hides moving animals')
    browser.close()
