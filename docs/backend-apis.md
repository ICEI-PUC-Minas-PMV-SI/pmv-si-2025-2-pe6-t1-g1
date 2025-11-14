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
Afim de garantir a segurança de seus usuários, a API FatiaCerta utiliza estratégias como tokens JWT, que são gerados no momento em que o usuário faz login, permissionamento de rotas com roles e criptografia de senhas no banco de dados, garantindo que, mesmo em caso de vazamento de informações, as senhas não sejam expostas diretamente.

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

Para facilitar os testes e garantir que novos desenvolvimentos não seriam enviados a branch 
principal com erros, foi implementado um diretório de testes usando cypress e nodeJS, que serão executados antes de cada atualização do código principal

### Casos de teste:

## Hello Controller

### Deve retornar mensagem "Hello World"
**Teste:** `should return hello world message`  
**Endpoint:** `GET /api/hello`  
**Payload:** Nenhum  
**Link:** [hello-controller.cy.js](../web_api_tests/cypress/e2e/hello-controller.cy.js#L8)

### Deve ter cabeçalhos de resposta corretos
**Teste:** `should have correct response headers`  
**Endpoint:** `GET /api/hello`  
**Payload:** Nenhum  
**Link:** [hello-controller.cy.js](../web_api_tests/cypress/e2e/hello-controller.cy.js#L15)

## Items Controller

### Deve buscar todos os itens sem autenticação
**Teste:** `should get all items without authentication`  
**Endpoint:** `GET /api/items`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L36)

### Deve buscar todos os itens com autenticação
**Teste:** `should get all items with authentication`  
**Endpoint:** `GET /api/items`  
**Payload:** Nenhum (com token de autorização)  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L43)

### Deve buscar item por ID sem autenticação
**Teste:** `should get item by ID without authentication`  
**Endpoint:** `GET /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L65)

### Deve retornar 404 para item inexistente
**Teste:** `should return 404 for non-existent item`  
**Endpoint:** `GET /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L76)

### Deve buscar itens por nome
**Teste:** `should search items by name`  
**Endpoint:** `GET /api/items/search?query=Pizza`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L99)

### Deve buscar itens por categoria
**Teste:** `should search items by category`  
**Endpoint:** `GET /api/items/search?category=Pizza`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L111)

### Deve retornar array vazio para busca sem correspondência
**Teste:** `should return empty array for non-matching search`  
**Endpoint:** `GET /api/items/search?query=NonExistentItem123`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L123)

### Deve criar item com sucesso com token de admin
**Teste:** `should create item successfully with admin token`  
**Endpoint:** `POST /api/items`  
**Payload:**
```json
{
  "name": "Test Pizza",
  "description": "Delicious test pizza with cheese and tomato",
  "price": 25.90,
  "category": "Pizza",
  "imageUrl": "https://example.com/pizza.jpg",
  "isAvailable": true
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L137)

### Deve falhar ao criar item sem autenticação
**Teste:** `should fail to create item without authentication`  
**Endpoint:** `POST /api/items`  
**Payload:** (mesmo payload acima)  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L155)

### Deve falhar ao criar item com token de usuário (não-admin)
**Teste:** `should fail to create item with user token (non-admin)`  
**Endpoint:** `POST /api/items`  
**Payload:** (mesmo payload acima)  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L166)

### Deve falhar ao criar item com dados inválidos
**Teste:** `should fail to create item with invalid data`  
**Endpoint:** `POST /api/items`  
**Payload:**
```json
{
  "name": "",
  "price": -10
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L180)

### Deve atualizar item com sucesso com token de admin
**Teste:** `should update item successfully with admin token`  
**Endpoint:** `PUT /api/items/:id`  
**Payload:**
```json
{
  "name": "Updated Pizza Name",
  "price": 30.50,
  "isAvailable": false
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L204)

### Deve falhar ao atualizar item sem autenticação
**Teste:** `should fail to update item without authentication`  
**Endpoint:** `PUT /api/items/:id`  
**Payload:**
```json
{
  "name": "Updated Name"
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L221)

