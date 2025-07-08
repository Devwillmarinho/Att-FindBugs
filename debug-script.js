// Script para demonstrar debugging com breakpoints
const fs = require("fs")

function debugCarregarUsuarios() {
  console.log("=== MODO DEBUG ===")

  // Breakpoint 1: Verificar se arquivo existe
  debugger // Pausa aqui para inspecionar

  if (!fs.existsSync("usuarios.json")) {
    console.error("❌ Arquivo usuarios.json não encontrado!")
    return
  }

  // Breakpoint 2: Ler arquivo
  debugger // Pausa aqui para inspecionar

  const dados = fs.readFileSync("usuarios.json", "utf8")
  console.log("Dados brutos:", dados)

  // Breakpoint 3: Parse JSON
  debugger // Pausa aqui para inspecionar variáveis

  try {
    const usuarios = JSON.parse(dados)
    console.log("Usuários parseados:", usuarios)

    // Breakpoint 4: Filtrar usuários
    debugger // Pausa aqui para inspecionar array

    const maioresDeIdade = usuarios.filter((u) => u.idade > 18)
    console.log("Resultado final:", maioresDeIdade)
  } catch (error) {
    console.error("Erro no parse:", error)
  }
}

// Para executar em modo debug: NODE_OPTIONS='--inspect' node debug-script.js
debugCarregarUsuarios()
