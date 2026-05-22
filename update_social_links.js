const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    let changed = false;

    $('footer a').each((i, el) => {
        const html = $(el).html() || '';
        if (html.includes('fa-facebook')) {
            $(el).attr('href', 'https://www.facebook.com/profile.php?id=61589275717030');
            $(el).attr('target', '_blank');
            changed = true;
        } else if (html.includes('fa-instagram')) {
            $(el).attr('href', 'https://www.instagram.com/vestumconfeccion/');
            $(el).attr('target', '_blank');
            changed = true;
        } else if (html.includes('fa-tiktok')) {
            $(el).attr('href', 'https://www.tiktok.com/@vestumconfeccion');
            $(el).attr('target', '_blank');
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log("Updated", file);
    }
});
