from browser_helpers import visit
"""Verify the lab interior, temporary experiment effects and unchanged progress."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(360,800),(390,844),(800,1280),(1280,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://127.0.0.1:8000')
        visit(page,'island')
        before=page.evaluate('localStorage.getItem("cupcake-island-v1")')
        sources=page.evaluate('Object.fromEntries(Object.entries(CupcakeCharacters.sources).map(([k,v])=>[k,v.url]))')
        page.get_by_role('button',name='Visit The Wobbleworks',exact=True).tap()
        assert page.locator('.lab-interior').evaluate('async image=>{await image.decode();return image.naturalWidth>0}')
        for character,source in sources.items():
            assert page.locator(f'.labDuo [data-character="{character}"]').get_attribute('src')==source
        assert page.locator('.lab-smoke-puff').count()==9
        assert page.locator('.lab-smoke-puff').first.evaluate('e=>getComputedStyle(e).animationName')=='labSmokeRise'
        button=page.get_by_role('button',name='🌈 Try the rainbow experiment',exact=True)
        bounds=button.bounding_box()
        assert bounds['height']>=44 and bounds['width']>=44
        button.tap()
        assert button.is_disabled()
        assert page.locator('.wobbleworks-scene').get_attribute('data-experiment-state')=='running'
        assert page.locator('.lab-explosion').is_visible()
        assert 'POOMF' in page.get_by_role('status').inner_text()
        page.evaluate('Wobbleworks.runExperiment();Wobbleworks.runExperiment()')
        assert page.locator('.celebration').count()==1
        page.wait_for_timeout(2200)
        assert button.is_enabled()
        assert page.locator('.wobbleworks-scene').get_attribute('data-experiment-state')=='idle'
        assert page.locator('.lab-explosion').is_hidden()
        assert page.evaluate('localStorage.getItem("cupcake-island-v1")')==before
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        # Keyboard activation and navigation while a temporary effect is running.
        button.focus()
        page.keyboard.press('Enter')
        assert button.is_disabled()
        visit(page,'wardrobe')
        page.wait_for_timeout(2200)
        assert page.locator('.maeve-art').count()==1
        visit(page,'island')
        assert page.locator('.mapArtwork').is_visible()
        assert page.locator('#demoCelebration').is_hidden()
        assert not errors,errors
        context.close()
        print(f'PASS {width}x{height}: lab interior, shared animals, smoke, burst, cooldown, repeat/keyboard activation, navigation during effects, unchanged saves')
    context=browser.new_context(reduced_motion='reduce')
    page=context.new_page()
    page.goto('http://127.0.0.1:8000')
    visit(page,'island')
    page.get_by_role('button',name='Visit The Wobbleworks',exact=True).click()
    assert page.locator('.lab-smoke-puff').first.evaluate('e=>getComputedStyle(e).animationName')=='none'
    page.get_by_role('button',name='🌈 Try the rainbow experiment',exact=True).click()
    assert page.locator('.lab-burst-cloud').first.evaluate('e=>getComputedStyle(e).animationName')=='none'
    assert page.locator('.lab-burst-star').first.is_hidden()
    assert page.locator('.flightGroup').is_hidden()
    assert 'POOMF' in page.get_by_role('status').inner_text()
    print('PASS: reduced motion uses static smoke/burst and readable experiment status')
    browser.close()
