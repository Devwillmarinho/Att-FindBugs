// Técnicas avançadas de debugging com console
console.log("=== TÉCNICAS DE DEBUGGING COM CONSOLE ===\n")

// 1. Console.log básico vs avançado
console.log("❌ Debug básico:", "valor")
console.log("✅ Debug avançado:", { variavel: "valor", timestamp: new Date() })

// 2. Console.table para arrays/objetos
const usuarios = [
  { nome: "Ana", idade: 22, ativo: true },
  { nome: "Carlos", idade: 17, ativo: false },
  { nome: "Beatriz", idade: 30, ativo: true },
]

console.log("\n📊 Usando console.table:")
console.table(usuarios)

// 3. Console.group para organizar logs
console.group("🔍 Processo de Filtro")
console.log("Iniciando filtro...")
console.log("Critério: idade > 18")

usuarios.forEach((usuario, index) => {
  console.group(`👤 Usuário ${index + 1}: ${usuario.nome}`)
  console.log("Idade:", usuario.idade)
  console.log("Maior de idade:", usuario.idade > 18 ? "✅" : "❌")
  console.groupEnd()
})

console.groupEnd()

// 4. Console.time para medir performance
console.time("⏱️ Tempo de processamento")

const resultado = usuarios.filter((u) => u.idade > 18)

console.timeEnd("⏱️ Tempo de processamento")

// 5. Console.assert para validações
console.log("\n🧪 Testes de Validação:")
console.assert(Array.isArray(usuarios), "❌ usuarios deve ser um array")
console.assert(resultado.length > 0, "❌ deve haver usuários maiores de idade")
console.assert(typeof usuarios[0].nome === "string", "❌ nome deve ser string")

// 6. Console.trace para rastrear chamadas
function funcaoA() {
  funcaoB()
}

function funcaoB() {
  funcaoC()
}

function funcaoC() {
  console.trace("📍 Rastreamento de chamadas")
}

console.log("\n📍 Demonstração de trace:")
funcaoA()

// 7. Console.count para contar execuções
console.log("\n🔢 Contador de execuções:")
for (let i = 0; i < 3; i++) {
  console.count("Loop executado")
}

// 8. Console.dir para inspeção detalhada
console.log("\n🔍 Inspeção detalhada:")
console.dir(usuarios[0], { colors: true, depth: null })
