"""Live earned-progress dashboard: real values, purchases and day rollover."""
from playwright.sync_api import sync_playwright
from browser_helpers import visit
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(360,800),(390,844),(800,1280),(1280,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
        page=context.new_page();errors=[];requests=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('request',lambda r:requests.append(r.url))
        page.goto('http://127.0.0.1:8000')
        def number(stat):return int(page.locator(f'[data-home-stat="{stat}"]').inner_text().replace(',',''))
        assert number('wins')==0
        assert number('stars')==60
        assert number('treasures')==3
        assert 'fresh start' in page.locator('.dashboard-encouragement').inner_text()
        assert page.locator('.dashboard-home [role="progressbar"]').count()==0
        assert page.locator('.next-adventure').count()==1
        assert 'Little adventures.' in page.locator('.home-intro').inner_text()
        assert not any('/assets/island-map.png' in url for url in requests)
        assert page.locator('.dashboard-explore').evaluate('async e=>{const image=new Image();image.src=getComputedStyle(e).backgroundImage.slice(5,-2);await image.decode();return image.naturalWidth>0;}')
        page.locator('.dashboard-next .cta').tap()
        assert page.locator('.routine-adventure').count()==1
        page.locator('.step-actions details').first.get_by_text('I need help',exact=True).click()
        page.locator('.step-actions').first.get_by_role('button',name='Try later',exact=True).tap()
        visit(page,'home');assert number('wins')==0 and number('stars')==60
        page.evaluate("completeStep('morning',0)")
        visit(page,'home');assert number('wins')==1 and number('stars')==65
        page.evaluate("completeStep('learning',0);completeStep('evening',3);completeStep('learning',0)")
        visit(page,'home');assert number('wins')==2 and number('stars')==70
        visit(page,'day');page.get_by_role('button',name='Make today gentler',exact=True).tap()
        visit(page,'home');assert number('wins')==2 and number('stars')==70
        visit(page,'rewards')
        page.locator('.item').filter(has_text='Heart Beanbag').get_by_role('button').tap()
        visit(page,'home');assert number('stars')==45 and number('treasures')==4
        page.evaluate("data.owned.push(data.owned[0]);save();go('home')")
        assert number('treasures')==4
        page.reload();assert number('wins')==2 and number('stars')==45 and number('treasures')==4
        page.locator('.dashboard-explore').tap();assert page.locator('.mapArtwork').is_visible()
        visit(page,'home');page.locator('.dashboard-shortcuts').get_by_role('button',name='Dress Up',exact=False).tap()
        assert page.locator('.maeve-wardrobe').count()==1
        visit(page,'home');page.locator('.dashboard-shortcuts').get_by_role('button',name='My Day',exact=False).tap()
        assert page.locator('.adventure-day').count()==1
        page.evaluate("sup.day='1900-01-01';sup.adventures.day='1900-01-01';data.lastDay='1900-01-01';save();go('home')")
        assert number('wins')==0 and number('stars')==45 and number('treasures')==4
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.evaluate("data.stars=99999;save();go('home')")
        assert number('stars')==99999
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors,errors
        print(f'PASS {width}x{height}: live counts, no help/postpone rewards, reading deduplication, Gentle Day, purchases, unique inventory, reload, links, daily reset, large balance')
        context.close()
    browser.close()
