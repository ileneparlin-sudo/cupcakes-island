"""Verify dashboard character sources are reused in the lab and celebrations."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(390, 844), (800, 1280)]:
        context = browser.new_context(viewport={'width':width, 'height':height}, has_touch=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto('http://127.0.0.1:8000')
        fizz_source = page.locator('.mapArtwork').get_attribute('src')
        wobble_source = page.locator('.wobblehorn-map-portrait').get_attribute('src')
        before = page.evaluate('localStorage.getItem("cupcake-island-v1")')
        page.get_by_role('button', name='Visit The Wobbleworks', exact=True).tap()
        for character, source in [('fizzbert', fizz_source), ('wobblehorn', wobble_source)]:
            portrait = page.locator(f'.labDuo [data-character="{character}"]')
            assert portrait.count() == 1
            assert portrait.locator('image').get_attribute('href') == source
            assert page.evaluate('''async source => {const image = new Image(); image.src=source; await image.decode();return image.naturalWidth===1536 && image.naturalHeight===1024;}''', source)
        page.get_by_role('button', name='🌈 Try the rainbow experiment', exact=True).tap()
        for character, source in [('fizzbert', fizz_source), ('wobblehorn', wobble_source)]:
            portrait = page.locator(f'.celebration [data-character="{character}"]')
            assert portrait.count() == 1
            assert portrait.locator('image').get_attribute('href') == source
        assert page.evaluate('localStorage.getItem("cupcake-island-v1")') == before
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.wait_for_timeout(4400)
        assert page.locator('.celebration').count() == 0
        page.get_by_role('button', name='🏝️ Island', exact=True).tap()
        assert page.locator('.mapArtwork').count() == 1
        assert not errors, errors
        context.close()
        print(f'PASS {width}x{height}: exact dashboard sources in lab and celebration, image loading, navigation, unchanged save, animation cleanup')
    browser.close()
