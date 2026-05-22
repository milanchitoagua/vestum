const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

const amigoLogoHtml = `
<a href="https://www.mipagoamigo.com/MPA_WebSite/ServicePayments/StartPayment?id=20193&searchedCategoryId=&searchedAgreementName=LIMINA%20SOLUCIONES%20INTEGRALES%20SAS" target="_blank" class="transition-transform hover:scale-105 inline-block ml-4">
    <img src="mipagoamigo.png" alt="Mi Pago Amigo" class="h-6 md:h-8 w-auto object-contain">
</a>
`;

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(content);

    // Remove the previously injected amigo logo
    $('nav a[href*="mipagoamigo.com"]').remove();

    // Find the right-side container in the navbar
    const rightContainer = $('nav .flex.items-center.gap-4').first();
    
    if (rightContainer.length) {
        // Prepend so it sits before the mobile menu button or empty buttons
        rightContainer.prepend(amigoLogoHtml);
        
        fs.writeFileSync(filePath, $.html(), 'utf8');
        console.log("Moved logo on", file);
    }
});
