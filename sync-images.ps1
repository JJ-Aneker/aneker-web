# Script para sincronizar automáticamente imágenes con Git/Vercel
# Uso: .\sync-images.ps1 ["mensaje opcional del commit"]

param(
    [string]$Message = "Sincroniza imágenes"
)

Write-Host "🔍 Buscando imágenes nuevas o modificadas..." -ForegroundColor Cyan

# Añadir todas las imágenes (webp, png, jpg) del directorio img/
git add img/**/*.webp img/**/*.png img/**/*.jpg 2>$null

# Ver qué se va a sincronizar
$status = git status --short img/
if ($status) {
    Write-Host "`n📸 Imágenes a sincronizar:" -ForegroundColor Yellow
    $status

    # Hacer commit
    Write-Host "`n💾 Creando commit..." -ForegroundColor Cyan
    git commit -m "$Message`n`nCo-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

    # Push a Vercel
    Write-Host "`n🚀 Subiendo a Vercel..." -ForegroundColor Cyan
    git push origin main

    Write-Host "`n✅ ¡Listo! Las imágenes se sincronizarán con Vercel en unos segundos." -ForegroundColor Green
} else {
    Write-Host "`n✓ No hay imágenes nuevas para sincronizar" -ForegroundColor Green
}
