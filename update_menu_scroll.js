const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Users/milan/Music/ves';

const megaMenuHtml = `
<div class="relative group z-50">
    <a class="text-[#5c6570] hover:text-[#171e36] transition-colors font-manrope uppercase tracking-tighter text-sm cursor-pointer py-4" href="catalogo-categoria.html">Catálogo</a>
    <div class="absolute left-1/2 -translate-x-1/2 mt-0 w-[650px] bg-white dark:bg-[#171e36] rounded-2xl shadow-2xl p-6 hidden group-hover:block border border-[#c4c6cf]/20">
        <div class="grid grid-cols-2 gap-4">
            <a href="uniformes-empresariales.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">corporate_fare</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Uniformes empresariales</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Imagen corporativa impecable</p>
                </div>
            </a>
            <a href="uniformes-escolares.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">school</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Uniformes escolares</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Durabilidad y comodidad</p>
                </div>
            </a>
            <a href="antifluidos.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">medical_services</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Antifluidos</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Protección para salud</p>
                </div>
            </a>
            <a href="area-industrial.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">factory</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Area Industrial</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Resistencia máxima</p>
                </div>
            </a>
            <a href="uniformes-deportivos.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">sports_soccer</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Uniformes deportivos</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Tejidos técnicos de alto rendimiento</p>
                </div>
            </a>
            <a href="bordados-estampados.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">apparel</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Bordados y estampados</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Personalización HD</p>
                </div>
            </a>
        </div>
        <div class="mt-4 pt-4 border-t border-[#c4c6cf]/15 text-center">
            <a href="articulos-merchandising.html" class="inline-flex items-center gap-2 text-sm font-bold text-[#2180ff] hover:text-[#004493] transition-colors bg-[#f3f4f5] px-6 py-2 rounded-full">
                <span class="material-symbols-outlined text-[18px]">shopping_bag</span> Ver Artículos Merchandising
            </a>
        </div>
    </div>
</div>
`;

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove inline style from <html> tag completely to allow scroll
    content = content.replace(/<html[^>]*>/i, (match) => {
        return match.replace(/style="[^"]*"/i, '');
    });
    
    // Also from body, just in case
    content = content.replace(/<body[^>]*>/i, (match) => {
        return match.replace(/style="[^"]*"/i, '');
    });

    const $ = cheerio.load(content);

    // Find the old Catalogo dropdown and replace it with megaMenuHtml
    $('.hidden.md\\:flex.gap-8.items-center .relative.group').each((i, el) => {
        $(el).replaceWith(megaMenuHtml);
    });

    // Write back
    fs.writeFileSync(filePath, $.html(), 'utf8');
    console.log("Updated scroll and menu on", file);
});
