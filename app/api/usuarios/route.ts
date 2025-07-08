import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const USUARIOS_FILE = path.join(process.cwd(), "data", "usuarios.json")

// Garantir que o diretório data existe
function ensureDataDirectory() {
  const dataDir = path.dirname(USUARIOS_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// GET - Carregar usuários
export async function GET() {
  try {
    ensureDataDirectory()

    // Se o arquivo não existir, criar com dados padrão
    if (!fs.existsSync(USUARIOS_FILE)) {
      const dadosPadrao = [
        { nome: "Ana", idade: 22 },
        { nome: "Carlos", idade: 17 },
        { nome: "Beatriz", idade: 30 },
      ]
      fs.writeFileSync(USUARIOS_FILE, JSON.stringify(dadosPadrao, null, 2))
    }

    const dados = fs.readFileSync(USUARIOS_FILE, "utf8")
    const usuarios = JSON.parse(dados)

    // Validar se é um array
    if (!Array.isArray(usuarios)) {
      throw new Error("Dados não são um array válido")
    }

    // Validar estrutura dos usuários
    for (const usuario of usuarios) {
      if (!usuario.nome || typeof usuario.idade !== "number") {
        throw new Error("Estrutura de usuário inválida")
      }
    }

    return NextResponse.json({
      usuarios,
      message: "Usuários carregados com sucesso",
    })
  } catch (error) {
    console.error("Erro ao carregar usuários:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno do servidor",
        usuarios: [],
      },
      { status: 500 },
    )
  }
}

// POST - Salvar usuários
export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory()

    const body = await request.json()
    const { usuarios } = body

    // Validações
    if (!usuarios || !Array.isArray(usuarios)) {
      return NextResponse.json({ error: "Dados devem ser um array de usuários" }, { status: 400 })
    }

    // Validar estrutura de cada usuário
    for (const usuario of usuarios) {
      if (!usuario.nome || typeof usuario.nome !== "string") {
        return NextResponse.json({ error: "Cada usuário deve ter um nome válido" }, { status: 400 })
      }

      if (typeof usuario.idade !== "number" || usuario.idade < 0) {
        return NextResponse.json({ error: "Cada usuário deve ter uma idade válida" }, { status: 400 })
      }
    }

    // Salvar arquivo
    fs.writeFileSync(USUARIOS_FILE, JSON.stringify(usuarios, null, 2))

    return NextResponse.json({
      message: "Usuários salvos com sucesso",
      count: usuarios.length,
    })
  } catch (error) {
    console.error("Erro ao salvar usuários:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno do servidor" },
      { status: 500 },
    )
  }
}
