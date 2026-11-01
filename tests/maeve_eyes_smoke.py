"""Verify rendered dashboard eyes and the shared wardrobe sprite are brown."""
from io import BytesIO
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

def brown(pixel):
    r, g, b = pixel[:3]
    return r > b + 15 and r > g

head = Image.open(Path(__file__).resolve().parents[1] / 'assets/maeve-portrait-head.png')
assert brown(head.getpixel((575, 620))) and brown(head.getpixel((860, 630)))
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':1700, 'height':1200})
    page.goto('http://127.0.0.1:8000')
    saved = page.evaluate('localStorage.getItem("cupcake-island-v1")')
    assert page.locator('.maeve-map-eyes').count() == 1
    page.evaluate('''async () => {const image=new Image();image.src=document.querySelector('.maeve-map-eyes image').getAttribute('href');await image.decode();}''')
    page.locator('.mapStage').evaluate("e=>{e.style.width='1536px';e.style.minWidth='1536px'}")
    screenshot = Image.open(BytesIO(page.locator('.mapStage').screenshot()))
    assert brown(screenshot.getpixel((96, 89))) and brown(screenshot.getpixel((124, 89)))
    page.get_by_role('button', name='👗 Wardrobe', exact=True).click()
    assert 'brown eyes' in page.locator('.maeve-art').get_attribute('aria-label')
    assert page.locator('[data-portrait-head]').get_attribute('href') == 'assets/maeve-portrait-head.png'
    assert page.evaluate('localStorage.getItem("cupcake-island-v1")') == saved
    page.goto('http://127.0.0.1:8000/wardrobe-preview.html')
    assert page.locator('[data-portrait-head]').get_attribute('href') == 'assets/maeve-portrait-head.png'
    print('PASS: brown irises in rendered dashboard, shared wardrobe and preview asset, unchanged progress')
    browser.close()
