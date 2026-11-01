def visit(page, route):
    nav={'home':'Home','island':'Explore Island','day':'My Day','wardrobe':'Dress Up','mama':'Mama Mode 🔒'}
    if route in nav:
        page.locator('#nav').get_by_role('button',name=nav[route],exact=True).click()
    else:
        page.get_by_role('combobox',name='Visit another place').select_option(route)
