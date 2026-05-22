import os
from bs4 import BeautifulSoup

def process_html_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    # 1. Add FontAwesome for icons if not present
    head = soup.find('head')
    if head and not soup.find('link', href=lambda x: x and 'font-awesome' in x.lower()):
        fa_link = soup.new_tag('link', rel='stylesheet', href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css')
        head.append(fa_link)

    # 2. Update Desktop Menu
    # Find all "a" tags in nav
    for a in soup.find_all('a'):
        text = a.get_text(strip=True).lower()
        if 'inicio' in text:
            a['href'] = 'index.html'
        elif text == 'catálogo' or text == 'catalogo':
            a['href'] = 'catalogo-categoria.html'
        elif 'promocional' in text:
            a['href'] = 'https://www.catalogospromocionales.com/seccion/inicio.html'
            a['target'] = '_blank'
        elif 'cotizador' in text or 'cotizar' in text:
            a['href'] = 'https://wa.me/573123738974'

    # Update buttons that say "Catálogo Promocional"
    for btn in soup.find_all(['button', 'a']):
        text = btn.get_text(strip=True).lower()
        if 'promocional' in text and btn.name == 'button':
            # convert button to a tag
            btn.name = 'a'
            btn['href'] = 'https://www.catalogospromocionales.com/seccion/inicio.html'
            btn['target'] = '_blank'
            # fix button layout if needed by adding inline-block
            btn['class'] = btn.get('class', []) + ['inline-block']

    # Update whatsapp buttons
    for btn in soup.find_all(['button', 'a']):
        text = btn.get_text(strip=True).lower()
        if '+57 3123738974' in text or '+573123738974' in text:
            if btn.name == 'button':
                btn.name = 'a'
                btn['href'] = 'https://wa.me/573123738974'
                btn['target'] = '_blank'
                btn['class'] = btn.get('class', []) + ['inline-block']

    # 3. Update Footer Icons
    # It has material icons for facebook, photo_camera, video_library
    footer = soup.find('footer')
    if footer:
        # update contacto link
        for a in footer.find_all('a'):
            if a.get_text(strip=True).lower() == 'contacto':
                a['href'] = 'https://wa.me/573123738974'
                a['target'] = '_blank'
        
        # update social icons
        # The icons are wrapped in a div with gap-6
        icon_divs = footer.find_all('div', class_=lambda c: c and 'gap-6' in c)
        for icon_div in icon_divs:
            # We clear it and put our FA icons
            icon_div.clear()
            
            fb = soup.new_tag('a', href='#', **{'class': 'text-white/50 hover:text-white transition-colors text-2xl'})
            fb_icon = soup.new_tag('i', **{'class': 'fab fa-facebook'})
            fb.append(fb_icon)
            
            ig = soup.new_tag('a', href='#', **{'class': 'text-white/50 hover:text-white transition-colors text-2xl'})
            ig_icon = soup.new_tag('i', **{'class': 'fab fa-instagram'})
            ig.append(ig_icon)
            
            tk = soup.new_tag('a', href='#', **{'class': 'text-white/50 hover:text-white transition-colors text-2xl'})
            tk_icon = soup.new_tag('i', **{'class': 'fab fa-tiktok'})
            tk.append(tk_icon)
            
            icon_div.append(fb)
            icon_div.append(ig)
            icon_div.append(tk)

    # Convert to string
    new_html = str(soup)

    # 4. Make it scrollable everywhere (overflow-x-hidden instead of any possible overflow-hidden)
    # The prompt says "que se puede hacer scroll en todas las paginas"
    # Often, Tailwind pages might have h-screen overflow-hidden. We will remove them if they exist on body or main.
    body = soup.find('body')
    if body and body.get('class'):
        classes = body['class']
        if 'overflow-hidden' in classes:
            classes.remove('overflow-hidden')
        if 'h-screen' in classes:
            classes.remove('h-screen')
        body['class'] = classes

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))

directory = 'c:/Users/milan/Music/ves'
for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        process_html_file(filepath)
        print(f"Processed {filename}")
