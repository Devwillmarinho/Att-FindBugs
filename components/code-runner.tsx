"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Square, RefreshCw, Terminal, Code2, Bug } from "lucide-react"

interface CodeExample {
  id: string
  title: string
  description: string
  code: string
  language: string
  category: "bug" | "fixed" | "demo"
}

export function CodeRunner() {
  const [runningCode, setRunningCode] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<Record<string, string[]>>({})

  const codeExamples: CodeExample[] = [
    {
      id: "bug-undefined-var",
      title: "🐛 Variável Não Definida",
      description: "Demonstra o erro de variável não definida",
      code: `function exibirMensagem() {
  console.log(mensagem); // ❌ ReferenceError
}

try {
  exibirMensagem();
} catch (error) {
  console.log("Erro capturado:", error.message);
}`,
      language: "javascript",
      category: "bug",
    },
    {
      id: "fix-undefined-var",
      title: "✅ Variável Definida",
      description: "Versão corrigida com variável definida",
      code: `function exibirMensagem() {
  const mensagem = "Sistema funcionando!"; // ✅ Definida
  console.log(mensagem);
  return mensagem;
}

const resultado = exibirMensagem();
console.log("Resultado:", resultado);`,
      language: "javascript",
      category: "fixed",
    },
    {
      id: "bug-invalid-json",
      title: "🐛 JSON Inválido",
      description: "Demonstra erro de parsing de JSON",
      code: `const jsonInvalido = '{ nome: "Ana", idade: 22 }'; // ❌ Sem aspas

try {
  const objeto = JSON.parse(jsonInvalido);
  console.log("Objeto:", objeto);
} catch (error) {
  console.log("❌ Erro de JSON:", error.message);
  console.log("💡 Solução: Usar aspas duplas em todas as propriedades");
}`,
      language: "javascript",
      category: "bug",
    },
    {
      id: "fix-valid-json",
      title: "✅ JSON Válido",
      description: "Versão corrigida com JSON válido",
      code: `const jsonValido = '{"nome": "Ana", "idade": 22}'; // ✅ Aspas corretas

try {
  const objeto = JSON.parse(jsonValido);
  console.log("✅ Objeto parseado:", objeto);
  console.log("Nome:", objeto.nome);
  console.log("Idade:", objeto.idade);
} catch (error) {
  console.log("Erro:", error.message);
}`,
      language: "javascript",
      category: "fixed",
    },
    {
      id: "demo-debugging",
      title: "🔍 Técnicas de Debug",
      description: "Demonstra várias técnicas de debugging",
      code: `console.log("=== TÉCNICAS DE DEBUGGING ===");

// 1. Console.table para arrays
const usuarios = [
  {nome: "Ana", idade: 22},
  {nome: "Carlos", idade: 17}
];

console.table(usuarios);

// 2. Console.time para performance
console.time("Processamento");
const maiores = usuarios.filter(u => u.idade > 18);
console.timeEnd("Processamento");

// 3. Console.group para organização
console.group("Resultados");
console.log("Total:", usuarios.length);
console.log("Maiores de idade:", maiores.length);
console.groupEnd();

// 4. Console.assert para validação
console.assert(maiores.length > 0, "Deve haver usuários maiores de idade");`,
      language: "javascript",
      category: "demo",
    },
  ]

  const executeCode = async (codeId: string) => {
    setRunningCode(codeId)
    const example = codeExamples.find((e) => e.id === codeId)

    if (!example) return

    // Simular execução do código
    const output: string[] = []

    try {
      // Simular delay de execução
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simular diferentes outputs baseados no código
      switch (codeId) {
        case "bug-undefined-var":
          output.push("❌ Erro capturado: mensagem is not defined")
          break

        case "fix-undefined-var":
          output.push("Sistema funcionando!")
          output.push("Resultado: Sistema funcionando!")
          break

        case "bug-invalid-json":
          output.push("❌ Erro de JSON: Unexpected token n in JSON at position 2")
          output.push("💡 Solução: Usar aspas duplas em todas as propriedades")
          break

        case "fix-valid-json":
          output.push("✅ Objeto parseado: {nome: 'Ana', idade: 22}")
          output.push("Nome: Ana")
          output.push("Idade: 22")
          break

        case "demo-debugging":
          output.push("=== TÉCNICAS DE DEBUGGING ===")
          output.push("┌─────────┬─────────┬───────┐")
          output.push("│ (index) │  nome   │ idade │")
          output.push("├─────────┼─────────┼───────┤")
          output.push("│    0    │  'Ana'  │  22   │")
          output.push("│    1    │ 'Carlos'│  17   │")
          output.push("└─────────┴─────────┴───────┘")
          output.push("Processamento: 0.123ms")
          output.push("▼ Resultados")
          output.push("  Total: 2")
          output.push("  Maiores de idade: 1")
          break
      }

      setOutputs((prev) => ({ ...prev, [codeId]: output }))
    } catch (error) {
      output.push(`❌ Erro na execução: ${error}`)
      setOutputs((prev) => ({ ...prev, [codeId]: output }))
    } finally {
      setRunningCode(null)
    }
  }

  const clearOutput = (codeId: string) => {
    setOutputs((prev) => {
      const newOutputs = { ...prev }
      delete newOutputs[codeId]
      return newOutputs
    })
  }

  const getCategoryColor = (category: CodeExample["category"]) => {
    switch (category) {
      case "bug":
        return "bg-red-50 border-red-200"
      case "fixed":
        return "bg-green-50 border-green-200"
      case "demo":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getCategoryBadge = (category: CodeExample["category"]) => {
    switch (category) {
      case "bug":
        return (
          <Badge variant="destructive" className="text-xs">
            BUG
          </Badge>
        )
      case "fixed":
        return (
          <Badge variant="default" className="text-xs bg-green-600">
            FIXED
          </Badge>
        )
      case "demo":
        return (
          <Badge variant="secondary" className="text-xs">
            DEMO
          </Badge>
        )
    }
  }

  const bugExamples = codeExamples.filter((e) => e.category === "bug")
  const fixedExamples = codeExamples.filter((e) => e.category === "fixed")
  const demoExamples = codeExamples.filter((e) => e.category === "demo")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="bugs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bugs" className="flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Códigos com Bugs
          </TabsTrigger>
          <TabsTrigger value="fixed" className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Códigos Corrigidos
          </TabsTrigger>
          <TabsTrigger value="demos" className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Demonstrações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bugs" className="space-y-4">
          <div className="grid gap-4">
            {bugExamples.map((example) => (
              <Card key={example.id} className={getCategoryColor(example.category)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {example.title}
                      {getCategoryBadge(example.category)}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => executeCode(example.id)}
                        disabled={runningCode === example.id}
                        className="flex items-center gap-1"
                      >
                        {runningCode === example.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        {runningCode === example.id ? "Executando..." : "Executar"}
                      </Button>
                      {outputs[example.id] && (
                        <Button size="sm" variant="outline" onClick={() => clearOutput(example.id)}>
                          <Square className="h-3 w-3" />
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{example.code}</pre>
                  </div>

                  {outputs[example.id] && (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium text-sm">Output:</span>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="font-mono text-sm space-y-1">
                          {outputs[example.id].map((line, index) => (
                            <div key={index} className="text-gray-800">
                              {line}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fixed" className="space-y-4">
          <div className="grid gap-4">
            {fixedExamples.map((example) => (
              <Card key={example.id} className={getCategoryColor(example.category)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {example.title}
                      {getCategoryBadge(example.category)}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => executeCode(example.id)}
                        disabled={runningCode === example.id}
                        className="flex items-center gap-1"
                      >
                        {runningCode === example.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        {runningCode === example.id ? "Executando..." : "Executar"}
                      </Button>
                      {outputs[example.id] && (
                        <Button size="sm" variant="outline" onClick={() => clearOutput(example.id)}>
                          <Square className="h-3 w-3" />
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{example.code}</pre>
                  </div>

                  {outputs[example.id] && (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium text-sm">Output:</span>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="font-mono text-sm space-y-1">
                          {outputs[example.id].map((line, index) => (
                            <div key={index} className="text-gray-800">
                              {line}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demos" className="space-y-4">
          <div className="grid gap-4">
            {demoExamples.map((example) => (
              <Card key={example.id} className={getCategoryColor(example.category)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {example.title}
                      {getCategoryBadge(example.category)}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => executeCode(example.id)}
                        disabled={runningCode === example.id}
                        className="flex items-center gap-1"
                      >
                        {runningCode === example.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        {runningCode === example.id ? "Executando..." : "Executar"}
                      </Button>
                      {outputs[example.id] && (
                        <Button size="sm" variant="outline" onClick={() => clearOutput(example.id)}>
                          <Square className="h-3 w-3" />
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{example.code}</pre>
                  </div>

                  {outputs[example.id] && (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium text-sm">Output:</span>
                      </div>
                      <ScrollArea className="h-32">
                        <div className="font-mono text-sm space-y-1">
                          {outputs[example.id].map((line, index) => (
                            <div key={index} className="text-gray-800">
                              {line}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
