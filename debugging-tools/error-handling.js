// Demonstração de tratamento de erros e debugging
console.log("=== TRATAMENTO DE ERROS E DEBUGGING ===\n")

// 1. Try/Catch básico
function exemploTryCatch() {
  console.log("1️⃣ Exemplo Try/Catch:")

  try {
    // Simular erro de JSON inválido
    const jsonInvalido = '{ nome: "Ana", idade: 22 }' // sem aspas na propriedade
    const objeto = JSON.parse(jsonInvalido)
    console.log("✅ JSON parseado:", objeto)
  } catch (error) {
    console.error("❌ Erro capturado:", error.message)
    console.log("💡 Tipo do erro:", error.name)
    console.log("📍 Stack trace:", error.stack)
  }
}

// 2. Validação de tipos
function validarDados(usuario) {
  console.log("\n2️⃣ Validação de Dados:")

  const erros = []

  if (!usuario) {
    erros.push("Usuário não pode ser null/undefined")
  }

  if (typeof usuario?.nome !== "string") {
    erros.push("Nome deve ser uma string")
  }

  if (typeof usuario?.idade !== "number") {
    erros.push("Idade deve ser um número")
  }

  if (usuario?.idade < 0) {
    erros.push("Idade não pode ser negativa")
  }

  if (erros.length > 0) {
    console.error("❌ Erros de validação:")
    erros.forEach((erro) => console.error(`  - ${erro}`))
    return false
  }

  console.log("✅ Dados válidos:", usuario)
  return true
}

// 3. Debugging de funções assíncronas
async function exemploAssincrono() {
  console.log("\n3️⃣ Debugging Assíncrono:")

  try {
    console.log("🔄 Iniciando operação assíncrona...")

    // Simular operação assíncrona
    const resultado = await new Promise((resolve, reject) => {
      setTimeout(() => {
        const sucesso = Math.random() > 0.5
        if (sucesso) {
          resolve({ dados: "Operação concluída" })
        } else {
          reject(new Error("Falha na operação assíncrona"))
        }
      }, 1000)
    })

    console.log("✅ Sucesso:", resultado)
  } catch (error) {
    console.error("❌ Erro assíncrono:", error.message)
    console.log("🔧 Debugging: Verificar conexão/timeout")
  }
}

// 4. Custom Error Classes
class UsuarioError extends Error {
  constructor(message, codigo) {
    super(message)
    this.name = "UsuarioError"
    this.codigo = codigo
  }
}

function exemploCustomError() {
  console.log("\n4️⃣ Custom Errors:")

  try {
    throw new UsuarioError("Usuário não encontrado", "USER_NOT_FOUND")
  } catch (error) {
    if (error instanceof UsuarioError) {
      console.error("❌ Erro customizado:", error.message)
      console.log("🏷️ Código:", error.codigo)
    } else {
      console.error("❌ Erro genérico:", error.message)
    }
  }
}

// Executar exemplos
exemploTryCatch()

validarDados({ nome: "Ana", idade: 22 }) // Válido
validarDados({ nome: 123, idade: -5 }) // Inválido

exemploAssincrono()
exemploCustomError()
