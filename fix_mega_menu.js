const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/milan/Music/ves';

fs.readdirSync(dir).forEach(file => {
    if (!file.endsWith('.html')) return;
    
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // The broken structure
    const brokenRegex = /<a href="uniformes-empresariales\.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group\/item">\s*<\/a>\s*<div class="bg-\[#dae3f0\] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover\/item:bg-primary-container group-hover\/item:text-white transition-colors">\s*<span class="material-symbols-outlined">corporate_fare<\/span>\s*<\/div>\s*<div>\s*<h4 class="font-bold text-sm text-\[#19233f\] dark:text-white mb-0\.5">Uniformes empresariales<\/h4>\s*<p class="text-\[11px\] text-\[#5c6570\] dark:text-\[#c4c6cf\]">Imagen corporativa impecable<\/p>\s*<\/div>/g;
    
    const correctReplacement = `<a href="uniformes-empresariales.html" class="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-container-low transition-all group/item">
                <div class="bg-[#dae3f0] text-primary-container w-12 h-12 rounded-full flex items-center justify-center shrink-0 group-hover/item:bg-primary-container group-hover/item:text-white transition-colors">
                    <span class="material-symbols-outlined">corporate_fare</span>
                </div>
                <div>
                    <h4 class="font-bold text-sm text-[#19233f] dark:text-white mb-0.5">Uniformes empresariales</h4>
                    <p class="text-[11px] text-[#5c6570] dark:text-[#c4c6cf]">Imagen corporativa impecable</p>
                </div>
            </a>`;

    if (brokenRegex.test(content)) {
        content = content.replace(brokenRegex, correctReplacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Fixed uniformes empresariales in", file);
    }
});
