const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

const pageMap = {
    'uniformes empresariales': 'uniformes-empresariales.html',
    'uniformes escolares': 'uniformes-escolares.html',
    'antifluidos': 'antifluidos.html',
    'area industrial': 'area-industrial.html',
    'uniformes deportivos': 'uniformes-deportivos.html',
    'bordados y estampados': 'bordados-estampados.html',
    'articulos merchandising': 'articulos-merchandising.html',
    'artículos merchandising': 'articulos-merchandising.html'
};

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // FontAwesome
    if (!content.includes('font-awesome')) {
        $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
    }

    // Unlink "Colección 2026"
    $('*').each((i, el) => {
        if ($(el).children().length === 0) {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'colección 2026' || text === 'coleccion 2026') {
                if ($(el).parent()[0] && $(el).parent()[0].tagName === 'a') {
                    const p = $(el).parent();
                    p.replaceWith($(el));
                }
            }
        }
    });

    // Menus
    $('a').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        // Desktop / Generic
        if (text === 'inicio') $(el).attr('href', 'index.html');
        // Mobile specific because it has spans inside
        if (text.includes('inicio') && text.includes('home')) $(el).attr('href', 'index.html');
        if (text.includes('catálogo') && text.includes('grid_view')) $(el).attr('href', 'catalogo-categoria.html');
        if (text.includes('cotizador')) {
            $(el).attr('href', 'https://wa.me/573123738974');
            $(el).attr('target', '_blank');
        }
        if (text === 'contacto') {
            $(el).attr('href', 'https://wa.me/573123738974');
            $(el).attr('target', '_blank');
        }
    });

    // Dropdown for "Catálogo" in Desktop menu
    $('.hidden.md\\:flex.gap-8.items-center > a').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text === 'catálogo' || text === 'catalogo' || text === 'catã¡logo') {
            if ($(el).parent().hasClass('group') && $(el).parent().hasClass('relative')) return;
            const classes = $(el).attr('class') || '';
            const dropdownHtml = `
            <div class="relative group z-50">
                <a class="${classes} cursor-pointer" href="catalogo-categoria.html">Catálogo</a>
                <div class="absolute left-0 mt-2 w-64 bg-[#f8f9fa] dark:bg-[#171e36] rounded-md shadow-[0_12px_32px_rgba(25,28,29,0.12)] py-2 hidden group-hover:block transition-all border border-[#c4c6cf]/20">
                    <a href="uniformes-empresariales.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Uniformes empresariales</a>
                    <a href="uniformes-escolares.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Uniformes escolares</a>
                    <a href="antifluidos.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Antifluidos</a>
                    <a href="area-industrial.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Area Industrial</a>
                    <a href="uniformes-deportivos.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Uniformes deportivos</a>
                    <a href="bordados-estampados.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Bordados y estampados</a>
                    <a href="articulos-merchandising.html" class="block px-4 py-2 text-sm text-[#5c6570] hover:text-[#2180ff] hover:bg-[#dae3f0] font-manrope font-bold tracking-tighter">Artículos merchandising</a>
                </div>
            </div>`;
            $(el).replaceWith(dropdownHtml);
        }
    });

    // Explorar Catálogo and Catálogo Promocional Buttons
    $('button, a').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        
        if (text === 'explorar catálogo' || text === 'explorar catalogo') {
            el.tagName = 'a';
            $(el).attr('href', 'catalogo-categoria.html');
            let cls = $(el).attr('class') || '';
            if (!cls.includes('inline-block') && !cls.includes('flex')) {
                $(el).attr('class', cls + ' inline-block text-center');
            }
        }
        
        if (text.includes('promocional') && !text.includes('explorar')) {
            el.tagName = 'a';
            $(el).attr('href', 'https://www.catalogospromocionales.com/seccion/inicio.html');
            $(el).attr('target', '_blank');
            let cls = $(el).attr('class') || '';
            if (!cls.includes('inline-block') && !cls.includes('flex')) {
                $(el).attr('class', cls + ' inline-block text-center');
            }
        }

        if (text.includes('+57 3123738974') || text.includes('+573123738974') || text === 'contacto') {
            if (el.tagName !== 'a') el.tagName = 'a';
            $(el).attr('href', 'https://wa.me/573123738974');
            $(el).attr('target', '_blank');
            let cls = $(el).attr('class') || '';
            if (!cls.includes('inline-block') && !cls.includes('flex') && text.includes('3123738974')) {
                $(el).attr('class', cls + ' inline-block text-center');
            }
        }
    });

    // Grid Links inside Index & Catalogo-Categoria
    $('.bg-surface-container-lowest.rounded-xl.p-8').each((i, el) => {
        const h3 = $(el).find('h3').first();
        if (h3.length) {
            const catName = h3.text().trim().toLowerCase();
            let link = null;
            for (const [key, value] of Object.entries(pageMap)) {
                if (catName.includes(key) || key.includes(catName)) {
                    link = value;
                    break;
                }
            }
            if (link) {
                el.tagName = 'a';
                $(el).attr('href', link);
                let cls = $(el).attr('class') || '';
                if (!cls.includes('block')) {
                    $(el).attr('class', cls + ' block cursor-pointer');
                }
            }
        }
    });

    // Articulos banner
    $('.bg-primary-container.text-white.rounded-xl.p-8').each((i, el) => {
        const h3 = $(el).find('h3').first();
        if (h3.length) {
            const catName = h3.text().trim().toLowerCase();
            if (catName.includes('merchandising')) {
                const btn = $(el).find('button, a');
                if (btn.length) {
                    btn[0].tagName = 'a';
                    btn.attr('href', 'articulos-merchandising.html');
                }
            }
        }
    });

    // Footer Social Icons
    const footer = $('footer');
    if (footer.length) {
        // Find existing material icons for social and replace
        footer.find('a').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'facebook') {
                $(el).html('<i class="fab fa-facebook"></i>');
                $(el).attr('class', 'text-white/50 hover:text-white cursor-pointer transition-colors text-2xl');
            } else if (text === 'photo_camera') {
                $(el).html('<i class="fab fa-instagram"></i>');
                $(el).attr('class', 'text-white/50 hover:text-white cursor-pointer transition-colors text-2xl');
            } else if (text === 'video_library') {
                $(el).html('<i class="fab fa-tiktok"></i>');
                $(el).attr('class', 'text-white/50 hover:text-white cursor-pointer transition-colors text-2xl');
            }
        });
    }

    // Scroll everywhere fix
    $('body, main').each((i, el) => {
        let cls = $(el).attr('class');
        if (cls) {
            cls = cls.replace(/overflow-hidden/g, '').replace(/h-screen/g, '').replace(/\s+/g, ' ');
            $(el).attr('class', cls);
        }
    });

    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log("Updated", file);
});
