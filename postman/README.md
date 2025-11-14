# Pizzaria API - Collection e Environment do Postman

Este diretório contém a collection e environment do Postman para testar todas as APIs da Pizzaria.

## Arquivos

- `Pizzaria_API_Collection.postman_collection.json` - Collection completa com todas as rotas da API
- `Pizzaria_API_Environment.postman_environment.json` - Environment com variáveis pré-configuradas

## Como Usar

### 1. Importar no Postman

1. Abra o Postman
2. Clique em "Import" no canto superior esquerdo
3. Arraste os dois arquivos JSON ou selecione-os usando "Upload Files"
4. Confirme a importação

### 2. Configurar o Environment

1. No Postman, selecione o environment "Pizzaria API Environment" no dropdown no canto superior direito
2. Verifique se a variável `base_url` está configurada corretamente (padrão: `http://localhost:5123`)

### 3. Ordem de Execução Recomendada para Testes

#### Para Usuários Normais:
1. **Hello Controller** - Testar se a API está funcionando
2. **User Authentication > Register User** - Criar uma conta
3. **User Authentication > Login User** - Fazer login (token será salvo automaticamente)
4. **Items Management > Get All Items** - Ver itens disponíveis
5. **Cart Management** - Gerenciar carrinho
6. **Orders Management** - Criar e gerenciar pedidos

#### Para Administradores:
1. **Admin Operations > Admin Login** - Login como admin
2. **Items Management** - Criar/atualizar/deletar itens (requer token admin)
3. **Admin Operations** - Gerenciar usuários
4. **Orders Management** - Ver todos os pedidos e atualizar status

## Endpoints Disponíveis

### Hello Controller
- `GET /api/hello` - Mensagem de boas-vindas
- `GET /api/hello/welcome/{name}` - Mensagem personalizada
- `GET /api/hello/status` - Status da API

### User Authentication
- `POST /api/users` - Registrar usuário
- `POST /api/users/login` - Login
- `GET /api/users` - Ver perfil
- `PUT /api/users` - Atualizar perfil
- `DELETE /api/users` - Deletar conta

### Admin Operations
- `POST /api/admins/authenticate` - Login de admin
- `GET /api/admins` - Listar todos os usuários
- `POST /api/admins` - Criar admin
- `PUT /api/admins/{id}` - Atualizar usuário
- `DELETE /api/admins/{id}` - Deletar usuário

### Items Management
- `GET /api/items` - Listar todos os itens
- `GET /api/items/{id}` - Ver item específico
- `POST /api/items` - Criar item (admin)
- `PUT /api/items/{id}` - Atualizar item (admin)
- `DELETE /api/items/{id}` - Deletar item (admin)

### Cart Management
- `POST /api/cart/item` - Adicionar item ao carrinho
- `GET /api/cart` - Ver carrinho
- `GET /api/cart/item/{id}` - Ver item específico do carrinho
- `PUT /api/cart/item/{id}` - Atualizar quantidade
- `DELETE /api/cart/item/{id}` - Remover item
- `DELETE /api/cart/clear` - Limpar carrinho

### Orders Management
- `POST /api/orders` - Criar pedido do carrinho
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/{id}` - Ver pedido específico
- `PUT /api/orders/{id}/status` - Atualizar status (admin/employee)
- `DELETE /api/orders/{id}` - Deletar pedido (admin)

## Variáveis do Environment

### URLs e Configuração
- `base_url` - URL base da API (http://localhost:5123)

### Autenticação
- `auth_token` - Token JWT do usuário (preenchido automaticamente após login)
- `admin_token` - Token JWT do admin (preenchido automaticamente após login admin)
- `user_id` - ID do usuário logado
- `admin_id` - ID do admin logado

### Dados de Teste
- `test_user_name` - Nome para testes de usuário
- `test_user_email` - Email para testes de usuário
- `test_user_phone` - Telefone para testes
- `test_user_password` - Senha para testes
- `admin_user_id` - ID do admin para login
- `admin_password` - Senha do admin

### IDs para Testes
- `item_id` - ID do item para testes
- `cart_item_id` - ID do item no carrinho
- `order_id` - ID do pedido
- `target_user_id` - ID do usuário para operações admin

### Dados de Exemplo
- `sample_item_name` - Nome do item de exemplo
- `sample_item_description` - Descrição do item
- `sample_item_price` - Preço do item
- `sample_item_category` - Categoria do item
- `cart_item_quantity` - Quantidade no carrinho
- `order_status` - Status do pedido

## Scripts Automáticos

A collection inclui scripts automáticos que:
- Salvam tokens de autenticação automaticamente após login
- Salvam IDs de recursos criados para uso em outros endpoints
- Facilitam o fluxo de testes

## Status de Pedidos Válidos

- `PENDING` - Pendente
- `CONFIRMED` - Confirmado
- `PREPARING` - Preparando
- `READY` - Pronto
- `DELIVERED` - Entregue
- `CANCELLED` - Cancelado

## Roles de Usuário

- `USER` - Usuário comum
- `ADMIN` - Administrador
- `EMPLOYEE` - Funcionário

## Notas Importantes

1. Certifique-se de que a API está rodando na porta 5123
2. Alguns endpoints requerem autenticação (token JWT)
3. Operações administrativas requerem role ADMIN
4. Os tokens são salvos automaticamente após login bem-sucedido
5. Para criar pedidos, primeiro adicione itens ao carrinho

## Troubleshooting

### Problema: "Unauthorized" ou "403 Forbidden"
**Solução**: Verifique se você fez login e se o token está sendo enviado corretamente

### Problema: "404 Not Found"
**Solução**: Verifique se a API está rodando e se a URL base está correta

### Problema: "500 Internal Server Error"
**Solução**: Verifique os logs da API - pode ser problema de banco de dados

### Problema: IDs não encontrados
**Solução**: Execute primeiro os endpoints que criam recursos (Register, Create Item, etc.)