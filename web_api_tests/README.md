# Web API Tests

Este projeto contém testes E2E (End-to-End) para a API da Pizzaria usando Cypress.

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- A Web API deve estar rodando em `http://localhost:5123`

## Instalação

```bash
npm install
```

## Executando os Testes

### Modo Headless (linha de comando)
```bash
npm test
```

### Modo Interativo (interface gráfica)
```bash
npm run test:open
```

### Executar apenas testes do Hello Controller
```bash
npm run test:hello
```

## Estrutura dos Testes

- `cypress/e2e/` - Contém os arquivos de teste
- `cypress/support/` - Comandos customizados e configurações
- `cypress/fixtures/` - Dados de teste estáticos

## Testes Implementados

### Hello Controller (`hello-controller.cy.js`)

1. **GET /api/hello**
   - Verifica se retorna a mensagem "Hello World from Pizzaria API!"
   - Valida headers da resposta

2. **GET /api/hello/welcome/{name}**
   - Testa mensagem personalizada de boas-vindas
   - Testa caracteres especiais no nome
   - Testa comportamento com nome vazio

3. **GET /api/hello/status**
   - Verifica informações de status da API
   - Valida estrutura da resposta JSON
   - Testa se o timestamp está próximo do tempo atual

4. **Testes de Erro**
   - Endpoints inexistentes (404)
   - Métodos HTTP não suportados (405)

5. **Testes de Performance**
   - Tempo de resposta
   - Requisições concorrentes

## Comandos Customizados

- `cy.getApiStatus()` - Busca status da API
- `cy.getHelloWorld()` - Busca mensagem hello world  
- `cy.getWelcomeMessage(name)` - Busca mensagem de boas-vindas
- `cy.apiRequest(method, url, body)` - Requisição HTTP genérica

## Configuração

O arquivo `cypress.config.js` contém as configurações principais:
- Base URL: `http://localhost:5123`
- Timeouts configurados para APIs
- Desabilitação de vídeos para performance

## Como Adicionar Novos Testes

1. Criar arquivo `.cy.js` em `cypress/e2e/`
2. Seguir padrão de nomenclatura: `nome-do-controller.cy.js`
3. Usar comandos customizados quando possível
4. Incluir testes de casos positivos e negativos
5. Adicionar testes de performance quando relevante