-- Script SQL para popular o banco de dados com dados de teste
-- Execute este script antes de usar a collection do Postman

-- Inserir usuário administrador padrão
INSERT INTO Users (Name, Email, PasswordHash, Phone, Role, CreatedAt) VALUES 
('Admin Sistema', 'admin@pizzaria.com', '$2a$11$rQiCBZ7.5hK1O7J3gK8y4O9yLYZVzQQOE8zJ5Lp4E1Oa9vL8zQ9yX', '11999999999', 'ADMIN', GETDATE());

-- Inserir usuário funcionário
INSERT INTO Users (Name, Email, PasswordHash, Phone, Role, CreatedAt) VALUES 
('Maria Funcionaria', 'funcionaria@pizzaria.com', '$2a$11$rQiCBZ7.5hK1O7J3gK8y4O9yLYZVzQQOE8zJ5Lp4E1Oa9vL8zQ9yX', '11888888888', 'EMPLOYEE', GETDATE());

-- Inserir itens do menu (pizzas)
INSERT INTO Items (NameItem, Description, Value, Category) VALUES 
('Pizza Margherita', 'Pizza tradicional italiana com molho de tomate, mozzarella e manjericão', 35.90, 'Pizza'),
('Pizza Pepperoni', 'Pizza com pepperoni, molho de tomate e mozzarella', 42.90, 'Pizza'),
('Pizza Quatro Queijos', 'Pizza com mozzarella, gorgonzola, parmesão e provolone', 45.90, 'Pizza'),
('Pizza Portuguesa', 'Pizza com presunto, ovos, cebola, azeitona e ervilha', 48.90, 'Pizza'),
('Pizza Calabresa', 'Pizza com calabresa, cebola, molho de tomate e mozzarella', 39.90, 'Pizza');

-- Inserir bebidas
INSERT INTO Items (NameItem, Description, Value, Category) VALUES 
('Coca-Cola 350ml', 'Refrigerante Coca-Cola lata 350ml', 5.50, 'Bebida'),
('Guaraná Antarctica 350ml', 'Refrigerante Guaraná Antarctica lata 350ml', 5.50, 'Bebida'),
('Suco de Laranja 300ml', 'Suco natural de laranja 300ml', 8.90, 'Bebida'),
('Água Mineral 500ml', 'Água mineral sem gás 500ml', 3.50, 'Bebida');

-- Inserir sobremesas
INSERT INTO Items (NameItem, Description, Value, Category) VALUES 
('Pudim de Leite', 'Pudim de leite condensado com calda de caramelo', 12.90, 'Sobremesa'),
('Sorvete Napolitano', 'Sorvete sabor baunilha, chocolate e morango', 15.90, 'Sobremesa'),
('Brownie com Sorvete', 'Brownie de chocolate quente com bola de sorvete de baunilha', 18.90, 'Sobremesa');

-- Inserir endereço padrão (necessário para criar pedidos)
INSERT INTO UserAddresses (UserId, Street, Number, Neighborhood, City, State, ZipCode, IsDefault) VALUES 
(1, 'Rua das Flores', '123', 'Centro', 'São Paulo', 'SP', '01234-567', 1);

-- Notas importantes:
-- 1. As senhas dos usuários admin e employee são 'admin123' (já hasheadas com BCrypt)
-- 2. O ID 1 será usado para o admin, ID 2 para o employee
-- 3. Os IDs dos itens começarão em 1 e seguirão sequencialmente
-- 4. Para usar a API, você precisará fazer login com:
--    - Admin: ID 1, senha: admin123
--    - Employee: ID 2, senha: admin123