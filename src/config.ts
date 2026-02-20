export const config = {
  // Configuração da Evolution API
  evolutionApi: {
    baseUrl: process.env.EVOLUTION_API_URL || "",
    apiKey: process.env.EVOLUTION_API_KEY || "",
    instanceId: process.env.EVOLUTION_API_INSTANCE || ""
  },
  // Configuração do servidor MCP
  mcp: {
    name: "Evolution API Server",
    version: "1.0.0"
  }
};

const REQUIRED_ENV_VARS: Array<{ env: string; configKey: keyof typeof config.evolutionApi }> = [
  { env: "EVOLUTION_API_URL", configKey: "baseUrl" },
  { env: "EVOLUTION_API_KEY", configKey: "apiKey" },
  { env: "EVOLUTION_API_INSTANCE", configKey: "instanceId" },
];

export function validateConfig(): void {
  const missing = REQUIRED_ENV_VARS
    .filter(({ configKey }) => !config.evolutionApi[configKey])
    .map(({ env }) => env);

  if (missing.length > 0) {
    console.error(`\n[MCP Evolution API] Variáveis de ambiente obrigatórias não definidas:\n`);
    missing.forEach(v => console.error(`  - ${v}`));
    console.error(`\nCopie .env.example para .env e preencha os valores.\n`);
    process.exit(1);
  }
}
