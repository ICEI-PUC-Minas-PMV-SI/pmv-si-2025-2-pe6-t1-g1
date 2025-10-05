# APIs e Web Services

O planejamento de uma aplicação de APIS Web é uma etapa fundamental para o sucesso do projeto. Ao planejar adequadamente, você pode evitar muitos problemas e garantir que a sua API seja segura, escalável e eficiente.

Aqui estão algumas etapas importantes que devem ser consideradas no planejamento de uma aplicação de APIS Web.

[Inclua uma breve descrição do projeto.]

## Objetivos da API

A API tem o objetivo de permitir aos clientes criar e gerenciar pedidos, e permitir aos funcionários da pizzaria visualizar os pedidos que precisam preparar. Além disso, a API também conta com usuários adminstradores, que podem criar e apagar usuário e pedidos.


## Modelagem da Aplicação

A etapa de modelagem começou com a modelagem do banco de ados:
<img width="1026" height="941" alt="image" src="https://github.com/user-attachments/assets/2b257220-2d25-4ba0-878d-e77b39a71aba" />


## Tecnologias Utilizadas

- ASP .NET CORE
- sqlserver
- git


## API Endpoints

### 👤 Users

### POST `/user` – Criar usuário
**Acesso:** User

**Request (exemplo):**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "SenhaForte!234"
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "id": "123",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid email format", "statusCode": 400 }
```

**❌ 409 Conflict**
```json
{ "error": "User already exists", "statusCode": 409 }
```

**❌ 500 Internal Server Error**
```json
{ "error": "Unexpected error", "statusCode": 500 }
```

---

### GET `/user` – Buscar dados do próprio usuário
**Acesso:** User

**Responses:**

**✅ 200 OK**
```json
{
  "id": "123",
  "name": "João Silva",
  "email": "joao@email.com"
}
```

**❌ 401 Unauthorized**
```json
{ "error": "Invalid token", "statusCode": 401 }
```

**❌ 404 Not Found**
```json
{ "error": "User not found", "statusCode": 404 }
```

---

### PUT `/user` – Atualizar dados do próprio usuário
**Acesso:** User

**Request (exemplo):**
```json
{
  "name": "João Atualizado",
  "email": "joao.novo@email.com"
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "id": "123",
  "name": "João Atualizado",
  "email": "joao.novo@email.com"
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid request body", "statusCode": 400 }
```

**❌ 401 Unauthorized**
```json
{ "error": "Invalid token", "statusCode": 401 }
```

**❌ 500 Internal Server Error**
```json
{ "error": "Unexpected error", "statusCode": 500 }
```

---

### DELETE `/user` – Remover a própria conta
**Acesso:** User

**Responses:**

**✅ 204 No Content**

**❌ 401 Unauthorized**
```json
{ "error": "Invalid token", "statusCode": 401 }
```

**❌ 404 Not Found**
```json
{ "error": "User not found", "statusCode": 404 }
```

---

### POST `/user/login` – Autenticação
**Acesso:** Shared

**Request (exemplo):**
```json
{
  "email": "joao@email.com",
  "password": "SenhaForte!234"
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

**❌ 400 Bad Request**
```json
{ "error": "Missing email or password", "statusCode": 400 }
```

**❌ 401 Unauthorized**
```json
{ "error": "Invalid credentials", "statusCode": 401 }
```

---

### 📦 Items

### POST `/item` – Criar item
**Acesso:** Admin

**Request (exemplo):**
```json
{
  "name": "Pizza Calabresa",
  "description": "Calabresa, cebola, azeitona",
  "price": 45.00,
  "stock": 10
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "id": "1",
  "name": "Pizza Calabresa",
  "price": 45.00,
  "stock": 10
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid item data", "statusCode": 400 }
```

**❌ 500 Internal Server Error**
```json
{ "error": "Unexpected error", "statusCode": 500 }
```

---

### PUT `/item/:id` – Atualizar item
**Acesso:** Admin

**Request (exemplo):**
```json
{
  "name": "Pizza Calabresa Grande",
  "price": 52.00,
  "stock": 8
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "id": "1",
  "name": "Pizza Calabresa Grande",
  "price": 52.00,
  "stock": 8
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid item data", "statusCode": 400 }
```

**❌ 404 Not Found**
```json
{ "error": "Item not found", "statusCode": 404 }
```

---

### GET `/item` – Listar itens
**Acesso:** Admin

**Responses:**

**✅ 200 OK**
```json
[
  { "id": "1", "name": "Pizza Calabresa", "price": 45.00, "stock": 10 },
  { "id": "2", "name": "Pizza Marguerita", "price": 42.00, "stock": 5 }
]
```

**❌ 401 Unauthorized**
```json
{ "error": "Unauthorized", "statusCode": 401 }
```

---

### DELETE `/item/:id` – Remover item
**Acesso:** Admin

**Responses:**

**✅ 204 No Content**

**❌ 404 Not Found**
```json
{ "error": "Item not found", "statusCode": 404 }
```

---

### 🛒 Cart

### POST `/cart-item` – Adicionar item ao carrinho
**Acesso:** User

**Request (exemplo):**
```json
{
  "itemId": "2",
  "quantity": 1
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "cartItemId": "10",
  "itemId": "2",
  "name": "Pizza Marguerita",
  "quantity": 1,
  "price": 42.00,
  "subtotal": 42.00
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid cart item data", "statusCode": 400 }
```

**❌ 404 Not Found**
```json
{ "error": "Item not found", "statusCode": 404 }
```

---

### PUT `/cart-item/:id` – Atualizar item do carrinho
**Acesso:** User

**Request (exemplo):**
```json
{
  "quantity": 2
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "cartItemId": "10",
  "itemId": "2",
  "quantity": 2,
  "subtotal": 84.00
}
```

**❌ 404 Not Found**
```json
{ "error": "Cart item not found", "statusCode": 404 }
```

---

### GET `/cart-item` – Listar itens do carrinho
**Acesso:** User

**Responses:**

**✅ 200 OK**
```json
[
  { "cartItemId": "10", "itemId": "2", "name": "Pizza Marguerita", "quantity": 2, "price": 42.00 }
]
```

---

### DELETE `/cart-item/:id` – Remover item do carrinho
**Acesso:** User

**Responses:**

**✅ 204 No Content**

**❌ 404 Not Found**
```json
{ "error": "Cart item not found", "statusCode": 404 }
```

---

### 🧾 Orders

### POST `/order` – Criar pedido
**Acesso:** User

**Request (exemplo):**
```json
{
  "items": [
    { "itemId": "1", "quantity": 1 },
    { "itemId": "2", "quantity": 1 }
  ],
  "paymentMethod": "card",
  "addressId": "addr_123"
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "orderId": "999",
  "status": "pending",
  "items": [
    { "itemId": "1", "quantity": 1 },
    { "itemId": "2", "quantity": 1 }
  ]
}
```

**❌ 400 Bad Request**
```json
{ "error": "Invalid order data", "statusCode": 400 }
```

---

### GET `/order/:id` – Buscar pedido específico
**Acesso:** User

**Responses:**

**✅ 200 OK**
```json
{
  "orderId": "999",
  "status": "pending",
  "items": [
    { "itemId": "1", "quantity": 1 },
    { "itemId": "2", "quantity": 1 }
  ]
}
```

**❌ 404 Not Found**
```json
{ "error": "Order not found", "statusCode": 404 }
```

---

### DELETE `/order/:id` – Cancelar pedido
**Acesso:** User

**Responses:**

**✅ 204 No Content**

**❌ 404 Not Found**
```json
{ "error": "Order not found", "statusCode": 404 }
```

---

### GET `/orders` – Listar todos pedidos
**Acesso:** Admin/Employee

**Responses:**

**✅ 200 OK**
```json
[
  { "orderId": "999", "status": "pending", "userId": "123" },
  { "orderId": "1000", "status": "completed", "userId": "124" }
]
```

---

### PATCH `/cancel/:id` – Cancelar pedido (qualquer usuário)
**Acesso:** Admin/Employee/User

**Responses:**

**✅ 200 OK**
```json
{
  "orderId": "999",
  "status": "canceled"
}
```

**❌ 404 Not Found**
```json
{ "error": "Order not found", "statusCode": 404 }
```

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

Servidor de Aplicação
- Sistema Operacional: Windows.
- .NET SDK / Runtime: .NET 6.0 (x64).
- Memória mínima: 4 GB RAM.
- CPU: 2 núcleos.
- Armazenamento: 10 GB livre.

Banco de Dados
- Banco de dados SQL
- Usuário com permissões de criação e alteração de tabelas

3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 29/09/2025

| Responsável | Tarefa/Requisito                   | Iniciado em    | Prazo      | Status | Terminado em |
| :----       | :----                               | :----:        | :----:     | :----: | :----:       |
| Samuel      | Desenvolver endpoints de Users     | 22/09/2025    | 05/09/2025 | ✔️     | 05/09/2025   |
| Pedro       | Criar endpoints de Users/Admin     | 22/09/2025    | 29/09/2025 | 📝     |              |
| Victor      | Desenvolver endpoints de Items/Admin | 22/09/2025  | 29/09/2025 | ✔️     |  28/09/2025  |
| Luigi       | Criar endpoints de Cart/User       | 22/09/2025    | 29/09/2025 | 📝     |              |
| Vitor       | Criar endpoints de Orders          | 22/09/2025    | 29/09/2025 | ✔️     | 29/09/2025   |
| Bruno       | Setup da API + modelagem do banco + models  | 22/09/2025    | 24/09/2025 |  ✔️    | 24/09/2025   |


#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |                |
| Bruno         | Documentar APIs  |  29/09/20505   | 01/10/2025 | ⌛    |                |
| Bruno         | Documentar objetivo + modelagem |  29/09/20505   | 01/10/2025 | ⌛    |                |
| Victor.A       | Documentação de implantação  |  29/09/20505   | 01/10/2025 | ⌛    |                |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