### Deve falhar ao atualizar item com token de usuário (não-admin)
**Teste:** `should fail to update item with user token (non-admin)`  
**Endpoint:** `PUT /api/items/:id`  
**Payload:**
```json
{
  "name": "Updated Name"
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L238)

### Deve retornar 404 ao atualizar item inexistente
**Teste:** `should return 404 for non-existent item`  
**Endpoint:** `PUT /api/items/:id`  
**Payload:**
```json
{
  "name": "Updated Name"
}
```
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L255)

### Deve excluir item com sucesso com token de admin
**Teste:** `should delete item successfully with admin token`  
**Endpoint:** `DELETE /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L280)

### Deve falhar ao excluir item sem autenticação
**Teste:** `should fail to delete item without authentication`  
**Endpoint:** `DELETE /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L298)

### Deve falhar ao excluir item com token de usuário (não-admin)
**Teste:** `should fail to delete item with user token (non-admin)`  
**Endpoint:** `DELETE /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L313)

### Deve retornar 404 ao excluir item inexistente
**Teste:** `should return 404 for non-existent item`  
**Endpoint:** `DELETE /api/items/:id`  
**Payload:** Nenhum  
**Link:** [items-controller.cy.js](../web_api_tests/cypress/e2e/items-controller.cy.js#L328)

## User Controller

### Deve registrar novo usuário com sucesso
**Teste:** `should register a new user successfully`  
**Endpoint:** `POST /api/user`  
**Payload:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "phone": "11999999999"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L14)

### Deve falhar ao registrar usuário com email inválido
**Teste:** `should fail to register user with invalid email`  
**Endpoint:** `POST /api/user`  
**Payload:**
```json
{
  "name": "Test User",
  "email": "invalid-email",
  "password": "password123",
  "phone": "11999999999"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L25)

### Deve falhar ao registrar usuário com campos obrigatórios faltando
**Teste:** `should fail to register user with missing required fields`  
**Endpoint:** `POST /api/user`  
**Payload:**
```json
{
  "email": "test@example.com"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L36)

### Deve falhar ao registrar usuário com email duplicado
**Teste:** `should fail to register user with duplicate email`  
**Endpoint:** `POST /api/user`  
**Payload:** (mesmo usuário registrado duas vezes)  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L47)

### Deve fazer login com sucesso utilizando credenciais válidas
**Teste:** `should login successfully with valid credentials`  
**Endpoint:** `POST /api/user/login`  
**Payload:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L66)

### Deve falhar no login com email inválido
**Teste:** `should fail login with invalid email`  
**Endpoint:** `POST /api/user/login`  
**Payload:**
```json
{
  "email": "invalid@example.com",
  "password": "password123"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L81)

### Deve falhar no login com senha inválida
**Teste:** `should fail login with invalid password`  
**Endpoint:** `POST /api/user/login`  
**Payload:**
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L92)

### Deve falhar no login com credenciais faltando
**Teste:** `should fail login with missing credentials`  
**Endpoint:** `POST /api/user/login`  
**Payload:**
```json
{}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L103)

### Deve obter perfil do usuário com sucesso utilizando token válido
**Teste:** `should get user profile successfully with valid token`  
**Endpoint:** `GET /api/user`  
**Payload:** Nenhum (com token de autorização)  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L125)

### Deve falhar ao obter perfil sem token
**Teste:** `should fail to get profile without token`  
**Endpoint:** `GET /api/user`  
**Payload:** Nenhum  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L138)

### Deve falhar ao obter perfil com token inválido
**Teste:** `should fail to get profile with invalid token`  
**Endpoint:** `GET /api/user`  
**Payload:** Nenhum (com token inválido)  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L148)

