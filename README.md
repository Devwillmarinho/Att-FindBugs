# 🐛 Projeto de Debugging - Node.js

Este projeto demonstra técnicas avançadas de debugging em Node.js, mostrando como identificar, diagnosticar e corrigir bugs comuns.

## 📁 Estrutura do Projeto

\`\`\`
findbugs/
├── original-code/          # Código original com bugs
│   ├── app-with-bugs.js   # Aplicação com erros
│   └── users-invalid.js   # JSON inválido
├── corrected-code/        # Código corrigido
│   ├── app-fixed.js       # Aplicação corrigida
│   └── usuarios-valid.json # JSON válido
├── debugging-tools/       # Ferramentas de debugging
│   ├── vscode-debug-config.js
│   ├── breakpoint-demo.js
│   ├── console-debug.js
│   ├── error-handling.js
│   └── performance-debug.js
└── scripts/              # Scripts utilitários
    └── run-all-examples.js
\`\`\`

## 🐛 Bugs Identificados

### 1. **Variável Não Definida**
\`\`\`javascript
// ❌ ERRO
function exibirMensagem() {
  console.log(mensagem); // ReferenceError: mensagem is not defined
}

// ✅ CORREÇÃO
function exibirMensagem() {
  const mensagem = 'Sistema processado com sucesso!';
  console.log(mensagem);
}
\`\`\`

### 2. **JSON Inválido**
\`\`\`javascript
// ❌ ERRO
{ "nome": "Willian", idade: 22 }    // Propriedade sem aspas
{ "nome": Douglas, "idade": 17 } // Valor sem aspas

// ✅ CORREÇÃO
[
  { "nome": "Willian", "idade": 22 },
  { "nome": "Douglas", "idade": 17 }
]
\`\`\`

### 3. **Arquivo Não Encontrado**
\`\`\`javascript
// ❌ ERRO
fs.readFile('usuarios.json', callback); // Arquivo não existe

// ✅ CORREÇÃO
if (!fs.existsSync('usuarios.json')) {
  console.error('Arquivo não encontrado');
  return;
}
\`\`\`

## 🛠️ Ferramentas de Debugging Utilizadas

### 1. **VS Code Debugger**
- Configuração em `.vscode/launch.json`
- Breakpoints visuais
- Inspeção de variáveis
- Step-by-step debugging

### 2. **Node.js Inspector**
\`\`\`bash
# Executar com inspector
NODE_OPTIONS='--inspect' node app.js

# Ou com breakpoint automático
node --inspect-brk app.js
\`\`\`

### 3. **Chrome DevTools**
- Acessar `chrome://inspect`
- Debug remoto
- Performance profiling
- Memory analysis

### 4. **Console Debugging**
\`\`\`javascript
console.log()     // Log básico
console.table()   // Tabelas
console.group()   // Agrupamento
console.time()    // Medição de tempo
console.trace()   // Stack trace
console.assert()  // Validações
\`\`\`

## 🚀 Como Executar

### 1. **Código Original (com bugs)**
\`\`\`bash
node original-code/app-with-bugs.js
\`\`\`

### 2. **Código Corrigido**
\`\`\`bash
node corrected-code/app-fixed.js
\`\`\`

### 3. **Exemplos de Debugging**
\`\`\`bash
# Console debugging
node debugging-tools/console-debug.js

# Error handling
node debugging-tools/error-handling.js

# Performance debugging
node debugging-tools/performance-debug.js

# Breakpoint demo (com inspector)
node --inspect-brk debugging-tools/breakpoint-demo.js
\`\`\`

### 4. **Todos os Exemplos**
\`\`\`bash
node scripts/run-all-examples.js
\`\`\`

## 📊 Técnicas Demonstradas

### ✅ **Identificação de Bugs**
- Análise de stack traces
- Uso de breakpoints
- Logging estratégico
- Validação de tipos

### ✅ **Correção de Erros**
- Try/catch blocks
- Validação de entrada
- Tratamento de casos edge
- Error handling robusto

### ✅ **Performance Debugging**
- Medição de tempo
- Memory profiling
- Comparação de algoritmos
- I/O optimization

### ✅ **Debugging Avançado**
- Custom error classes
- Async/await debugging
- Event loop analysis
- Memory leak detection

## 🎯 Lições Aprendidas

1. **Sempre validar entrada de dados**
2. **Usar try/catch para operações que podem falhar**
3. **Implementar logging detalhado**
4. **Verificar existência de arquivos antes de acessar**
5. **Definir variáveis antes de usar**
6. **Usar ferramentas de debugging apropriadas**
7. **Monitorar performance e memória**
8. **Implementar tratamento de erros robusto**

## 🔧 Configuração do Ambiente

### VS Code Extensions Recomendadas:
- **Node.js Extension Pack**
- **JavaScript Debugger**
- **Error Lens**
- **Bracket Pair Colorizer**

### Configuração de Debug:
\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Node.js",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    }
  ]
}
\`\`\`

## 📚 Recursos Adicionais

- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools Documentation](https://developers.google.com/web/tools/chrome-devtools)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- 
![findbugspng](https://github.com/user-attachments/assets/70022905-7ef9-4f0e-ba2d-fa6843362cb4)



