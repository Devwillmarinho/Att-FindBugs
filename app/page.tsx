"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Bug,
  Play,
  FileText,
  AlertTriangle,
  CheckCircle,
  Code,
  Terminal,
  Zap,
  RefreshCw,
  Eye,
  Settings,
} from "lucide-react"

interface Usuario {
  nome: string
  idade: number
}

interface LogEntry {
  timestamp: string
  level: "info" | "error" | "success" | "debug" | "warning"
  message: string
  code?: string
}

interface CodeExecution {
  id: string
  name: string
  description: string
  code: string
  hasBugs: boolean
  expectedOutput?: string[]
  actualOutput: string[]
  status: "idle" | "running" | "success" | "error"
  executionTime?: number
}

export default function DebugApp() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [jsonInput, setJsonInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [executions, setExecutions] = useState<CodeExecution[]>([])
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null)

  const codeExamples: CodeExecution[] = [
    {
      id: "original-bugs",
      name: "🐛 Código Original (Com Bugs)",
      description: "Executa o código original que contém os bugs identificados",
      code: `function exibirMensagem() {
  console.log(mensagem); // ❌ Variável não definida
}

function processarJSON() {
  const dados = '{ nome: "Ana", idade: 22 }'; // ❌ JSON inválido
  return JSON.parse(dados);
}

function lerArquivo() {
  // ❌ Arquivo não existe
  return fs.readFileSync('arquivo-inexistente.json');
}`,
      hasBugs: true,
      expectedOutput: ["❌ ReferenceError: mensagem is not defined"],
      actualOutput: [],
      status: "idle",
    },
    {
      id: "fixed-code",
      name: "✅ Código Corrigido",
      description: "Versão corrigida do código sem bugs",
      code: `function exibirMensagem() {
  const mensagem = "Sistema processado com sucesso!"; // ✅ Variável definida
  console.log(mensagem);
  return mensagem;
}

function processarJSON() {
  const dados = '{"nome": "Ana", "idade": 22}'; // ✅ JSON válido
  return JSON.parse(dados);
}

function lerArquivo() {
  // ✅ Verificação de existência
  if (typeof window === 'undefined') {
    return { erro: "Ambiente de servidor" };
  }
  return { dados: "Arquivo simulado" };
}`,
      hasBugs: false,
      expectedOutput: ["✅ Sistema processado com sucesso!"],
      actualOutput: [],
      status: "idle",
    },
    {
      id: "filter-demo",
      name: "🔍 Demonstração de Filtro",
      description: "Mostra o processo de filtrar usuários maiores de idade",
      code: `function filtrarUsuarios(usuarios) {
  console.log("🔍 Iniciando filtro...");
  console.log("📊 Total de usuários:", usuarios.length);
  
  const resultado = usuarios.filter(usuario => {
    console.log(\`Verificando: \${usuario.nome} (\${usuario.idade} anos)\`);
    return usuario.idade > 18;
  });
  
  console.log("✅ Usuários maiores de idade:", resultado.length);
  return resultado;
}`,
      hasBugs: false,
      expectedOutput: ["🔍 Iniciando filtro...", "✅ Usuários maiores de idade: 3"],
      actualOutput: [],
      status: "idle",
    },
    {
      id: "error-handling",
      name: "🛡️ Tratamento de Erros",
      description: "Demonstra como capturar e tratar erros adequadamente",
      code: `function exemploTryCatch() {
  try {
    console.log("🔄 Tentando processar JSON...");
    const jsonInvalido = '{ nome: "Ana", idade: 22 }';
    const objeto = JSON.parse(jsonInvalido);
    console.log("✅ Sucesso:", objeto);
  } catch (error) {
    console.log("❌ Erro capturado:", error.message);
    console.log("💡 Tipo do erro:", error.name);
    console.log("🔧 Solução: Verificar sintaxe do JSON");
  }
}`,
      hasBugs: false,
      expectedOutput: ["❌ Erro capturado: Unexpected token n in JSON"],
      actualOutput: [],
      status: "idle",
    },
    {
      id: "performance-test",
      name: "⚡ Teste de Performance",
      description: "Mede o tempo de execução de diferentes operações",
      code: `function testePerformance() {
  console.log("⏱️ Iniciando teste de performance...");
  
  const inicio = performance.now();
  
  // Simular processamento
  const numeros = Array.from({length: 10000}, (_, i) => i);
  const pares = numeros.filter(n => n % 2 === 0);
  
  const fim = performance.now();
  const tempo = (fim - inicio).toFixed(2);
  
  console.log(\`⚡ Processamento concluído em \${tempo}ms\`);
  console.log(\`📊 Resultado: \${pares.length} números pares\`);
  
  return { tempo, resultado: pares.length };
}`,
      hasBugs: false,
      expectedOutput: ["⚡ Processamento concluído em", "📊 Resultado: 5000 números pares"],
      actualOutput: [],
      status: "idle",
    },
  ]

  useEffect(() => {
    setExecutions(codeExamples)
    carregarUsuarios()
  }, [])

  const addLog = (level: LogEntry["level"], message: string, code?: string) => {
    const newLog: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      code,
    }
    setLogs((prev) => [...prev, newLog])
  }

  const executeCode = async (executionId: string) => {
    setExecutions((prev) =>
      prev.map((exec) => (exec.id === executionId ? { ...exec, status: "running", actualOutput: [] } : exec)),
    )

    addLog("info", `🚀 Executando: ${codeExamples.find((e) => e.id === executionId)?.name}`)

    const startTime = performance.now()

    try {
      // Simular execução do código
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let output: string[] = []
      let status: "success" | "error" = "success"

      switch (executionId) {
        case "original-bugs":
          output = [
            "❌ ReferenceError: mensagem is not defined",
            "❌ SyntaxError: Unexpected token n in JSON at position 2",
            "❌ Error: ENOENT: no such file or directory",
          ]
          status = "error"
          addLog("error", "Código executado com erros (como esperado)")
          break

        case "fixed-code":
          output = [
            "✅ Sistema processado com sucesso!",
            "✅ JSON parseado: {nome: 'Ana', idade: 22}",
            "✅ Arquivo verificado com segurança",
          ]
          addLog("success", "Código executado sem erros!")
          break

        case "filter-demo":
          const usuariosDemo = [
            { nome: "Ana", idade: 22 },
            { nome: "Carlos", idade: 17 },
            { nome: "Beatriz", idade: 30 },
            { nome: "Diego", idade: 16 },
          ]

          output = [
            "🔍 Iniciando filtro...",
            `📊 Total de usuários: ${usuariosDemo.length}`,
            ...usuariosDemo.map((u) => `Verificando: ${u.nome} (${u.idade} anos)`),
            `✅ Usuários maiores de idade: ${usuariosDemo.filter((u) => u.idade > 18).length}`,
          ]
          addLog("success", "Filtro executado com sucesso")
          break

        case "error-handling":
          output = [
            "🔄 Tentando processar JSON...",
            "❌ Erro capturado: Unexpected token n in JSON at position 2",
            "💡 Tipo do erro: SyntaxError",
            "🔧 Solução: Verificar sintaxe do JSON",
          ]
          addLog("success", "Erro tratado adequadamente")
          break

        case "performance-test":
          const tempo = (Math.random() * 10 + 1).toFixed(2)
          output = [
            "⏱️ Iniciando teste de performance...",
            `⚡ Processamento concluído em ${tempo}ms`,
            "📊 Resultado: 5000 números pares",
          ]
          addLog("success", `Performance medida: ${tempo}ms`)
          break
      }

      const endTime = performance.now()
      const executionTime = endTime - startTime

      setExecutions((prev) =>
        prev.map((exec) => (exec.id === executionId ? { ...exec, status, actualOutput: output, executionTime } : exec)),
      )

      addLog("info", `⏱️ Execução concluída em ${executionTime.toFixed(2)}ms`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

      setExecutions((prev) =>
        prev.map((exec) =>
          exec.id === executionId ? { ...exec, status: "error", actualOutput: [`❌ Erro: ${errorMessage}`] } : exec,
        ),
      )

      addLog("error", `❌ Erro na execução: ${errorMessage}`)
    }
  }

  const carregarUsuarios = async () => {
    setIsLoading(true)
    setError(null)
    addLog("info", "🔍 Iniciando carregamento de usuários...")

    try {
      const response = await fetch("/api/usuarios")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao carregar usuários")
      }

      addLog("success", `✅ ${data.usuarios.length} usuários carregados com sucesso`)
      setUsuarios(data.usuarios)
      filtrarUsuarios(data.usuarios)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido"
      addLog("error", `❌ Erro: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const filtrarUsuarios = (lista: Usuario[]) => {
    addLog("debug", "🔍 Filtrando usuários maiores de 18 anos...")

    if (!Array.isArray(lista)) {
      addLog("error", "❌ Erro: dados não são um array válido")
      return
    }

    const resultado = lista.filter((usuario) => {
      addLog("debug", `🔍 Verificando: ${usuario.nome} (${usuario.idade} anos)`)
      return usuario.idade > 18
    })

    addLog("success", `✅ ${resultado.length} usuários maiores de idade encontrados`)
    setUsuariosFiltrados(resultado)
  }

  const salvarUsuarios = async () => {
    setIsLoading(true)
    setError(null)
    addLog("info", "💾 Salvando dados de usuários...")

    try {
      const usuariosParseados = JSON.parse(jsonInput)

      if (!Array.isArray(usuariosParseados)) {
        throw new Error("Os dados devem ser um array de usuários")
      }

      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarios: usuariosParseados }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar usuários")
      }

      addLog("success", "✅ Dados salvos com sucesso!")
      await carregarUsuarios()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao processar JSON"
      addLog("error", `❌ Erro: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const limparLogs = () => {
    setLogs([])
    addLog("info", "🧹 Logs limpos")
  }

  const getLogIcon = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "debug":
        return <Bug className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      case "success":
        return "text-green-600 bg-green-50 border-green-200"
      case "debug":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getExecutionStatusIcon = (status: CodeExecution["status"]) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Bug className="h-8 w-8 text-blue-600" />
            Sistema de Debugging Interativo
          </h1>
          <p className="text-gray-600">Execute códigos em tempo real e veja o debugging em ação</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="execucao" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="execucao" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Execução de Código
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Editor JSON
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Bug className="h-4 w-4" />
              Debug Logs
            </TabsTrigger>
          </TabsList>

          {/* Tab Execução de Código */}
          <TabsContent value="execucao" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Lista de Códigos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Exemplos de Código
                  </CardTitle>
                  <CardDescription>Clique nos botões para executar diferentes exemplos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {executions.map((execution) => (
                    <div key={execution.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{execution.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">{execution.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {execution.executionTime && (
                            <Badge variant="outline" className="text-xs">
                              {execution.executionTime.toFixed(0)}ms
                            </Badge>
                          )}
                          {getExecutionStatusIcon(execution.status)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => executeCode(execution.id)}
                          disabled={execution.status === "running"}
                          className="flex items-center gap-1"
                        >
                          {execution.status === "running" ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                          {execution.status === "running" ? "Executando..." : "Executar"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedExecution(selectedExecution === execution.id ? null : execution.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          {selectedExecution === execution.id ? "Ocultar" : "Ver Código"}
                        </Button>
                      </div>

                      {/* Código */}
                      {selectedExecution === execution.id && (
                        <div className="mt-3">
                          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
                            <pre>{execution.code}</pre>
                          </div>
                        </div>
                      )}

                      {/* Output */}
                      {execution.actualOutput.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                            <Terminal className="h-3 w-3" />
                            Output:
                          </h4>
                          <div
                            className={`border rounded p-3 text-sm font-mono space-y-1 ${
                              execution.status === "error" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
                            }`}
                          >
                            {execution.actualOutput.map((line, index) => (
                              <div key={index} className="text-xs">
                                {line}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Painel de Controle */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Painel de Controle
                  </CardTitle>
                  <CardDescription>Controles e estatísticas de execução</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Estatísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {executions.filter((e) => e.status === "success").length}
                      </div>
                      <div className="text-xs text-blue-600">Sucessos</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {executions.filter((e) => e.status === "error").length}
                      </div>
                      <div className="text-xs text-red-600">Erros</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Ações Rápidas */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Ações Rápidas:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executions.forEach((e) => executeCode(e.id))}
                        className="flex items-center gap-2"
                      >
                        <Zap className="h-3 w-3" />
                        Executar Todos
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setExecutions((prev) =>
                            prev.map((e) => ({
                              ...e,
                              status: "idle" as const,
                              actualOutput: [],
                              executionTime: undefined,
                            })),
                          )
                        }}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Resetar Tudo
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Tempo Médio */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Tempo Médio de Execução</div>
                    <div className="text-lg font-bold text-gray-900">
                      {executions.filter((e) => e.executionTime).length > 0
                        ? `${(
                            executions
                              .filter((e) => e.executionTime)
                              .reduce((acc, e) => acc + (e.executionTime || 0), 0) /
                              executions.filter((e) => e.executionTime).length
                          ).toFixed(0)}ms`
                        : "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Usuários */}
          <TabsContent value="usuarios" className="space-y-4">
            <div className="flex gap-4 justify-center">
              <Button onClick={carregarUsuarios} disabled={isLoading} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                {isLoading ? "Carregando..." : "Recarregar Usuários"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Todos os Usuários */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Todos os Usuários
                  </CardTitle>
                  <CardDescription>Lista completa de usuários carregados do arquivo JSON</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usuarios.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum usuário carregado</p>
                    ) : (
                      usuarios.map((usuario, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{usuario.nome}</span>
                          <Badge variant={usuario.idade > 18 ? "default" : "secondary"}>{usuario.idade} anos</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Usuários Filtrados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Maiores de Idade
                  </CardTitle>
                  <CardDescription>Usuários filtrados (idade {">"} 18 anos)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usuariosFiltrados.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum usuário maior de idade</p>
                    ) : (
                      usuariosFiltrados.map((usuario, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="font-medium">{usuario.nome}</span>
                          <Badge className="bg-green-600">{usuario.idade} anos</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Editor */}
          <TabsContent value="editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Editor de Dados JSON
                </CardTitle>
                <CardDescription>Edite os dados dos usuários em formato JSON</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder='[{"nome": "Ana", "idade": 22}, {"nome": "Carlos", "idade": 17}]'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
                <div className="flex gap-2">
                  <Button onClick={salvarUsuarios} disabled={isLoading || !jsonInput.trim()}>
                    💾 Salvar Dados
                  </Button>
                  <Button variant="outline" onClick={() => setJsonInput(JSON.stringify(usuarios, null, 2))}>
                    📋 Carregar Dados Atuais
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Logs */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5" />
                    Debug Logs
                  </CardTitle>
                  <CardDescription>Logs em tempo real do processo de debugging</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={limparLogs}>
                  🧹 Limpar
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <div className="space-y-2">
                    {logs.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">Nenhum log disponível</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className={`border rounded-lg p-3 ${getLogColor(log.level)}`}>
                          <div className="flex items-start gap-3">
                            {getLogIcon(log.level)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-mono text-xs opacity-70">{log.timestamp}</span>
                                <Badge variant="outline" className="text-xs">
                                  {log.level.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="mt-1 font-mono text-sm break-words">{log.message}</p>
                              {log.code && (
                                <div className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                                  {log.code}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