### Deve atualizar perfil do usuário com sucesso
**Teste:** `should update user profile successfully`  
**Endpoint:** `PUT /api/user`  
**Payload:**
```json
{
  "name": "Updated Name",
  "phone": "11888888888"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L168)

### Deve falhar ao atualizar perfil sem token
**Teste:** `should fail to update profile without token`  
**Endpoint:** `PUT /api/user`  
**Payload:**
```json
{
  "name": "Updated Name"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L184)

### Deve lidar com atualizações parciais
**Teste:** `should handle partial updates`  
**Endpoint:** `PUT /api/user`  
**Payload:**
```json
{
  "name": "Only Name Updated"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L197)

### Deve excluir perfil do usuário com sucesso
**Teste:** `should delete user profile successfully`  
**Endpoint:** `DELETE /api/user`  
**Payload:** Nenhum  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L218)

### Deve falhar ao excluir perfil sem token
**Teste:** `should fail to delete profile without token`  
**Endpoint:** `DELETE /api/user`  
**Payload:** Nenhum  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L237)

### Deve obter usuário por ID com privilégios de admin
**Teste:** `should get user by ID with admin privileges`  
**Endpoint:** `GET /api/user/:id`  
**Payload:** Nenhum (com token de admin)  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L272)

### Deve falhar ao obter usuário por ID sem privilégios de admin
**Teste:** `should fail to get user by ID without admin privileges`  
**Endpoint:** `GET /api/user/:id`  
**Payload:** Nenhum (com token de usuário regular)  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L287)

### Deve atualizar usuário por ID com privilégios de admin
**Teste:** `should update user by ID with admin privileges`  
**Endpoint:** `PUT /api/user/:id`  
**Payload:**
```json
{
  "name": "Admin Updated Name"
}
```
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L301)

### Deve excluir usuário por ID com privilégios de admin
**Teste:** `should delete user by ID with admin privileges`  
**Endpoint:** `DELETE /api/user/:id`  
**Payload:** Nenhum  
**Link:** [user-controller.cy.js](../web_api_tests/cypress/e2e/user-controller.cy.js#L320)

## Cart Controller

### Deve obter carrinho vazio para novo usuário
**Teste:** `should get empty cart for new user`  
**Endpoint:** `GET /api/cart`  
**Payload:** Nenhum (com token de autorização)  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L50)

### Deve falhar ao obter carrinho sem autenticação
**Teste:** `should fail to get cart without authentication`  
**Endpoint:** `GET /api/cart`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L58)

### Deve falhar ao obter carrinho com token inválido
**Teste:** `should fail to get cart with invalid token`  
**Endpoint:** `GET /api/cart`  
**Payload:** Nenhum (com token inválido)  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L68)

### Deve adicionar item ao carrinho com sucesso
**Teste:** `should add item to cart successfully`  
**Endpoint:** `POST /api/cart/item`  
**Payload:**
```json
{
  "itemId": 1,
  "quantity": 2
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L81)

### Deve falhar ao adicionar item sem autenticação
**Teste:** `should fail to add item without authentication`  
**Endpoint:** `POST /api/cart/item`  
**Payload:**
```json
{
  "itemId": 1,
  "quantity": 1
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L103)

### Deve falhar ao adicionar item inexistente ao carrinho
**Teste:** `should fail to add non-existent item to cart`  
**Endpoint:** `POST /api/cart/item`  
**Payload:**
```json
{
  "itemId": 99999,
  "quantity": 1
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L119)

### Deve falhar ao adicionar item com quantidade inválida
**Teste:** `should fail to add item with invalid quantity`  
**Endpoint:** `POST /api/cart/item`  
**Payload:**
```json
{
  "itemId": 1,
  "quantity": 0
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L135)

### Deve atualizar quantidade ao adicionar item existente
**Teste:** `should update quantity when adding existing item`  
**Endpoint:** `POST /api/cart/item`  
**Payload:**
```json
{
  "itemId": 1,
  "quantity": 1
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L152)

