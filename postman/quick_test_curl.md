# Teste Rápido da API - Comandos cURL

Este arquivo contém comandos cURL para testar rapidamente as principais funcionalidades da API.

## Variáveis de Ambiente (configure primeiro)
```bash
export API_BASE="http://localhost:5123"
export USER_TOKEN=""  # Será preenchido após login
export ADMIN_TOKEN="" # Será preenchido após login admin
```

## 1. Teste Básico - Hello Controller
```bash
# Testar se a API está funcionando
curl -X GET "$API_BASE/api/hello"

# Testar endpoint com parâmetro
curl -X GET "$API_BASE/api/hello/welcome/TestUser"

# Testar status da API
curl -X GET "$API_BASE/api/hello/status"
```

## 2. Cadastro e Login de Usuário
```bash
# Registrar novo usuário
curl -X POST "$API_BASE/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@email.com",
    "phone": "11999888777",
    "password": "123456"
  }'

# Fazer login (salve o token retornado)
curl -X POST "$API_BASE/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "password": "123456"
  }'

# Exemplo de resposta do login:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "expiresIn": 3600,
#   "user": {
#     "id": 3,
#     "name": "João Silva",
#     "email": "joao.silva@email.com",
#     "phone": "11999888777",
#     "role": "USER"
#   }
# }

# Configurar token (substitua pelo token real)
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 3. Login Administrativo
```bash
# Login como admin (ID 1, senha: admin123)
curl -X POST "$API_BASE/api/admins/authenticate" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "password": "admin123"
  }'

# Configurar token admin (substitua pelo token real)
export ADMIN_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 4. Gerenciamento de Itens
```bash
# Listar todos os itens (público)
curl -X GET "$API_BASE/api/items"

# Ver item específico
curl -X GET "$API_BASE/api/items/1"

# Criar novo item (requer admin)
curl -X POST "$API_BASE/api/items" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nameItem": "Pizza Especial",
    "description": "Pizza especial da casa",
    "value": 55.90,
    "category": "Pizza"
  }'

# Atualizar item (requer admin)
curl -X PUT "$API_BASE/api/items/1" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nameItem": "Pizza Margherita Premium",
    "description": "Pizza Margherita com ingredientes premium",
    "value": 42.90,
    "category": "Pizza"
  }'
```

## 5. Gerenciamento de Carrinho
```bash
# Adicionar item ao carrinho
curl -X POST "$API_BASE/api/cart/item" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": 1,
    "quantity": 2
  }'

# Ver carrinho
curl -X GET "$API_BASE/api/cart" \
  -H "Authorization: Bearer $USER_TOKEN"

# Atualizar quantidade de item no carrinho
curl -X PUT "$API_BASE/api/cart/item/1" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '3'

# Remover item do carrinho
curl -X DELETE "$API_BASE/api/cart/item/1" \
  -H "Authorization: Bearer $USER_TOKEN"

# Limpar carrinho
curl -X DELETE "$API_BASE/api/cart/clear" \
  -H "Authorization: Bearer $USER_TOKEN"
```

## 6. Gerenciamento de Pedidos
```bash
# Criar pedido a partir do carrinho
curl -X POST "$API_BASE/api/orders" \
  -H "Authorization: Bearer $USER_TOKEN"

# Listar pedidos do usuário
curl -X GET "$API_BASE/api/orders" \
  -H "Authorization: Bearer $USER_TOKEN"

# Ver pedido específico
curl -X GET "$API_BASE/api/orders/1" \
  -H "Authorization: Bearer $USER_TOKEN"

# Atualizar status do pedido (admin/employee)
curl -X PUT "$API_BASE/api/orders/1/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"CONFIRMED"'

# Listar todos os pedidos (admin)
curl -X GET "$API_BASE/api/orders" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## 7. Operações Administrativas
```bash
# Listar todos os usuários
curl -X GET "$API_BASE/api/admins" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Criar novo admin
curl -X POST "$API_BASE/api/admins" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Admin",
    "email": "novoadmin@pizzaria.com",
    "phone": "11777777777",
    "role": "ADMIN",
    "passwordHash": "admin123"
  }'

# Atualizar usuário
curl -X PUT "$API_BASE/api/admins/3" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "email": "joao.atualizado@email.com",
    "phone": "11999999999",
    "role": "USER"
  }'
```

## 8. Perfil do Usuário
```bash
# Ver meu perfil
curl -X GET "$API_BASE/api/users" \
  -H "Authorization: Bearer $USER_TOKEN"

# Atualizar meu perfil
curl -X PUT "$API_BASE/api/users" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Updated",
    "phone": "11999999999"
  }'

# Deletar minha conta
curl -X DELETE "$API_BASE/api/users" \
  -H "Authorization: Bearer $USER_TOKEN"
```

## Fluxo Completo de Teste

1. **Teste básico**: Execute os comandos do Hello Controller
2. **Cadastro**: Registre um usuário e faça login
3. **Itens**: Liste os itens disponíveis
4. **Carrinho**: Adicione itens ao carrinho
5. **Pedido**: Crie um pedido a partir do carrinho
6. **Admin**: Faça login como admin e gerencie o sistema

## Status Codes Esperados

- **200 OK**: Operação bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação de deleção bem-sucedida
- **400 Bad Request**: Dados inválidos
- **401 Unauthorized**: Token inválido ou expirado
- **403 Forbidden**: Sem permissão para a operação
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Recurso já existe (ex: email duplicado)

## Troubleshooting

### Erro 401 Unauthorized
- Verifique se o token está configurado corretamente
- Verifique se o token não expirou (expira em 1 hora)

### Erro 500 Internal Server Error
- Verifique se o banco de dados está configurado
- Verifique os logs da API
- Certifique-se de que os dados de exemplo foram inseridos

### Erro de Conexão
- Verifique se a API está rodando na porta 5123
- Verifique se a URL base está correta