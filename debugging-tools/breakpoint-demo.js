// Demonstração de uso de breakpoints para debugging
const fs = require("fs")

function demonstrarBreakpoints() {
  console.log("=== DEMONSTRAÇÃO DE BREAKPOINTS ===")

  // BREAKPOINT 1: Início da função
  debugger // Pausa aqui - inspecionar variáveis iniciais

  let dados = null
  let usuarios = null

  try {
    // BREAKPOINT 2: Antes de ler arquivo
    debugger // Pausa aqui - verificar se arquivo existe

    if (fs.existsSync("usuarios.json")) {
      dados = fs.readFileSync("usuarios.json", "utf8")
      console.log("📄 Dados lidos:", dados)

      // BREAKPOINT 3: Após ler arquivo
      debugger // Pausa aqui - inspecionar conteúdo de 'dados'

      usuarios = JSON.parse(dados)
      console.log("👥 Usuários parseados:", usuarios)

      // BREAKPOINT 4: Após parse JSON
      debugger // Pausa aqui - inspecionar array 'usuarios'

      const maioresDeIdade = usuarios.filter((u) => {
        // BREAKPOINT 5: Dentro do filter
        debugger // Pausa aqui - inspecionar cada usuário
        console.log(`Verificando: ${u.nome} (${u.idade})`)
        return u.idade > 18
      })

      // BREAKPOINT 6: Resultado final
      debugger // Pausa aqui - inspecionar resultado final

      console.log("✅ Resultado:", maioresDeIdade)
    } else {
      console.error("❌ Arquivo não encontrado")
    }
  } catch (error) {
    // BREAKPOINT 7: Captura de erro
    debugger // Pausa aqui - inspecionar erro
    console.error("❌ Erro capturado:", error.message)
  }
}

// Para executar com debugging:
// node --inspect-brk breakpoint-demo.js
// Depois abrir Chrome DevTools em chrome://inspect

demonstrarBreakpoints()
