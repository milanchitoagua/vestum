$dir = "c:/Users/milan/Music/ves"
$files = Get-ChildItem -Path $dir -Filter "*.html"

foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw

    # 1. FontAwesome
    if ($content -notmatch "font-awesome") {
        $content = $content -replace '(<head[^>]*>)', '$1<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'
    }

    # 2. Update menus
    $content = $content -replace 'href="#"([^>]*>Inicio)', 'href="index.html"$1'
    $content = $content -replace 'href="#"([^>]*>Catálogo)', 'href="catalogo-categoria.html"$1'
    
    # Update "Catalogo Promocionales" link
    $content = $content -replace 'href="[^"]*"([^>]*>Catalogo Promocionales)', 'href="https://www.catalogospromocionales.com/seccion/inicio.html" target="_blank"$1'
    $content = $content -replace 'href="[^"]*"([^>]*>Catálogo Promocional)', 'href="https://www.catalogospromocionales.com/seccion/inicio.html" target="_blank"$1'

    # Update Cotizador link
    $content = $content -replace 'href="#"([^>]*>Cotizador)', 'href="https://wa.me/573123738974" target="_blank"$1'
    
    # Mobile menu specific updates since they might have spans inside
    $content = $content -replace 'href="#"([^>]*>[\s\S]*?Inicio\s*</span>\s*</a>)', 'href="index.html"$1'
    $content = $content -replace 'href="#"([^>]*>[\s\S]*?Catálogo\s*</span>\s*</a>)', 'href="catalogo-categoria.html"$1'
    $content = $content -replace 'href="#"([^>]*>[\s\S]*?Cotizador\s*</span>\s*</a>)', 'href="https://wa.me/573123738974" target="_blank"$1'

    # 3. Footer Links
    $content = $content -replace 'href="#"([^>]*>Contacto)', 'href="https://wa.me/573123738974" target="_blank"$1'

    # 4. Social Icons
    $content = $content -replace '<a class="[^"]*material-symbols-outlined[^"]*" href="#">facebook</a>', '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-facebook"></i></a>'
    $content = $content -replace '<a class="[^"]*material-symbols-outlined[^"]*" href="#">photo_camera</a>', '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-instagram"></i></a>'
    $content = $content -replace '<a class="[^"]*material-symbols-outlined[^"]*" href="#">video_library</a>', '<a class="text-white/50 hover:text-white cursor-pointer transition-colors text-2xl" href="#"><i class="fab fa-tiktok"></i></a>'

    # 5. Convert <button> to <a> for external links like whatsapp and promotional catalog
    # Match button with "Catálogo Promocional"
    $content = [regex]::Replace($content, '(?i)<button\s+class="([^"]+)"[^>]*>([\s\S]*?Catálogo Promocional[\s\S]*?)<\/button>', '<a href="https://www.catalogospromocionales.com/seccion/inicio.html" target="_blank" class="$1 inline-block text-center">$2</a>')
    
    # Match button with "+57 3123738974"
    $content = [regex]::Replace($content, '(?i)<button\s+class="([^"]+)"[^>]*>([\s\S]*?\+57\s*3123738974[\s\S]*?)<\/button>', '<a href="https://wa.me/573123738974" target="_blank" class="$1 inline-block text-center">$2</a>')

    Set-Content -Path $f.FullName -Value $content -Encoding UTF8
    Write-Host "Processed $($f.Name)"
}
