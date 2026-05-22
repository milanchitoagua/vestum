const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // Remove background image in antifluidos.html
    if (file === 'antifluidos.html') {
        $('img').each((i, el) => {
            const alt = $(el).attr('alt') || '';
            if (alt.includes('A highly textural, macro photograph')) {
                // Remove the parent div
                $(el).parent().remove();
            }
        });

        // Update "Contactar Asesor" link
        $('button, a').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text.includes('contactar asesor')) {
                el.tagName = 'a';
                $(el).attr('href', 'https://wa.me/573123738974');
                $(el).attr('target', '_blank');
                let cls = $(el).attr('class') || '';
                if (!cls.includes('inline-block')) {
                    $(el).attr('class', cls + ' inline-block text-center');
                }
            }
        });
    }

    // Clean footers
    $('footer a').each((i, el) => {
        const text = $(el).text().trim().toLowerCase();
        if (text.includes('sostenibilidad') || text.includes('condiciones') || text.includes('términos') || text.includes('terminos')) {
            $(el).remove();
        }
    });

    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log("Updated", file);
});
