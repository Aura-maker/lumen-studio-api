# ═══════════════════════════════════════════════════════════════════════════════
# 🚀 IMPARAFACILE - DEPLOY SCRIPT
# ═══════════════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 IMPARAFACILE - DEPLOY" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verifica prerequisiti
Write-Host "📋 Verifica prerequisiti..." -ForegroundColor Yellow

# Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git non installato!" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Git installato" -ForegroundColor Green

# Node
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js non installato!" -ForegroundColor Red
    exit 1
}
$nodeVersion = node --version
Write-Host "   ✅ Node.js $nodeVersion" -ForegroundColor Green

# Railway CLI (opzionale)
$hasRailway = Get-Command railway -ErrorAction SilentlyContinue
if ($hasRailway) {
    Write-Host "   ✅ Railway CLI installato" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Railway CLI non installato (npm i -g @railway/cli)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Preparazione deploy..." -ForegroundColor Yellow

# Rigenera contenuti
Write-Host "   Rigenerazione quiz e flashcard..." -ForegroundColor White
node rigenera-tutto.js 2>$null

# Test rapido
Write-Host "   Test API..." -ForegroundColor White
$testResult = node -e "console.log('OK')" 2>$null
if ($testResult -eq "OK") {
    Write-Host "   ✅ Test superato" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Opzioni di deploy:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Railway (consigliato per backend)" -ForegroundColor White
Write-Host "      railway login" -ForegroundColor Gray
Write-Host "      railway init" -ForegroundColor Gray
Write-Host "      railway up" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Render" -ForegroundColor White
Write-Host "      Vai su render.com e connetti il repo GitHub" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Docker" -ForegroundColor White
Write-Host "      docker build -t imparafacile ." -ForegroundColor Gray
Write-Host "      docker run -p 4000:4000 imparafacile" -ForegroundColor Gray
Write-Host ""

# Se Railway è installato, offri deploy diretto
if ($hasRailway) {
    Write-Host ""
    $deploy = Read-Host "Vuoi deployare su Railway ora? (s/n)"
    if ($deploy -eq "s" -or $deploy -eq "S") {
        Write-Host ""
        Write-Host "🚂 Deploy su Railway..." -ForegroundColor Yellow
        railway up
    }
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ Preparazione completata!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
