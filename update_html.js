const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/milan/Music/ves';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // FontAwesome
        if (!content.includes('font-awesome')) {
            content = content.replace(/(<head[^>]*>)/i, '$1<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">');
        }

        // Links Update
        // "Inicio"
        content = content.replace(/href="#"([^>]*>\s*Inicio\s*<\/a>)/gi, 'href="index.html"$1');
        // "Catálogo"
        content = content.replace(/href="#"([^>]*>\s*Catálogo\s*<\/a>)/gi, 'href="catalogo-categoria.html"$1');
        
        // "Catalogo Promocionales" links (various forms)
        content = content.replace(/href="[^"]*"([^>]*>\s*Catalogo Promocionales\s*<\/a>)/gi, 'href="https://www.catalogospromocionales.com/seccion/inicio.html" target="_blank"$1');
        
        // Update "Contacto"
        content = content.replace(/href="#"([^>]*>\s*Contacto\s*<\/a>)/gi, 'href="https://wa.me/573123738974" target="_blank"$1');

        // Mobile Links
        content = content.replace(/href="#"([^>]*>[\s\S]*?Inicio\s*<\/span>\s*<\/a>)/gi, 'href="index.html"$1');
        content = content.replace(/href="#"([^>]*>[\s\S]*?Catálogo\s*<\/span>\s*<\/a>)/gi, 'href="catalogo-categoria.html"$1');
        content = content.replace(/href="#"([^>]*>[\s\S]*?Cotizador\s*<\/span>\s*<\/a>)/gi, 'href="https://wa.me/573123738974" target="_blank"$1');

        // Social Icons
        content = content.replace(/<a class="[^"]*material-symbols-outlined[^"]*" href="#">facebook<\/a>/i, '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-facebook"></i></a>');
        content = content.replace(/<a class="[^"]*material-symbols-outlined[^"]*" href="#">photo_camera<\/a>/i, '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-instagram"></i></a>');
        content = content.replace(/<a class="[^"]*material-symbols-outlined[^"]*" href="#">video_library<\/a>/i, '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-tiktok"></i></a>');

        // Catálogo Promocional Button
        content = content.replace(/<button([^>]*)>([\s\S]*?Catálogo Promocional[\s\S]*?)<\/button>/gi, '<a$1 href="https://www.catalogospromocionales.com/seccion/inicio.html" target="_blank" style="display:inline-block;text-align:center;">$2</a>');
        
        // WhatsApp Button
        content = content.replace(/<button([^>]*)>([\s\S]*?\+57\s*3123738974[\s\S]*?)<\/button>/gi, '<a$1 href="https://wa.me/573123738974" target="_blank" style="display:inline-block;text-align:center;">$2</a>');

        // Ensure scroll everywhere (remove overflow-hidden and h-screen from body if present)
        content = content.replace(/<body([^>]*)class="([^"]*overflow-hidden[^"]*)"/i, (match, p1, p2) => `<body${p1}class="${p2.replace(/overflow-hidden/g, '')}"`);
        content = content.replace(/<body([^>]*)class="([^"]*h-screen[^"]*)"/i, (match, p1, p2) => `<body${p1}class="${p2.replace(/h-screen/g, '')}"`);

        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Processed", file);
    }
});
