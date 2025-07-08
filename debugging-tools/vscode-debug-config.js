// Configuração para debugging no VS Code
// Arquivo: .vscode/launch.json

const vsCodeConfig = {
  version: "0.2.0",
  configurations: [
    {
      name: "Debug Node.js App",
      type: "node",
      request: "launch",
      program: "${workspaceFolder}/app.js",
      console: "integratedTerminal",
      skipFiles: ["<node_internals>/**"],
    },
    {
      name: "Debug with Inspector",
      type: "node",
      request: "launch",
      program: "${workspaceFolder}/app.js",
      runtimeArgs: ["--inspect"],
      console: "integratedTerminal",
    },
  ],
}

console.log("📋 Configuração VS Code Debug:")
console.log(JSON.stringify(vsCodeConfig, null, 2))
