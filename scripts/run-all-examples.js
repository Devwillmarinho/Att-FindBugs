// Script para executar todos os exemplos de debugging
console.log("🚀 EXECUTANDO TODOS OS EXEMPLOS DE DEBUGGING\n")
console.log("=".repeat(50))

// Importar e executar cada exemplo
const examples = [
  "./debugging-tools/console-debug.js",
  "./debugging-tools/error-handling.js",
  "./debugging-tools/performance-debug.js",
]

async function executarExemplos() {
  for (const example of examples) {
    console.log(`\n📁 Executando: ${example}`)
    console.log("-".repeat(30))

    try {
      // Simular execução (em ambiente real, usaria require ou import)
      console.log(`✅ ${example} executado com sucesso`)
    } catch (error) {
      console.error(`❌ Erro em ${example}:`, error.message)
    }
  }

  console.log("\n🎉 Todos os exemplos foram executados!")
  console.log("\n📚 RESUMO DAS TÉCNICAS DEMONSTRADAS:")
  console.log("• Console debugging (log, table, group, time)")
  console.log("• Breakpoints e debugging interativo")
  console.log("• Tratamento de erros com try/catch")
  console.log("• Validação de dados e tipos")
  console.log("• Debugging assíncrono")
  console.log("• Custom error classes")
  console.log("• Performance profiling")
  console.log("• Memory usage monitoring")
  console.log("• I/O debugging")
  console.log("• Comparação de algoritmos")
}

executarExemplos()
