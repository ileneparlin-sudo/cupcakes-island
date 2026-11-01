"""Run with the local static server: python3 tests/cottage_smoke.py."""
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(390,844),(360,800),(800,1280),(1280,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://127.0.0.1:8000')
        page.get_by_role('button',name="Visit Maeve's Cottage",exact=True).tap()
        assert page.locator('.cottage-interior').evaluate('async image=>{await image.decode();return image.naturalWidth>0}')
        assert page.locator('.cottage-decoration').count()==0
        assert page.locator('.cottage-empty').is_visible()
        seed=page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        seed.update(stars=243,completed=['morning'],owned=['lamp','beanbag','fishbowl','rainbow'],placed=['lamp'],customProgress={'keep':True})
        page.evaluate('s=>localStorage.setItem("cupcake-island-v1",JSON.stringify(s))',seed)
        page.reload()
        before=page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        page.get_by_role('button',name='🏡 My Room',exact=True).tap()
        assert page.locator('[data-decoration="lamp"]').count()==1
        for item in ['beanbag','fishbowl']:
            page.locator(f'[data-inventory="{item}"]').tap()
            assert page.locator(f'[data-decoration="{item}"]').count()==1
            assert page.locator(f'[data-inventory="{item}"]').get_attribute('aria-pressed')=='true'
        ids=page.locator('.cottage-page [id]').evaluate_all('els=>els.map(e=>e.id)')
        assert len(ids)==len(set(ids))
        for button in page.locator('.cottage-decoration').all():
            bounds=button.bounding_box()
            assert bounds['width']>=44 and bounds['height']>=44
        page.locator('[data-decoration="lamp"]').tap()
        assert page.locator('[data-decoration="lamp"]').count()==0
        assert page.locator('[data-inventory="lamp"]').get_attribute('aria-pressed')=='false'
        last=None
        for theme in ['cozy','ocean','sunset']:
            page.locator(f'[data-room-theme="{theme}"]').tap()
            assert page.locator(f'.cottage-theme-{theme}').count()==1
            shot=page.locator('.cottage-scene').screenshot()
            if last:assert shot!=last
            last=shot
        after=page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
        assert {k:v for k,v in before.items() if k not in ['placed','room']}=={k:v for k,v in after.items() if k not in ['placed','room']}
        page.reload()
        page.get_by_role('button',name='🏡 My Room',exact=True).tap()
        assert page.locator('.cottage-theme-sunset').count()==1
        assert sorted(page.locator('.cottage-decoration').evaluate_all('els=>els.map(e=>e.dataset.decoration)'))==['beanbag','fishbowl']
        assert page.locator('#demoCelebration').is_hidden()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.get_by_role('button',name='Find more decorations 🎁',exact=True).tap()
        assert 'Star Shop' in page.locator('#main').inner_text()
        page.get_by_role('button',name='🏝️ Island',exact=True).tap()
        assert page.locator('.mapArtwork').is_visible()
        assert not errors,errors
        context.close()
        print(f'PASS {width}x{height}: interior, owned decorations, touch placement/removal, theme appearance, save/reload, preserved progress, navigation')
    page=browser.new_page()
    page.goto('http://127.0.0.1:8000')
    page.get_by_role('button',name='🏡 My Room',exact=True).click()
    assert page.locator('.cottage-treasure').count()==0
    page.get_by_role('button',name='Find more decorations 🎁',exact=True).click()
    page.locator('.item').filter(has_text='Heart Beanbag').get_by_role('button').click()
    page.get_by_role('button',name='🏡 My Room',exact=True).click()
    page.locator('[data-inventory="beanbag"]').click()
    assert page.locator('[data-decoration="beanbag"]').count()==1
    assert page.evaluate('data.stars')==35
    print('PASS: purchased decoration appears in cottage at unchanged shop price')
    browser.close()
