/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🚀 RIGENERA TUTTO - QUIZ + FLASHCARD + SIMULAZIONI
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const { execSync } = require('child_process');

console.log('\n' + '═'.repeat(70));
console.log('   🚀 RIGENERAZIONE COMPLETA CONTENUTI EDUCATIVI');
console.log('═'.repeat(70) + '\n');

const start = Date.now();

try {
  // 1. Rigenera Quiz
  console.log('📝 FASE 1: Generazione Quiz...\n');
  execSync('node rigenera-quiz-v2.js', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n');
  
  // 2. Rigenera Flashcard
  console.log('📚 FASE 2: Generazione Flashcard...\n');
  execSync('node rigenera-flashcard-v2.js', { stdio: 'inherit', cwd: __dirname });
  
  console.log('\n');
  
  // 3. Rigenera Simulazioni (se esiste)
  try {
    console.log('📋 FASE 3: Generazione Simulazioni...\n');
    execSync('node rigenera-simulazioni.js', { stdio: 'inherit', cwd: __dirname });
  } catch (e) {
    console.log('   ⚠️ Simulazioni: script non trovato o errore\n');
  }
  
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  
  console.log('\n' + '═'.repeat(70));
  console.log('   ✅ RIGENERAZIONE COMPLETATA');
  console.log(`   ⏱️  Tempo totale: ${elapsed}s`);
  console.log('═'.repeat(70) + '\n');
  
} catch (error) {
  console.error('❌ Errore durante la rigenerazione:', error.message);
  process.exit(1);
}
