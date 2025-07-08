// Debugging de performance e otimização
console.log("=== DEBUGGING DE PERFORMANCE ===\n")

const fs = require("fs")

// 1. Medição de tempo de execução
function medirPerformance() {
  console.log("⏱️ Medição de Performance:")

  // Método 1: console.time
  console.time("Processamento Array")

  const numeros = Array.from({ length: 100000 }, (_, i) => i)
  const pares = numeros.filter((n) => n % 2 === 0)

  console.timeEnd("Processamento Array")
  console.log(`📊 Resultado: ${pares.length} números pares`)

  // Método 2: performance.now() (mais preciso)
  const inicio = performance.now()

  const quadrados = numeros.map((n) => n * n)

  const fim = performance.now()
  console.log(`⚡ Tempo preciso: ${(fim - inicio).toFixed(2)}ms`)
}

// 2. Memory usage debugging
function debugMemoria() {
  console.log("\n💾 Debug de Memória:")

  const memInicial = process.memoryUsage()
  console.log("📊 Memória inicial:", {
    rss: `${Math.round(memInicial.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memInicial.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memInicial.heapTotal / 1024 / 1024)}MB`,
  })

  // Criar array grande para demonstrar uso de memória
  const arrayGrande = new Array(1000000).fill("dados")

  const memFinal = process.memoryUsage()
  console.log("📊 Memória após array:", {
    rss: `${Math.round(memFinal.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memFinal.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memFinal.heapTotal / 1024 / 1024)}MB`,
  })

  console.log(`📈 Diferença: +${Math.round((memFinal.heapUsed - memInicial.heapUsed) / 1024 / 1024)}MB`)
}

// 3. Profiling de funções
function profileFuncao(nome, funcao, ...args) {
  console.log(`\n🔍 Profiling: ${nome}`)

  const inicio = performance.now()
  const resultado = funcao(...args)
  const fim = performance.now()

  console.log(`⏱️ Tempo: ${(fim - inicio).toFixed(2)}ms`)
  console.log(
    `📤 Resultado: ${typeof resultado === "object" ? JSON.stringify(resultado).length + " chars" : resultado}`,
  )

  return resultado
}

// 4. Comparação de algoritmos
function compararAlgoritmos() {
  console.log("\n🏁 Comparação de Algoritmos:")

  const dados = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 1000))

  // Algoritmo 1: Filter + Map
  console.time("Filter + Map")
  const resultado1 = dados.filter((n) => n > 500).map((n) => n * 2)
  console.timeEnd("Filter + Map")

  // Algoritmo 2: Reduce (mais eficiente)
  console.time("Reduce")
  const resultado2 = dados.reduce((acc, n) => {
    if (n > 500) {
      acc.push(n * 2)
    }
    return acc
  }, [])
  console.timeEnd("Reduce")

  console.log(`📊 Resultados iguais: ${JSON.stringify(resultado1) === JSON.stringify(resultado2)}`)
}

// 5. Debugging de I/O
async function debugIO() {
  console.log("\n💿 Debug de I/O:")

  const arquivo = "temp-debug.txt"
  const dados = "Dados de teste para debugging de I/O\n".repeat(1000)

  // Escrita síncrona vs assíncrona
  console.time("Escrita Síncrona")
  fs.writeFileSync(arquivo, dados)
  console.timeEnd("Escrita Síncrona")

  console.time("Escrita Assíncrona")
  await fs.promises.writeFile(arquivo + ".async", dados)
  console.timeEnd("Escrita Assíncrona")

  // Limpeza
  fs.unlinkSync(arquivo)
  fs.unlinkSync(arquivo + ".async")

  console.log("✅ Arquivos temporários removidos")
}

// Executar testes de performance
medirPerformance()
debugMemoria()

profileFuncao("Array Sort", (arr) => [...arr].sort((a, b) => b - a), [3, 1, 4, 1, 5, 9])
profileFuncao("String Processing", (str) => str.split("").reverse().join(""), "debugging")

compararAlgoritmos()
debugIO()
