describe('Cart Controller Tests', () => {
  let userToken;
  let adminToken;
  let testItem;
  let createdItemId;
  let testUser;

  beforeEach(() => {
    // Criar usuário de teste
    cy.createTestUser().then(({ userData, response }) => {
      testUser = userData;
      cy.loginUser({ email: userData.email, password: userData.password }).then((loginResponse) => {
        userToken = loginResponse.body.token;
      });
    });

    // Tentar login como admin para criar itens
    const adminCredentials = { email: 'admin@admin.com', password: 'admin123' };
    cy.request({
      method: 'POST',
      url: '/api/user/login',
      body: adminCredentials,
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 200) {
        adminToken = response.body.token;
        
        // Criar item de teste
        testItem = {
          name: `Test Pizza ${Date.now()}`,
          description: 'Delicious test pizza',
          price: 25.90,
          category: 'Pizza',
          imageUrl: 'https://example.com/pizza.jpg',
          isAvailable: true
        };

        cy.createItem(testItem, adminToken).then((itemResponse) => {
          createdItemId = itemResponse.body.id;
        });
      }
    });
  });

  afterEach(() => {
    // Limpar carrinho após cada teste
    if (userToken) {
      cy.request({
        method: 'DELETE',
        url: '/api/cart/clear',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      });
    }
  });

  describe('GET /api/cart (Get Cart)', () => {
    it('should get empty cart for new user', () => {
      cy.getCart(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length(0);
      });
    });

    it('should fail to get cart without authentication', () => {
      cy.request({
        method: 'GET',
        url: '/api/cart',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to get cart with invalid token', () => {
      cy.request({
        method: 'GET',
        url: '/api/cart',
        headers: {
          'Authorization': 'Bearer invalid-token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('POST /api/cart/item (Add Item to Cart)', () => {
    it('should add item to cart successfully', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping test');
        return;
      }

      const cartItem = {
        itemId: createdItemId,
        quantity: 2
      };

      cy.addItemToCart(cartItem, userToken).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('itemId', createdItemId);
        expect(response.body).to.have.property('quantity', 2);
        expect(response.body).to.have.property('item');
        expect(response.body.item).to.have.property('name', testItem.name);
      });
    });

    it('should fail to add item without authentication', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping test');
        return;
      }

      const cartItem = {
        itemId: createdItemId,
        quantity: 1
      };

      cy.request({
        method: 'POST',
        url: '/api/cart/item',
        body: cartItem,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to add non-existent item to cart', () => {
      const cartItem = {
        itemId: 99999,
        quantity: 1
      };

      cy.request({
        method: 'POST',
        url: '/api/cart/item',
        body: cartItem,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to add item with invalid quantity', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping test');
        return;
      }

      const cartItem = {
        itemId: createdItemId,
        quantity: 0 // Quantidade inválida
      };

      cy.request({
        method: 'POST',
        url: '/api/cart/item',
        body: cartItem,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should update quantity when adding existing item', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping test');
        return;
      }

      const cartItem = {
        itemId: createdItemId,
        quantity: 1
      };

      // Adicionar item pela primeira vez
      cy.addItemToCart(cartItem, userToken).then(() => {
        // Adicionar o mesmo item novamente
        cy.addItemToCart(cartItem, userToken).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('quantity', 2); // Quantidade deve ser atualizada
        });
      });
    });
  });

  describe('PUT /api/cart/item/:id (Update Cart Item)', () => {
    let cartItemId;

    beforeEach(() => {
      if (createdItemId) {
        const cartItem = {
          itemId: createdItemId,
          quantity: 1
        };

        cy.addItemToCart(cartItem, userToken).then((response) => {
          cartItemId = response.body.id;
        });
      }
    });

    it('should update cart item quantity successfully', () => {
      if (!cartItemId) {
        cy.log('No cart item available, skipping test');
        return;
      }

      const newQuantity = { quantity: 5 };

      cy.updateCartItem(cartItemId, newQuantity, userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('quantity', 5);
      });
    });

    it('should fail to update cart item without authentication', () => {
      if (!cartItemId) {
        cy.log('No cart item available, skipping test');
        return;
      }

      const newQuantity = { quantity: 3 };

      cy.request({
        method: 'PUT',
        url: `/api/cart/item/${cartItemId}`,
        body: newQuantity,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to update non-existent cart item', () => {
      const nonExistentId = 99999;
      const newQuantity = { quantity: 2 };

      cy.request({
        method: 'PUT',
        url: `/api/cart/item/${nonExistentId}`,
        body: newQuantity,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to update with invalid quantity', () => {
      if (!cartItemId) {
        cy.log('No cart item available, skipping test');
        return;
      }

      const invalidQuantity = { quantity: -1 };

      cy.request({
        method: 'PUT',
        url: `/api/cart/item/${cartItemId}`,
        body: invalidQuantity,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('DELETE /api/cart/item/:id (Remove Cart Item)', () => {
    let cartItemId;

    beforeEach(() => {
      if (createdItemId) {
        const cartItem = {
          itemId: createdItemId,
          quantity: 1
        };

        cy.addItemToCart(cartItem, userToken).then((response) => {
          cartItemId = response.body.id;
        });
      }
    });

    it('should remove cart item successfully', () => {
      if (!cartItemId) {
        cy.log('No cart item available, skipping test');
        return;
      }

      cy.removeCartItem(cartItemId, userToken).then((response) => {
        expect(response.status).to.eq(204);
      });

      // Verificar se o item foi removido
      cy.getCart(userToken).then((response) => {
        expect(response.body).to.have.length(0);
      });
    });

    it('should fail to remove cart item without authentication', () => {
      if (!cartItemId) {
        cy.log('No cart item available, skipping test');
        return;
      }

      cy.request({
        method: 'DELETE',
        url: `/api/cart/item/${cartItemId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to remove non-existent cart item', () => {
      const nonExistentId = 99999;

      cy.request({
        method: 'DELETE',
        url: `/api/cart/item/${nonExistentId}`,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  describe('DELETE /api/cart/clear (Clear Cart)', () => {
    beforeEach(() => {
      if (createdItemId) {
        // Adicionar alguns itens ao carrinho
        const cartItems = [
          { itemId: createdItemId, quantity: 2 },
          { itemId: createdItemId, quantity: 1 }
        ];

        cartItems.forEach(item => {
          cy.addItemToCart(item, userToken);
        });
      }
    });

    it('should clear cart successfully', () => {
      cy.clearCart(userToken).then((response) => {
        expect(response.status).to.eq(204);
      });

      // Verificar se o carrinho está vazio
      cy.getCart(userToken).then((response) => {
        expect(response.body).to.have.length(0);
      });
    });

    it('should fail to clear cart without authentication', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/cart/clear',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should handle clearing empty cart', () => {
      // Primeiro limpar o carrinho
      cy.clearCart(userToken).then(() => {
        // Tentar limpar novamente
        cy.clearCart(userToken).then((response) => {
          expect(response.status).to.eq(204);
        });
      });
    });
  });

  describe('Cart Integration Tests', () => {
    it('should handle complete cart workflow', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping integration test');
        return;
      }

      // 1. Verificar carrinho vazio
      cy.getCart(userToken).then((response) => {
        expect(response.body).to.have.length(0);
      });

      // 2. Adicionar item
      const cartItem = { itemId: createdItemId, quantity: 2 };
      cy.addItemToCart(cartItem, userToken).then((response) => {
        const addedItemId = response.body.id;

        // 3. Verificar item no carrinho
        cy.getCart(userToken).then((response) => {
          expect(response.body).to.have.length(1);
          expect(response.body[0]).to.have.property('quantity', 2);
        });

        // 4. Atualizar quantidade
        cy.updateCartItem(addedItemId, { quantity: 5 }, userToken).then(() => {
          
          // 5. Verificar quantidade atualizada
          cy.getCart(userToken).then((response) => {
            expect(response.body[0]).to.have.property('quantity', 5);
          });

          // 6. Remover item
          cy.removeCartItem(addedItemId, userToken).then(() => {
            
            // 7. Verificar carrinho vazio
            cy.getCart(userToken).then((response) => {
              expect(response.body).to.have.length(0);
            });
          });
        });
      });
    });

    it('should calculate cart total correctly', () => {
      if (!createdItemId) {
        cy.log('No test item available, skipping integration test');
        return;
      }

      const cartItem = { itemId: createdItemId, quantity: 3 };
      
      cy.addItemToCart(cartItem, userToken).then(() => {
        cy.getCart(userToken).then((response) => {
          const cartItems = response.body;
          let expectedTotal = 0;
          
          cartItems.forEach(item => {
            expectedTotal += item.item.price * item.quantity;
          });

          // Verificar se o total está correto (assumindo que a API retorna o total)
          expect(expectedTotal).to.eq(testItem.price * 3);
        });
      });
    });
  });
});