### Deve atualizar quantidade do item no carrinho com sucesso
**Teste:** `should update cart item quantity successfully`  
**Endpoint:** `PUT /api/cart/item/:id`  
**Payload:**
```json
{
  "quantity": 5
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L186)

### Deve falhar ao atualizar item do carrinho sem autenticação
**Teste:** `should fail to update cart item without authentication`  
**Endpoint:** `PUT /api/cart/item/:id`  
**Payload:**
```json
{
  "quantity": 3
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L198)

### Deve falhar ao atualizar item inexistente do carrinho
**Teste:** `should fail to update non-existent cart item`  
**Endpoint:** `PUT /api/cart/item/:id`  
**Payload:**
```json
{
  "quantity": 2
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L214)

### Deve falhar ao atualizar com quantidade inválida
**Teste:** `should fail to update with invalid quantity`  
**Endpoint:** `PUT /api/cart/item/:id`  
**Payload:**
```json
{
  "quantity": -1
}
```
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L230)

### Deve remover item do carrinho com sucesso
**Teste:** `should remove cart item successfully`  
**Endpoint:** `DELETE /api/cart/item/:id`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L263)

### Deve falhar ao remover item do carrinho sem autenticação
**Teste:** `should fail to remove cart item without authentication`  
**Endpoint:** `DELETE /api/cart/item/:id`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L278)

### Deve falhar ao remover item inexistente do carrinho
**Teste:** `should fail to remove non-existent cart item`  
**Endpoint:** `DELETE /api/cart/item/:id`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L293)

### Deve limpar carrinho com sucesso
**Teste:** `should clear cart successfully`  
**Endpoint:** `DELETE /api/cart/clear`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L319)

### Deve falhar ao limpar carrinho sem autenticação
**Teste:** `should fail to clear cart without authentication`  
**Endpoint:** `DELETE /api/cart/clear`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L331)

### Deve lidar com limpeza de carrinho vazio
**Teste:** `should handle clearing empty cart`  
**Endpoint:** `DELETE /api/cart/clear`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L341)

### Deve lidar com fluxo completo do carrinho
**Teste:** `should handle complete cart workflow`  
**Endpoint:** Múltiplos endpoints  
**Payload:** Vários  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L353)

### Deve calcular total do carrinho corretamente
**Teste:** `should calculate cart total correctly`  
**Endpoint:** `GET /api/cart`  
**Payload:** Nenhum  
**Link:** [cart-controller.cy.js](../web_api_tests/cypress/e2e/cart-controller.cy.js#L398)

## Orders Controller

### Deve criar pedido com sucesso a partir dos itens do carrinho
**Teste:** `should create order successfully from cart items`  
**Endpoint:** `POST /api/orders`  
**Payload:** Nenhum (usa itens do carrinho)  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L53)

### Deve falhar ao criar pedido sem autenticação
**Teste:** `should fail to create order without authentication`  
**Endpoint:** `POST /api/orders`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L78)

### Deve falhar ao criar pedido com carrinho vazio
**Teste:** `should fail to create order with empty cart`  
**Endpoint:** `POST /api/orders`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L88)

### Deve limpar carrinho após criação bem-sucedida do pedido
**Teste:** `should clear cart after successful order creation`  
**Endpoint:** `POST /api/orders`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L103)

### Deve obter pedidos do usuário com sucesso
**Teste:** `should get user orders successfully`  
**Endpoint:** `GET /api/orders`  
**Payload:** Nenhum (com token de autorização)  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L141)

### Deve falhar ao obter pedidos sem autenticação
**Teste:** `should fail to get orders without authentication`  
**Endpoint:** `GET /api/orders`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L158)

### Deve retornar array vazio para usuário sem pedidos
**Teste:** `should return empty array for user with no orders`  
**Endpoint:** `GET /api/orders`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L168)

### Deve obter pedido por ID com sucesso
**Teste:** `should get order by ID successfully`  
**Endpoint:** `GET /api/orders/:id`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L195)

### Deve falhar ao obter pedido sem autenticação
**Teste:** `should fail to get order without authentication`  
**Endpoint:** `GET /api/orders/:id`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L211)

### Deve falhar ao obter pedido inexistente
**Teste:** `should fail to get non-existent order`  
**Endpoint:** `GET /api/orders/:id`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L226)

### Deve falhar ao obter pedido de outro usuário
**Teste:** `should fail to get another user's order`  
**Endpoint:** `GET /api/orders/:id`  
**Payload:** Nenhum  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L242)

