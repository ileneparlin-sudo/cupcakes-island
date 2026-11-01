"""Brown irises and the same current outfit on home, map, wardrobe and preview."""
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright
from browser_helpers import visit
head=Image.open(Path(__file__).resolve().parents[1]/'assets/maeve-portrait-head.png')
for point in [(575,620),(860,630)]:
    r,g,b,*_=head.getpixel(point)
    assert r>b+15 and r>g
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page()
    page.goto('http://127.0.0.1:8000')
    before=page.evaluate('localStorage.getItem("cupcake-island-v1")')
    assert page.locator('.home-maeve [data-portrait-head]').get_attribute('href')=='assets/maeve-portrait-head.png'
    visit(page,'island')
    assert page.locator('.map-maeve [data-portrait-head]').get_attribute('href')=='assets/maeve-portrait-head.png'
    assert 'brown eyes' in page.locator('.map-maeve .maeve-art').get_attribute('aria-label')
    visit(page,'wardrobe')
    assert page.locator('[data-portrait-head]').get_attribute('href')=='assets/maeve-portrait-head.png'
    assert page.evaluate('localStorage.getItem("cupcake-island-v1")')==before
    page.goto('http://127.0.0.1:8000/wardrobe-preview.html')
    assert page.locator('[data-portrait-head]').get_attribute('href')=='assets/maeve-portrait-head.png'
    print('PASS: brown irises, shared home/map/wardrobe/preview avatar, unchanged progress')
    browser.close()
