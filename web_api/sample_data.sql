-- Script SQL para inserir dados de exemplo na Pizzaria API
-- Execute este script no seu banco de dados SQL Server

USE [mf_fuel_manager]; -- Ajuste o nome do banco se necessário
GO

-- 1. Inserir usuários
INSERT INTO [Users] ([Name], [Email], [PasswordHash], [Phone], [CreatedAt], [Role])
VALUES 
    ('João Silva', 'joao.silva@email.com', '$2a$11$xhash1234567890abcdef', '(11) 98765-4321', GETDATE(), 'USER'),
    ('Maria Santos', 'maria.santos@email.com', '$2a$11$yhash1234567890abcdef', '(11) 99876-5432', GETDATE(), 'USER'),
    ('Admin Pizzaria', 'admin@pizzaria.com', '$2a$11$zhash1234567890abcdef', '(11) 99999-9999', GETDATE(), 'ADMIN'),
    ('Carlos Funcionário', 'carlos@pizzaria.com', '$2a$11$whash1234567890abcdef', '(11) 98888-8888', GETDATE(), 'EMPLOYER');

-- 2. Inserir endereços dos usuários
INSERT INTO [UserAddresses] ([UserId], [Street], [Number], [Neighborhood], [City], [State], [ZipCode], [Complement])
VALUES 
    (1, 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01000-000', 'Apto 45'),
    (1, 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310-000', NULL),
    (2, 'Rua Augusta', '500', 'Consolação', 'São Paulo', 'SP', '01305-000', 'Bloco B'),
    (2, 'Rua Oscar Freire', '200', 'Jardins', 'São Paulo', 'SP', '01426-000', NULL);

-- 3. Inserir itens do cardápio (pizzas, bebidas, sobremesas)
INSERT INTO [Items] ([NameItem], [Description], [Value], [Category])
VALUES 
    -- Pizzas
    ('Pizza Margherita', 'Pizza tradicional com molho de tomate, mussarela e manjericão fresco', 35.90, 'Pizza'),
    ('Pizza Pepperoni', 'Pizza com molho de tomate, mussarela e pepperoni', 42.90, 'Pizza'),
    ('Pizza Quatro Queijos', 'Pizza com mussarela, gorgonzola, parmesão e provolone', 45.90, 'Pizza'),
    ('Pizza Portuguesa', 'Pizza com presunto, ovos, cebola, azeitona e ervilha', 38.90, 'Pizza'),
    ('Pizza Calabresa', 'Pizza com calabresa, cebola e azeitona', 36.90, 'Pizza'),
    
    -- Bebidas
    ('Coca-Cola 2L', 'Refrigerante Coca-Cola 2 litros', 8.90, 'Bebida'),
    ('Guaraná Antarctica 2L', 'Refrigerante Guaraná Antarctica 2 litros', 7.90, 'Bebida'),
    ('Suco de Laranja Natural', 'Suco de laranja natural 500ml', 6.50, 'Bebida'),
    ('Água Mineral', 'Água mineral sem gás 500ml', 3.00, 'Bebida'),
    ('Cerveja Heineken', 'Cerveja Heineken long neck 330ml', 5.90, 'Bebida'),
    
    -- Sobremesas
    ('Pudim de Leite', 'Pudim de leite condensado caseiro', 12.90, 'Sobremesa'),
    ('Brigadeiro Gourmet', 'Brigadeiro gourmet com granulado belga (unidade)', 4.50, 'Sobremesa'),
    ('Sorvete Napolitano', 'Sorvete napolitano 1 litro', 15.90, 'Sobremesa');

-- 4. Inserir itens no carrinho dos usuários
INSERT INTO [UserCarts] ([UserId], [ItemId], [Quantity])
VALUES 
    -- Carrinho do João (UserId = 1)
    (1, 1, 2),  -- 2 Pizza Margherita
    (1, 6, 1),  -- 1 Coca-Cola 2L
    (1, 11, 1), -- 1 Pudim de Leite
    
    -- Carrinho da Maria (UserId = 2)
    (2, 3, 1),  -- 1 Pizza Quatro Queijos
    (2, 2, 1),  -- 1 Pizza Pepperoni
    (2, 7, 1),  -- 1 Guaraná Antarctica 2L
    (2, 12, 3); -- 3 Brigadeiro Gourmet

-- 5. Inserir pedidos
INSERT INTO [Orders] ([UserId], [EnderecoEntregaId], [DataPedido], [Status], [Total])
VALUES 
    -- Pedido do João
    (1, 1, GETDATE(), 'Preparando', 95.70),
    
    -- Pedido da Maria (pedido mais antigo)
    (2, 3, DATEADD(HOUR, -2, GETDATE()), 'Entregue', 102.30),
    
    -- Pedido antigo do João (já entregue)
    (1, 2, DATEADD(DAY, -1, GETDATE()), 'Entregue', 78.80);

-- 6. Inserir itens dos pedidos
INSERT INTO [OrderItems] ([OrderId], [ItemId], [Quantity])
VALUES 
    -- Itens do Pedido 1 (João - Pedido atual)
    (1, 1, 2),  -- 2 Pizza Margherita (35.90 x 2 = 71.80)
    (1, 6, 1),  -- 1 Coca-Cola 2L (8.90)
    (1, 11, 1), -- 1 Pudim de Leite (12.90)
    -- Total: 93.60 (diferença pode ser taxa de entrega)
    
    -- Itens do Pedido 2 (Maria - Já entregue)
    (2, 3, 1),  -- 1 Pizza Quatro Queijos (45.90)
    (2, 2, 1),  -- 1 Pizza Pepperoni (42.90)
    (2, 7, 1),  -- 1 Guaraná Antarctica 2L (7.90)
    (2, 12, 1), -- 1 Brigadeiro Gourmet (4.50)
    -- Total: 101.20
    
    -- Itens do Pedido 3 (João - Pedido antigo)
    (3, 4, 1),  -- 1 Pizza Portuguesa (38.90)
    (3, 5, 1),  -- 1 Pizza Calabresa (36.90)
    (3, 9, 1);  -- 1 Água Mineral (3.00)
    -- Total: 78.80

-- Verificar os dados inseridos
SELECT 'Usuários' as Tabela, COUNT(*) as Total FROM [Users]
UNION ALL
SELECT 'Endereços', COUNT(*) FROM [UserAddresses]
UNION ALL
SELECT 'Itens do Cardápio', COUNT(*) FROM [Items]
UNION ALL
SELECT 'Carrinho', COUNT(*) FROM [UserCarts]
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM [Orders]
UNION ALL
SELECT 'Itens dos Pedidos', COUNT(*) FROM [OrderItems];

-- Consultas úteis para verificar os relacionamentos
PRINT '=== CONSULTAS DE VERIFICAÇÃO ===';

-- Usuários com seus endereços
SELECT 
    u.Name as Usuario,
    u.Email,
    u.Role,
    ua.Street + ', ' + ua.Number + ' - ' + ua.Neighborhood + ', ' + ua.City as Endereco
FROM [Users] u
LEFT JOIN [UserAddresses] ua ON u.Id = ua.UserId
ORDER BY u.Name;

-- Carrinho de cada usuário
SELECT 
    u.Name as Usuario,
    i.NameItem as Item,
    i.Category as Categoria,
    uc.Quantity as Quantidade,
    i.Value as PrecoUnitario,
    (uc.Quantity * i.Value) as SubTotal
FROM [UserCarts] uc
JOIN [Users] u ON uc.UserId = u.Id
JOIN [Items] i ON uc.ItemId = i.Id
ORDER BY u.Name, i.Category;

-- Pedidos com detalhes
SELECT 
    o.Id as PedidoId,
    u.Name as Cliente,
    o.DataPedido,
    o.Status,
    o.Total,
    ua.Street + ', ' + ua.Number as EnderecoEntrega
FROM [Orders] o
JOIN [Users] u ON o.UserId = u.Id
JOIN [UserAddresses] ua ON o.EnderecoEntregaId = ua.Id
ORDER BY o.DataPedido DESC;

-- Itens de cada pedido
SELECT 
    o.Id as PedidoId,
    u.Name as Cliente,
    i.NameItem as Item,
    oi.Quantity as Quantidade,
    i.Value as PrecoUnitario,
    (oi.Quantity * i.Value) as SubTotal
FROM [OrderItems] oi
JOIN [Orders] o ON oi.OrderId = o.Id
JOIN [Users] u ON o.UserId = u.Id
JOIN [Items] i ON oi.ItemId = i.Id
ORDER BY o.Id, i.Category;