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

### POST `/api/user` – Criar usuário (Registrar)
**Acesso:** Público

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "SenhaForte!234",
  "phone": "11999999999"
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "id": 123,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "createdAt": "2025-10-05T19:30:00.000Z",
  "role": "USER"
}
```

**❌ 400 Bad Request**
```json
{ "message": "User with this email already exists" }
```

---

### POST `/api/user/login` – Autenticação
**Acesso:** Público

**Request:**
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
  "user": {
    "id": 123,
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "createdAt": "2025-10-05T19:30:00.000Z",
    "role": "USER"
  }
}
```

**❌ 401 Unauthorized**
```json
{ "message": "Invalid credentials" }
```

---

### GET `/api/user` – Buscar dados do próprio usuário
**Acesso:** Usuário autenticado
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 200 OK**
```json
{
  "id": 123,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "createdAt": "2025-10-05T19:30:00.000Z",
  "role": "USER"
}
```

**❌ 401 Unauthorized**
```json
{ "message": "Unauthorized" }
```

---

### PUT `/api/user` – Atualizar dados do próprio usuário
**Acesso:** Usuário autenticado
**Header:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "João Silva Atualizado",
  "phone": "11888888888",
  "password": "NovaSenha!456"
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "id": 123,
  "name": "João Silva Atualizado",
  "email": "joao@email.com",
  "phone": "11888888888",
  "createdAt": "2025-10-05T19:30:00.000Z",
  "role": "USER"
}
```

---

### DELETE `/api/user` – Remover a própria conta
**Acesso:** Usuário autenticado
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 204 No Content**

---

### GET `/api/user/{id}` – Buscar usuário por ID
**Acesso:** Admin
**Header:** `Authorization: Bearer {admin_token}`

**Responses:**

**✅ 200 OK**
```json
{
  "id": 123,
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11999999999",
  "createdAt": "2025-10-05T19:30:00.000Z",
  "role": "USER"
}
```

---

### 📦 Items

### POST `/api/items` – Criar item
**Acesso:** Admin
**Header:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "nameItem": "Pizza Calabresa",
  "description": "Pizza com calabresa, cebola e azeitona",
  "value": 45.90,
  "category": "Pizza"
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "id": 1,
  "nameItem": "Pizza Calabresa",
  "description": "Pizza com calabresa, cebola e azeitona",
  "value": 45.90,
  "category": "Pizza"
}
```

**❌ 400 Bad Request**
```json
{ "message": "Erro ao criar item", "error": "..." }
```

---

### GET `/api/items` – Listar todos os itens
**Acesso:** Público

**Responses:**

**✅ 200 OK**
```json
[
  {
    "id": 1,
    "nameItem": "Pizza Calabresa",
    "description": "Pizza com calabresa, cebola e azeitona",
    "value": 45.90,
    "category": "Pizza"
  },
  {
    "id": 2,
    "nameItem": "Pizza Margherita",
    "description": "Pizza com molho de tomate, mussarela e manjericão",
    "value": 42.90,
    "category": "Pizza"
  }
]
```

---

### GET `/api/items/{id}` – Buscar item por ID
**Acesso:** Público

**Responses:**

**✅ 200 OK**
```json
{
  "id": 1,
  "nameItem": "Pizza Calabresa",
  "description": "Pizza com calabresa, cebola e azeitona",
  "value": 45.90,
  "category": "Pizza"
}
```

**❌ 404 Not Found**
```json
{ "message": "Item não encontrado" }
```

---

### GET `/api/items/search` – Buscar itens
**Acesso:** Público
**Query Parameters:** `?query=Pizza&category=Pizza`

**Responses:**

**✅ 200 OK**
```json
[
  {
    "id": 1,
    "nameItem": "Pizza Calabresa",
    "description": "Pizza com calabresa, cebola e azeitona",
    "value": 45.90,
    "category": "Pizza"
  }
]
```

---

### PUT `/api/items/{id}` – Atualizar item
**Acesso:** Admin
**Header:** `Authorization: Bearer {admin_token}`

**Request:**
```json
{
  "id": 1,
  "nameItem": "Pizza Calabresa Grande",
  "description": "Pizza grande com calabresa, cebola e azeitona",
  "value": 52.90,
  "category": "Pizza"
}
```

