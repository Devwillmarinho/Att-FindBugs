"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Bug, Info, AlertTriangle, CheckCircle } from "lucide-react"

interface DebugStep {
  id: string
  title: string
  description: string
  code: string
  status: "pending" | "running" | "success" | "error"
  output?: string
  variables?: Record<string, any>
}

export function DebugPanel() {
  const [steps, setSteps] = useState<DebugStep[]>([
    {
      id: "1",
      title: "Carregar arquivo JSON",
      description: "Tentativa de ler o arquivo usuarios.json",
      code: 'fs.readFile("usuarios.json", "utf8", callback)',
      status: "pending",
    },
    {
      id: "2",
      title: "Parse do JSON",
      description: "Converter string JSON em objeto JavaScript",
      code: "const usuarios = JSON.parse(dados)",
      status: "pending",
    },
    {
      id: "3",
      title: "Filtrar usuários",
      description: "Aplicar filtro de idade > 18",
      code: "usuarios.filter(u => u.idade > 18)",
      status: "pending",
    },
    {
      id: "4",
      title: "Exibir mensagem",
      description: "Mostrar mensagem de conclusão",
      code: "console.log(mensagem)",
      status: "pending",
    },
  ])

  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set())

  const toggleStep = (stepId: string) => {
    const newOpenSteps = new Set(openSteps)
    if (newOpenSteps.has(stepId)) {
      newOpenSteps.delete(stepId)
    } else {
      newOpenSteps.add(stepId)
    }
    setOpenSteps(newOpenSteps)
  }

  const runDebugStep = async (stepId: string) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status: "running" } : step)))

    // Simular execução com delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simular resultados baseados no step
    const stepResults: Record<string, Partial<DebugStep>> = {
      "1": {
        status: "success",
        output: "Arquivo carregado com sucesso",
        variables: { dados: '[{"nome":"Ana","idade":22}...]' },
      },
      "2": {
        status: "success",
        output: "JSON parseado com sucesso",
        variables: { usuarios: [{ nome: "Ana", idade: 22 }] },
      },
      "3": {
        status: "success",
        output: "2 usuários encontrados",
        variables: { resultado: [{ nome: "Ana", idade: 22 }] },
      },
      "4": {
        status: "error",
        output: "ReferenceError: mensagem is not defined",
        variables: { mensagem: "undefined" },
      },
    }

    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, ...stepResults[stepId] } : step)))
  }

  const getStatusIcon = (status: DebugStep["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "running":
        return <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default:
        return <Info className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: DebugStep["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "running":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Painel de Debugging Interativo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className={`border rounded-lg p-4 ${getStatusColor(step.status)}`}>
                <Collapsible open={openSteps.has(step.id)} onOpenChange={() => toggleStep(step.id)}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <div className="text-left">
                        <h3 className="font-medium">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={step.status === "error" ? "destructive" : "default"}>{step.status}</Badge>
                      {openSteps.has(step.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-4 space-y-3">
                    <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">{step.code}</div>

                    {step.output && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-sm mb-2">Output:</h4>
                        <p className="font-mono text-sm">{step.output}</p>
                      </div>
                    )}

                    {step.variables && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-sm mb-2">Variáveis:</h4>
                        <div className="space-y-1">
                          {Object.entries(step.variables).map(([key, value]) => (
                            <div key={key} className="flex gap-2 font-mono text-sm">
                              <span className="text-blue-600">{key}:</span>
                              <span className="text-gray-800">{JSON.stringify(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button size="sm" onClick={() => runDebugStep(step.id)} disabled={step.status === "running"}>
                      {step.status === "running" ? "Executando..." : "Executar Step"}
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
