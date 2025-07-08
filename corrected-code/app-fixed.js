// ✅ CÓDIGO CORRIGIDO COM DEBUGGING
const fs = require("fs")

function carregarUsuarios() {
  console.log("🔍 DEBUG: Iniciando carregamento de usuários...")

  // ✅ CORREÇÃO: Verificar se arquivo existe antes de ler
  if (!fs.existsSync("usuarios.json")) {
    console.error("❌ ERRO: Arquivo usuarios.json não encontrado!")
    console.log("💡 SOLUÇÃO: Criar o arquivo usuarios.json com dados válidos")
    return
  }

  fs.readFile("usuarios.json", "utf8", (err, dados) => {
    if (err) {
      console.error("❌ ERRO ao ler o arquivo:", err.message)
      console.log("💡 DEBUG: Verificar permissões do arquivo")
    } else {
      console.log("📄 DEBUG: Dados lidos do arquivo:", dados)

      try {
        // ✅ CORREÇÃO: Adicionar try/catch para capturar erros de parsing
        const usuarios = JSON.parse(dados)
        console.log("✅ DEBUG: JSON parseado com sucesso")
        console.log("📊 DEBUG: Número de usuários:", usuarios.length)

        filtrarUsuarios(usuarios)
      } catch (parseError) {
        console.error("❌ ERRO no parse do JSON:", parseError.message)
        console.log("💡 SOLUÇÃO: Verificar sintaxe do JSON no arquivo")
      }
    }
  })
}

function filtrarUsuarios(lista) {
  console.log("🔍 DEBUG: Iniciando filtro de usuários...")

  // ✅ CORREÇÃO: Validar se lista é um array
  if (!Array.isArray(lista)) {
    console.error("❌ ERRO: Dados não são um array válido")
    return
  }

  console.log("📊 DEBUG: Total de usuários para filtrar:", lista.length)

  const resultado = lista.filter((usuario) => {
    console.log(`🔍 DEBUG: Verificando ${usuario.nome} - idade: ${usuario.idade}`)
    return usuario.idade > 18
  })

  console.log("✅ DEBUG: Filtro concluído")
  console.log("📊 DEBUG: Usuários maiores de idade encontrados:", resultado.length)

  console.log("👥 Usuários maiores de idade:")
  resultado.forEach((u) => {
    console.log(`- ${u.nome} (${u.idade} anos)`)
  })
}

function exibirMensagem() {
  // ✅ CORREÇÃO: Definir a variável antes de usar
  const mensagem = "🎉 Sistema de usuários processado com sucesso!"
  console.log("💬 DEBUG: Exibindo mensagem final")
  console.log(mensagem)
}

function main() {
  console.log("🚀 DEBUG: Iniciando aplicação...")
  console.log("⏰ DEBUG: Timestamp:", new Date().toISOString())

  carregarUsuarios()

  // ✅ CORREÇÃO: Adicionar delay para garantir ordem de execução
  setTimeout(() => {
    exibirMensagem()
  }, 100)
}

main()