### Deve atualizar status do pedido com sucesso usando token de admin
**Teste:** `should update order status successfully with admin token`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:**
```json
{
  "status": "InProgress"
}
```
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L273)

### Deve falhar ao atualizar status do pedido sem autenticação
**Teste:** `should fail to update order status without authentication`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:**
```json
{
  "status": "InProgress"
}
```
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L287)

### Deve falhar ao atualizar status do pedido com token de usuário (não-admin)
**Teste:** `should fail to update order status with user token (non-admin)`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:**
```json
{
  "status": "InProgress"
}
```
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L302)

### Deve falhar ao atualizar status de pedido inexistente
**Teste:** `should fail to update non-existent order status`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:**
```json
{
  "status": "InProgress"
}
```
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L322)

### Deve falhar ao atualizar com status inválido
**Teste:** `should fail to update with invalid status`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:**
```json
{
  "status": "InvalidStatus"
}
```
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L339)

### Deve lidar com todos os status válidos de pedido
**Teste:** `should handle all valid order statuses`  
**Endpoint:** `PUT /api/orders/:id/status`  
**Payload:** Vários status válidos (Pending, InProgress, Ready, Delivered, Cancelled)  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L356)

### Deve lidar com fluxo completo de pedido
**Teste:** `should handle complete order workflow`  
**Endpoint:** Múltiplos endpoints  
**Payload:** Vários  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L372)

### Deve calcular total do pedido corretamente com múltiplos itens
**Teste:** `should calculate order total correctly with multiple items`  
**Endpoint:** `POST /api/orders`  
**Payload:** Nenhum (usa múltiplos itens do carrinho)  
**Link:** [orders-controller.cy.js](../web_api_tests/cypress/e2e/orders-controller.cy.js#L412)

### Sumarização de resultados:

<img width="1005" height="310" alt="image" src="https://github.com/user-attachments/assets/905b5b1a-af1a-4e4f-ae29-bf8c1315c14c" />







# Referências

CYPRESS. Testing Frameworks for Javascript | Write, Run, Debug. Disponível em: https://www.cypress.io/
. Acesso em: 9 out. 2025.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 29/09/2025

| Responsável | Tarefa/Requisito                   | Iniciado em    | Prazo      | Status | Terminado em |
| :----       | :----                               | :----:        | :----:     | :----: | :----:       |
| Samuel      | Desenvolver endpoints de Users     | 22/09/2025    | 05/09/2025 | ✔️     | 05/10/2025   |
| Pedro       | Criar endpoints de Users/Admin     | 22/09/2025    | 29/09/2025 | ✔️      | 05/10/2025   |
| Victor      | Desenvolver endpoints de Items/Admin | 22/09/2025  | 29/09/2025 | ✔️     |  28/09/2025  |
| Luigi       | Criar endpoints de Cart/User       | 22/09/2025    | 29/09/2025 | ✔️      | 05/10/2025   |
| Vitor       | Criar endpoints de Orders          | 22/09/2025    | 29/09/2025 |   ✔️   | 29/09/2025   |
| Bruno       | Setup da API + modelagem do banco + models  | 22/09/2025    | 24/09/2025 |  ✔️    | 24/09/2025   |


#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| Bruno         | Documentar APIs  |  29/09/20505   | 01/10/2025 | ✔️    | 05/10/2025   |
| Bruno         | Documentar objetivo + modelagem |  29/09/20505   | 01/10/2025 | ✔️    | 05/10/2025   |
| Victor.A       | Documentação de implantação  |  29/09/20505   | 01/10/2025 | ✔️    | 05/10/2025   |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

