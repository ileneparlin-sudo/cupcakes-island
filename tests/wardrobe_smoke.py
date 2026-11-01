from browser_helpers import visit
"""Run with the static server on port 8000: python3 tests/wardrobe_smoke.py."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8000'
KEY = 'cupcake-island-v1'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    for width, height in [(390, 844), (360, 800), (800, 1280), (1280, 800)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=True)
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(URL)
        visit(page,'island')
        portrait = page.locator('.dashboard-mascot [data-character="wobblehorn"]')
        assert portrait.count() == 1
        assert portrait.evaluate("async image => {await image.decode(); return image.naturalWidth > 0;}")
        assert portrait.evaluate("e => getComputedStyle(e).pointerEvents") == 'none'
        page.get_by_role('button', name='Visit The Wobbleworks', exact=True).tap()
        assert 'Wobbleworks' in page.locator('#main').inner_text()
        visit(page,'island')
        seed = page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        seed.update(stars=243, completed=['morning'], owned=['purplehoodie', 'rainbow', 'starshoes', 'cathead', 'lamp'], placed=['lamp'], customProgress={'keep': True})
        page.evaluate('(s)=>localStorage.setItem("cupcake-island-v1", JSON.stringify(s))', seed)
        page.reload()
        baseline = page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        visit(page,'wardrobe')
        assert page.locator('.maeve-art').count() == 1
        assert page.locator('[data-portrait-head]').count() == 1
        assert page.evaluate("async () => {const image = new Image(); image.src = document.querySelector('[data-portrait-head]').getAttribute('href'); await image.decode(); return image.naturalWidth > 0;}")
        expected = {}
        for key in ['hair', 'top', 'bottom', 'shoes', 'accessory']:
            buttons = page.locator(f'[data-outfit-key="{key}"]')
            for i in range(buttons.count()):
                button = buttons.nth(i)
                value = button.get_attribute('data-outfit-value')
                box = button.bounding_box()
                assert box['height'] >= 44
                old = page.locator('.maeve-art').inner_html()
                was_selected = button.get_attribute('aria-pressed') == 'true'
                button.tap()
                assert button.get_attribute('aria-pressed') == 'true'
                if not was_selected:
                    assert old != page.locator('.maeve-art').inner_html(), (key, value)
                expected[key] = value
        saved = page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        assert {k:v for k,v in saved.items() if k not in expected} == {k:v for k,v in baseline.items() if k not in expected}
        page.reload()
        visit(page,'wardrobe')
        for key, value in expected.items():
            assert page.locator(f'[data-outfit-key="{key}"][data-outfit-value="{value}"]').get_attribute('aria-pressed') == 'true'
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        for route in ['home','island','day','wardrobe','room','learning','dream','pond','lab','rewards','mama']:
            visit(page,route)
            assert page.locator('#main').inner_text().strip()
        visit(page,'wardrobe')
        page.evaluate("() => {Storage.prototype.setItem=function(){throw new Error('Storage blocked')}}")
        page.locator('[data-outfit-key="top"][data-outfit-value="mint"]').tap()
        assert 'could not be saved' in page.get_by_role('status').inner_text()
        assert not errors, errors
        print(f'PASS {width}x{height}: all options, touch targets, save/reload, progress preservation, navigation, storage failure')
        context.close()
    # Locked rewards stay hidden; purchasing an existing reward exposes it.
    page = browser.new_page()
    page.goto(URL)
    visit(page,'island')
    visit(page,'wardrobe')
    assert page.locator('[data-outfit-value="rainbow"]').count() == 0
    page.get_by_role('button', name='Visit Star Shop 🎁', exact=True).click()
    page.locator('.item').filter(has_text='Rainbow Hoodie').get_by_role('button').click()
    visit(page,'wardrobe')
    assert page.locator('[data-outfit-value="rainbow"]').get_attribute('aria-pressed') == 'true'
    assert page.evaluate('data.stars') == 25
    print('PASS reward purchase: existing price, ownership and auto-equipped rainbow retained')
    page.screenshot(path='/tmp/maeve-wardrobe-desktop.png', full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    page.screenshot(path='/tmp/maeve-wardrobe-phone.png', full_page=True)
    browser.close()
