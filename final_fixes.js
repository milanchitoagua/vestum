const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

// 1. Sync nav and footer from index.html to uniformes-deportivos.html
const indexHtmlContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
let $index = cheerio.load(indexHtmlContent);

// However, before we sync, let's fix the footer in index.html, then we'll do the sync at the end.
// Actually, let's fix everything globally.

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let $ = cheerio.load(content);

    // 1. Fix Footer in ALL files
    $('footer').each((i, footer) => {
        // Remove unwanted links
        $(footer).find('a').each((j, a) => {
            const text = $(a).text().trim().toLowerCase();
            if (text.includes('privacidad') || text.includes('soporte') || text.includes('condiciones') || text.includes('términos')) {
                $(a).remove();
            }
        });

        // The links container is usually the first div with gap-8 or similar
        const linksContainer = $(footer).find('.flex.gap-8.mb-8, .flex.flex-wrap.justify-center.gap-8.mb-8').first();
        if (linksContainer.length > 0) {
            // Ensure Contacto or Contactos is there, if not add it. Wait, the prompt says "dejar solo contactos"
            // Let's just empty it and add Contactos and Ubicacion to be exactly as requested.
            linksContainer.empty();
            linksContainer.append(`<a class="text-[#c4c6cf] hover:text-white font-inter text-sm tracking-normal hover:underline decoration-[#5af8fb] underline-offset-4 transition-opacity duration-200" href="https://wa.me/573123738974" target="_blank">Contactos</a>`);
            linksContainer.append(`<a class="text-[#c4c6cf] hover:text-white font-inter text-sm tracking-normal hover:underline decoration-[#5af8fb] underline-offset-4 transition-opacity duration-200" href="https://maps.app.goo.gl/pxqWrWYVzh7ic4gF6" target="_blank">Ubicación</a>`);
        }

        // Replace 2024 with 2026 in the copyright text
        const copyrightText = $(footer).find('p').first();
        if (copyrightText.length > 0) {
            copyrightText.html(copyrightText.html().replace(/2024/g, '2026'));
        }
    });

    // 2. Specific page fixes
    if (file === 'index.html') {
        // Replace "Articulos" with "Artículos"
        // It's in text nodes, let's just do a string replace on the HTML after Cheerio
    }

    if (file === 'antifluidos.html') {
        // Replace "dotación laboral" with "Dotación laboral" in text
    }

    // Write back the changes so far
    content = $.html();
    
    if (file === 'index.html') {
        content = content.replace(/Articulos/g, 'Artículos');
        content = content.replace(/Articulos/g, 'Artículos'); // Just in case
    }
    
    if (file === 'antifluidos.html') {
        content = content.replace(/dotación laboral ergonómica/g, 'Dotación laboral ergonómica');
    }

    // Replace 2024 -> 2026 in the raw HTML just to be absolutely sure for the footer
    // But since it's only for the footer, we did it via cheerio, but let's do a global replace safely for copyright
    content = content.replace(/© 2024/g, '© 2026');

    fs.writeFileSync(filePath, content, 'utf8');
});

// 3. Now that index.html is fully updated, copy its nav and footer to uniformes-deportivos.html
const updatedIndex = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const $newIndex = cheerio.load(updatedIndex);

const deportesPath = path.join(dir, 'uniformes-deportivos.html');
let deportesContent = fs.readFileSync(deportesPath, 'utf8');
const $deportes = cheerio.load(deportesContent);

// Replace nav
$deportes('nav').first().replaceWith($newIndex('nav').first().clone());

// Replace footer
$deportes('footer').first().replaceWith($newIndex('footer').first().clone());

// Save uniformes-deportivos.html
fs.writeFileSync(deportesPath, $deportes.html(), 'utf8');

console.log("All fixes applied successfully.");
