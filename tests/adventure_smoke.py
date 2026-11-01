"""Milestone acceptance: navigation, migration, routines and customization."""
from playwright.sync_api import sync_playwright
from browser_helpers import visit
KEY='cupcake-island-v1'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for width,height in [(360,800),(390,844),(800,1280),(1280,900)]:
        context=browser.new_context(viewport={'width':width,'height':height},has_touch=True)
        page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto('http://127.0.0.1:8000')
        assert page.get_by_role('heading',name='Hi, Maeve!',exact=True).is_visible()
        assert page.locator('.next-adventure').count()==1
        assert page.locator('#nav button').count()==5
        before=page.evaluate('data.stars')
        visit(page,'island')
        assert page.locator('.mapHotspot').count()==8
        boxes=page.locator('.mapHotspot').evaluate_all('els=>els.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})')
        for box in boxes:assert box['w']>=44 and box['h']>=44
        for i,a in enumerate(boxes):
            for b in boxes[i+1:]:
                overlap_x=min(a['x']+a['w'],b['x']+b['w'])-max(a['x'],b['x'])
                overlap_y=min(a['y']+a['h'],b['y']+b['h'])-max(a['y'],b['y'])
                assert overlap_x<=0 or overlap_y<=0,'overlapping map targets'
        assert str(before) in page.locator('.map-live-stars').text_content()
        page.get_by_role('button',name='Visit Twinkle Threads',exact=True).tap()
        page.locator('[data-outfit-value="pinkbow"]').tap()
        page.locator('[data-outfit-key="top"][data-outfit-value="mint"]').tap()
        outfit=page.locator('.maeve-art').inner_html()
        visit(page,'home');assert page.locator('.home-maeve .maeve-art').inner_html()==outfit
        visit(page,'island');assert page.locator('.map-maeve .maeve-art').inner_html()==outfit
        visit(page,'day')
        page.get_by_role('button',name='Morning Adventure',exact=False).click()
        step=page.locator('[data-step="morning:dress"]')
        step.get_by_text('I need help',exact=True).click()
        assert step.locator('.step-help li').count()==2
        assert page.evaluate('data.stars')==before
        step.get_by_role('button',name='Try later',exact=True).tap()
        assert 'Saved for later' in step.inner_text()
        assert page.evaluate('data.stars')==before
        step.get_by_role('button',name='I did it!',exact=True).tap()
        assert page.evaluate('data.stars')==before+5
        page.evaluate("completeStep('morning',0);completeStep('morning',0);complete('morning')")
        assert page.evaluate('data.stars')==before+5
        page.evaluate("openRoutine('learning')")
        page.locator('[data-step="reading"]').get_by_role('button',name='I did it!',exact=True).tap()
        assert page.evaluate('data.stars')==before+10
        page.evaluate("openRoutine('evening');completeStep('evening',3)")
        assert page.evaluate('data.stars')==before+10
        page.evaluate("sup.homework=[{name:'One worksheet',done:false},{name:'Second worksheet',done:false}];save();go('learning')")
        page.get_by_role('button',name='I worked on it!',exact=True).first.tap()
        page.get_by_role('button',name='I worked on it!',exact=True).last.tap()
        page.evaluate("completeStep('learning',2)")
        assert page.evaluate('data.stars')==before+15
        visit(page,'day');page.get_by_role('button',name='Make today gentler',exact=True).tap()
        page.get_by_role('button',name='Evening Adventure',exact=False).tap()
        assert page.locator('.adventure-step').count()==4
        assert page.locator('[data-step="evening:settle"]').count()==0
        assert page.evaluate('data.stars')==before+15
        page.reload()
        assert page.evaluate('data.stars')==before+15
        assert page.evaluate('data.accessory')=='pinkbow'
        assert page.evaluate('sup.hard') is True
        visit(page,'mama');assert page.locator('#mamaPin').is_visible()
        page.locator('#mamaPin').fill('1234');page.get_by_role('button',name='Set PIN',exact=True).tap()
        assert 'not secure authentication' in page.locator('.parent-security-note').inner_text()
        visit(page,'home');visit(page,'mama');assert page.locator('#mamaPin').is_visible()
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors,errors
        print(f'PASS {width}x{height}: home, map, outfit consistency, per-step help/later, no duplicate rewards, Gentle Day, reload, parent relock')
        context.close()
    # Actual legacy-save import, byte-exact backup, and no repeated migration awards.
    context=browser.new_context();page=context.new_page();page.goto('http://127.0.0.1:8000')
    legacy=page.evaluate('JSON.parse(localStorage.getItem("cupcake-island-v1"))')
    legacy['stars']=777;legacy['completed']=['reading','morning'];legacy['placed']=['lamp'];legacy['owned']+=['lamp']
    legacy['support'].pop('adventures',None);legacy['support']['done']={'evening:1':True};legacy['customProgress']={'keep':True}
    raw=page.evaluate('s=>{const raw=JSON.stringify(s);localStorage.setItem("cupcake-island-v1",raw);return raw}',legacy)
    page.reload()
    assert page.evaluate('data.stars')==777
    assert page.evaluate('data.customProgress.keep') is True
    assert page.evaluate('data.placed')==['lamp']
    assert page.evaluate('localStorage.getItem("cupcake-island-v1-before-adventures-v1")')==raw
    page.evaluate("completeStep('learning',0);completeStep('morning',4);completeStep('evening',1)")
    assert page.evaluate('data.stars')==777
    page.reload();assert page.evaluate('data.stars')==777
    print('PASS: legacy balances, progress, decorations and completions preserved; byte-exact backup; idempotent migration')
    # Storage failure rolls back a routine reward instead of claiming it saved.
    page.evaluate("() => {openRoutine('learning');Storage.prototype.setItem=function(){throw new Error('blocked')}}")
    page.locator('[data-step="learning:math"]').get_by_role('button',name='I did it!',exact=True).click()
    assert page.evaluate('data.stars')==777
    assert page.get_by_role('alert').is_visible()
    print('PASS: failed save rolls back reward and shows a readable error')
    context.close()
    context=browser.new_context();page=context.new_page();page.goto('http://127.0.0.1:8000')
    page.evaluate("localStorage.setItem('cupcake-island-v1','{broken save')")
    page.reload()
    assert page.evaluate("localStorage.getItem('cupcake-island-v1')")=='{broken save'
    assert page.get_by_role('alert').is_visible()
    print('PASS: unreadable save is never overwritten')
    context.close()
    context=browser.new_context();page=context.new_page();page.goto('http://127.0.0.1:8000')
    raw=page.evaluate('''() => {const s=JSON.parse(localStorage.getItem("cupcake-island-v1"));s.support.adventures.version=99;const raw=JSON.stringify(s);localStorage.setItem("cupcake-island-v1",raw);return raw;}''')
    page.reload()
    assert page.evaluate('localStorage.getItem("cupcake-island-v1")')==raw
    assert 'newer routine version' in page.get_by_role('alert').inner_text()
    print('PASS: future save version opens read-only without overwriting progress')
    browser.close()
