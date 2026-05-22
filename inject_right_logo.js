const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

const amigoLogoHtml = `
<a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=20193&searchedCategoryId=&searchedAgreementName=LIMINA%20SOLUCIONES%20INTEGRALES%20SAS" target="_blank" class="transition-transform hover:scale-105 inline-block">
    <img src="mipagoamigo.png" alt="Mi Pago Amigo" class="h-6 md:h-10 w-auto object-contain">
</a>
`;

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // 1. Remove all existing mipagoamigo links anywhere in the doc to be safe
    $('a[href*="mipagoamigo.com"]').remove();

    // 2. Find the right-side container in the navbar
    // The main nav container is a flex justify-between
    // Its children are gap-12 (left) and gap-4 (right)
    const navBarContainer = $('nav > div.flex.justify-between.items-center').first();
    const rightContainer = navBarContainer.children('div.flex.items-center.gap-4');
    
    if (rightContainer.length) {
        // Clean up empty buttons that were left over from templates
        rightContainer.children('button').each((i, btn) => {
            if ($(btn).children().length === 0 && $(btn).text().trim() === '') {
                $(btn).remove();
            }
        });

        // Add the new logo
        rightContainer.prepend(amigoLogoHtml);
        
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log("Injected right logo on", file);
    }
});
