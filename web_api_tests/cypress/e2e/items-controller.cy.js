describe('Items Controller Tests', () => {
  let adminToken;
  let userToken;
  let testItem;
  let createdItemId;

  beforeEach(() => {
    // Dados de teste para item
    testItem = {
      name: `Test Pizza ${Date.now()}`,
      description: 'Delicious test pizza with cheese and tomato',
      price: 25.90,
      category: 'Pizza',
      imageUrl: 'https://example.com/pizza.jpg',
      isAvailable: true
    };

    // Tentar login como admin
    const adminCredentials = { email: 'admin@admin.com', password: 'admin123' };
    cy.request({
      method: 'POST',
      url: '/api/user/login',
      body: adminCredentials,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        adminToken = response.body.token;
      }
    });

    // Criar e fazer login de usuário regular
    cy.createTestUser().then(({ userData }) => {
      cy.loginUser({ email: userData.email, password: userData.password }).then((response) => {
        userToken = response.body.token;
      });
    });
  });

  describe('GET /api/items (Get All Items)', () => {
    it('should get all items without authentication', () => {
      cy.getItems().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should get all items with authentication', () => {
      cy.request({
        method: 'GET',
        url: '/api/items',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });
  });

  describe('GET /api/items/:id (Get Item by ID)', () => {
    beforeEach(() => {
      // Criar um item para teste se admin token estiver disponível
      if (adminToken) {
        cy.createItem(testItem, adminToken).then((response) => {
          createdItemId = response.body.id;
        });
      }
    });

    it('should get item by ID without authentication', () => {
      if (!createdItemId) {
        cy.log('No item created, skipping test');
        return;
      }

      cy.getItem(createdItemId).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', createdItemId);
        expect(response.body).to.have.property('name', testItem.name);
        expect(response.body).to.have.property('price', testItem.price);
      });
    });

    it('should return 404 for non-existent item', () => {
      const nonExistentId = 99999;
      
      cy.request({
        method: 'GET',
        url: `/api/items/${nonExistentId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('GET /api/items/search (Search Items)', () => {
    beforeEach(() => {
      if (adminToken) {
        // Criar alguns itens para teste de busca
        const searchTestItems = [
          { ...testItem, name: 'Margherita Pizza', category: 'Pizza' },
          { ...testItem, name: 'Pepperoni Pizza', category: 'Pizza' },
          { ...testItem, name: 'Caesar Salad', category: 'Salad' }
        ];

        searchTestItems.forEach(item => {
          cy.createItem(item, adminToken);
        });
      }
    });

    it('should search items by name', () => {
      cy.request({
        method: 'GET',
        url: '/api/items/search?query=Pizza'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        // Todos os resultados devem conter 'Pizza' no nome
        response.body.forEach(item => {
          expect(item.name.toLowerCase()).to.include('pizza');
        });
      });
    });

    it('should search items by category', () => {
      cy.request({
        method: 'GET',
        url: '/api/items/search?category=Pizza'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        // Todos os resultados devem ter categoria 'Pizza'
        response.body.forEach(item => {
          expect(item.category).to.eq('Pizza');
        });
      });
    });

    it('should return empty array for non-matching search', () => {
      cy.request({
        method: 'GET',
        url: '/api/items/search?query=NonExistentItem123'
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(0);
      });
    });
  });

  describe('POST /api/items (Create Item - Admin Only)', () => {
    it('should create item successfully with admin token', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      cy.createItem(testItem, adminToken).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', testItem.name);
        expect(response.body).to.have.property('description', testItem.description);
        expect(response.body).to.have.property('price', testItem.price);
        expect(response.body).to.have.property('category', testItem.category);
        expect(response.body).to.have.property('isAvailable', testItem.isAvailable);
        
        createdItemId = response.body.id;
      });
    });

    it('should fail to create item without authentication', () => {
      cy.request({
        method: 'POST',
        url: '/api/items',
        body: testItem,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to create item with user token (non-admin)', () => {
      cy.request({
        method: 'POST',
        url: '/api/items',
        body: testItem,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should fail to create item with invalid data', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      const invalidItem = { name: '', price: -10 }; // Nome vazio e preço negativo

      cy.request({
        method: 'POST',
        url: '/api/items',
        body: invalidItem,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('PUT /api/items/:id (Update Item - Admin Only)', () => {
    beforeEach(() => {
      if (adminToken) {
        cy.createItem(testItem, adminToken).then((response) => {
          createdItemId = response.body.id;
        });
      }
    });

    it('should update item successfully with admin token', () => {
      if (!adminToken || !createdItemId) {
        cy.log('Admin token or item not available, skipping admin test');
        return;
      }

      const updatedData = {
        name: 'Updated Pizza Name',
        price: 30.50,
        isAvailable: false
      };

      cy.updateItem(createdItemId, updatedData, adminToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', updatedData.name);
        expect(response.body).to.have.property('price', updatedData.price);
        expect(response.body).to.have.property('isAvailable', updatedData.isAvailable);
      });
    });

    it('should fail to update item without authentication', () => {
      if (!createdItemId) {
        cy.log('Item not available, skipping test');
        return;
      }

      const updatedData = { name: 'Updated Name' };

      cy.request({
        method: 'PUT',
        url: `/api/items/${createdItemId}`,
        body: updatedData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to update item with user token (non-admin)', () => {
      if (!createdItemId) {
        cy.log('Item not available, skipping test');
        return;
      }

      const updatedData = { name: 'Updated Name' };

      cy.request({
        method: 'PUT',
        url: `/api/items/${createdItemId}`,
        body: updatedData,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should return 404 for non-existent item', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      const nonExistentId = 99999;
      const updatedData = { name: 'Updated Name' };

      cy.request({
        method: 'PUT',
        url: `/api/items/${nonExistentId}`,
        body: updatedData,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('DELETE /api/items/:id (Delete Item - Admin Only)', () => {
    beforeEach(() => {
      if (adminToken) {
        cy.createItem(testItem, adminToken).then((response) => {
          createdItemId = response.body.id;
        });
      }
    });

    it('should delete item successfully with admin token', () => {
      if (!adminToken || !createdItemId) {
        cy.log('Admin token or item not available, skipping admin test');
        return;
      }

      cy.deleteItem(createdItemId, adminToken).then((response) => {
        expect(response.status).to.eq(204);
      });

      // Verificar se o item foi realmente deletado
      cy.request({
        method: 'GET',
        url: `/api/items/${createdItemId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to delete item without authentication', () => {
      if (!createdItemId) {
        cy.log('Item not available, skipping test');
        return;
      }

      cy.request({
        method: 'DELETE',
        url: `/api/items/${createdItemId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to delete item with user token (non-admin)', () => {
      if (!createdItemId) {
        cy.log('Item not available, skipping test');
        return;
      }

      cy.request({
        method: 'DELETE',
        url: `/api/items/${createdItemId}`,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should return 404 for non-existent item', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      const nonExistentId = 99999;

      cy.request({
        method: 'DELETE',
        url: `/api/items/${nonExistentId}`,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });
});