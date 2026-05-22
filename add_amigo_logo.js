const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

const amigoLogoHtml = `
<a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=20193&searchedCategoryId=&searchedAgreementName=LIMINA%20SOLUCIONES%20INTEGRALES%20SAS" target="_blank" class="mr-4 transition-transform hover:scale-105 inline-block">
    <img src="mipagoamigo.png" alt="Mi Pago Amigo" class="h-10 md:h-12 w-auto object-contain">
</a>
`;

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // Look for the navbar flex container
    // It's the one with class 'flex items-center gap-12' containing the Vestum Logo
    const logoContainer = $('.flex.items-center.gap-12').first();
    
    if (logoContainer.length) {
        // Remove existing amigo logo if any
        logoContainer.find('a[href*="mipagoamigo.com"]').remove();

        // Check if there's an 'a' wrapping the vestum logo, or just an 'img'
        const vestumLogoLink = logoContainer.find('a').has('img[alt*="Vestum"]').first();
        const vestumLogoImg = logoContainer.find('img[alt*="Vestum"]').first();

        if (vestumLogoLink.length) {
            vestumLogoLink.before(amigoLogoHtml);
        } else if (vestumLogoImg.length) {
            vestumLogoImg.before(amigoLogoHtml);
        }
        
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log("Updated logo on", file);
    }
});
