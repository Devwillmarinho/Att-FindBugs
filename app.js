const fs = require("fs")

function carregarUsuarios() {
  console.log("🔍 Iniciando carregamento de usuários...")

  fs.readFile("usuarios.json", "utf8", (err, dados) => {
    if (err) {
      console.error("❌ Erro ao ler o arquivo:", err.message)
      console.log("💡 Verifique se o arquivo usuarios.json existe no diretório")
      return
    }

    try {
      console.log("📄 Dados lidos do arquivo:", dados)
      const usuarios = JSON.parse(dados)
      console.log("✅ JSON parseado com sucesso:", usuarios)
      filtrarUsuarios(usuarios)
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError.message)
      console.log("💡 Verifique se o JSON está com sintaxe correta")
    }
  })
}

function filtrarUsuarios(lista) {
  console.log("🔍 Filtrando usuários...")
  console.log("📊 Lista recebida:", lista)

  if (!Array.isArray(lista)) {
    console.error("❌ Erro: lista não é um array")
    return
  }

  const resultado = lista.filter((usuario) => {
    console.log(`🔍 Verificando usuário: ${usuario.nome}, idade: ${usuario.idade}`)
    return usuario.idade > 18
  })

  console.log("✅ Usuários maiores de idade:")
  resultado.forEach((u) => {
    console.log(`- ${u.nome} (${u.idade} anos)`)
  })
}

function exibirMensagem() {
  // ✅ Corrigido: definindo a variável mensagem
  const mensagem = "🎉 Sistema de usuários carregado com sucesso!"
  console.log(mensagem)
}

function main() {
  console.log("🚀 Iniciando aplicação...")

  // Adicionando um pequeno delay para garantir que a mensagem apareça após o processamento
  carregarUsuarios()

  setTimeout(() => {
    exibirMensagem()
  }, 100)
}

main()
