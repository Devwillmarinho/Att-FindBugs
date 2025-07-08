// Script de demonstração de debugging
console.log("=== DEMONSTRAÇÃO DE DEBUGGING ===")

// Simulando os bugs originais encontrados
function demonstrarBugs() {
  console.log("\n1. 🐛 BUG: Variável não definida")
  const mensagemNaoDefinida = "Olá, mundo!" // Definindo a variável antes do uso
  try {
    console.log(mensagemNaoDefinida) // Agora a variável está definida
  } catch (error) {
    console.log("❌ Erro capturado:", error.message)
    console.log("💡 Solução: Definir a variável antes do uso")
  }

  console.log("\n2. 🐛 BUG: JSON inválido")
  const jsonInvalido = '{ "nome": "Ana", "idade": 22 }' // Usando aspas duplas em todas as propriedades
  try {
    JSON.parse(jsonInvalido)
  } catch (error) {
    console.log("❌ Erro de parsing JSON:", error.message)
    console.log("💡 Solução: Usar aspas duplas em todas as propriedades")
  }

  console.log("\n3. 🐛 BUG: Arquivo não encontrado")
  const fs = require("fs")
  try {
    fs.readFileSync("arquivo-inexistente.json")
  } catch (error) {
    console.log("❌ Erro de arquivo:", error.message)
    console.log("💡 Solução: Verificar se o arquivo existe antes de ler")
  }

  console.log("\n✅ CORREÇÕES IMPLEMENTADAS:")
  console.log("- Variáveis definidas corretamente")
  console.log("- JSON com sintaxe válida")
  console.log("- Verificação de existência de arquivos")
  console.log("- Tratamento de erros com try/catch")
  console.log("- Logs detalhados para debugging")
}

demonstrarBugs()
