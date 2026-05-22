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

const removeKeywords = [
    'explorar', 
    'ver detalles', 
    'ver todo', 
    'catálogo técnico', 
    'catalogo tecnico',
    'solicitar cotización', 
    'solicitar cotizacion',
    'catálogo completo',
    'catalogo completo'
];

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    if (file === 'catalogo-categoria.html') {
        // 1. Remove specific buttons by keyword
        $('button, a').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (removeKeywords.some(kw => text === kw || text.includes(kw))) {
                if ($(el).children().length <= 1) { 
                    $(el).remove();
                }
            }
        });

        // 2. Turn category cards into anchor tags
        $('.group.relative.overflow-hidden.rounded-xl').each((i, el) => {
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
    }

    if (file === 'articulos-merchandising.html') {
        $('*').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'solicitar muestra' || text.includes('solicitar muestra')) {
                if ($(el).children().length === 0 || $(el)[0].tagName === 'button' || $(el)[0].tagName === 'a') {
                    $(el).remove();
                }
            }
        });
    }

    // "Cotizar en linea" or "Cotizar esta línea"
    $('a, button').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes('cotizar en l') || text.includes('cotizar en linea') || text.includes('cotizar esta l')) {
            if (el.tagName !== 'a') el.tagName = 'a';
            $(el).attr('href', 'https://wa.me/573123738974');
            $(el).attr('target', '_blank');
            let cls = $(el).attr('class') || '';
            if (!cls.includes('inline-block') && !cls.includes('flex')) {
                $(el).attr('class', cls + ' inline-block text-center');
            }
        }
    });

    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log("Processed", file);
});