**Responses:**

**✅ 200 OK**
```json
{
  "id": 1,
  "nameItem": "Pizza Calabresa Grande",
  "description": "Pizza grande com calabresa, cebola e azeitona",
  "value": 52.90,
  "category": "Pizza"
}
```

---

### DELETE `/api/items/{id}` – Remover item
**Acesso:** Admin
**Header:** `Authorization: Bearer {admin_token}`

**Responses:**

**✅ 200 OK**
```json
{ "message": "Item removido com sucesso" }
```

---

### 🛒 Cart

### POST `/api/cart/item` – Adicionar item ao carrinho
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "itemId": 2,
  "quantity": 1
}
```

**Responses:**

**✅ 201 Created**
```json
{
  "id": 10,
  "userId": 123,
  "itemId": 2,
  "quantity": 1
}
```

**❌ 404 Not Found**
```json
{ "message": "Item não encontrado" }
```

---

### GET `/api/cart` – Listar itens do carrinho
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 200 OK**
```json
[
  {
    "id": 10,
    "itemId": 2,
    "itemName": "Pizza Margherita",
    "itemPrice": 42.90,
    "quantity": 2,
    "totalPrice": 85.80
  }
]
```

---

### PUT `/api/cart/item/{id}` – Atualizar item do carrinho
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "quantity": 3
}
```

**Responses:**

**✅ 200 OK**
```json
{ "message": "Item do carrinho atualizado com sucesso" }
```

**❌ 404 Not Found**
```json
{ "message": "Item do carrinho não encontrado" }
```

---

### DELETE `/api/cart/item/{id}` – Remover item do carrinho
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 200 OK**
```json
{ "message": "Item removido do carrinho com sucesso" }
```

---

### DELETE `/api/cart/clear` – Limpar carrinho
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 204 No Content**

---

### 🧾 Orders

### POST `/api/orders` – Criar pedido (a partir do carrinho)
**Acesso:** User
**Header:** `Authorization: Bearer {token}`

**Request:** Sem body (usa itens do carrinho)

**Responses:**

**✅ 201 Created**
```json
{
  "id": 999,
  "userId": 123,
  "enderecoEntregaId": 1,
  "dataPedido": "2025-10-05T22:30:00.000Z",
  "status": "PENDING",
  "total": 85.80
}
```

**❌ 400 Bad Request**
```json
{ "message": "Carrinho vazio" }
```

---

### GET `/api/orders` – Listar pedidos do usuário
**Acesso:** User/Admin/Employee
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 200 OK**
```json
[
  {
    "id": 999,
    "userId": 123,
    "orderDate": "2025-10-05T22:30:00.000Z",
    "status": "PENDING",
    "totalAmount": 85.80,
    "itemCount": 2
  }
]
```

---

### GET `/api/orders/{id}` – Buscar pedido específico
**Acesso:** User/Admin/Employee
**Header:** `Authorization: Bearer {token}`

**Responses:**

**✅ 200 OK**
```json
{
  "id": 999,
  "userId": 123,
  "orderDate": "2025-10-05T22:30:00.000Z",
  "status": "PENDING",
  "totalAmount": 85.80,
  "items": [
    {
      "itemId": 2,
      "itemName": "Pizza Margherita",
      "quantity": 2,
      "itemValue": 42.90,
      "total": 85.80
    }
  ]
}
```

**❌ 404 Not Found**
```json
{ "message": "Pedido não encontrado" }
```

---

### PUT `/api/orders/{id}/status` – Atualizar status do pedido
**Acesso:** Admin/Employee
**Header:** `Authorization: Bearer {admin_token}`

**Request:**
```json
"CONFIRMED"
```

**Responses:**

**✅ 200 OK**
```json
{
  "message": "Status do pedido atualizado com sucesso",
  "status": "CONFIRMED"
}
```

**Status válidos:** `PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `DELIVERED`, `CANCELLED`

---

### DELETE `/api/orders/{id}` – Remover pedido
**Acesso:** Admin
**Header:** `Authorization: Bearer {admin_token}`

**Responses:**

**✅ 200 OK**
```json
{ "message": "Pedido removido com sucesso" }
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
- Banco de Dados SQL server
- Usuário com permissões de criação e alteração de tabelas

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

