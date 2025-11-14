describe('Orders Controller Tests', () => {
  let userToken;
  let adminToken;
  let testItem;
  let createdItemId;
  let testUser;
  let createdOrderId;

  beforeEach(() => {
    // Criar usuário de teste
    cy.createTestUser().then(({ userData, response }) => {
      testUser = userData;
      cy.loginUser({ email: userData.email, password: userData.password }).then((loginResponse) => {
        userToken = loginResponse.body.token;
      });
    });

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

  describe('POST /api/orders (Create Order)', () => {
    it('should create order successfully from cart items', () => {
      if (!userToken || !createdItemId) {
        cy.log('User token or item ID not available, skipping test');
        return;
      }

      // Primeiro adicionar item ao carrinho
      const cartItem = {
        itemId: createdItemId,
        quantity: 2
      };
      
      cy.addItemToCart(cartItem, userToken).then(() => {
        // Então criar o pedido
        cy.createOrder(userToken).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('userId');
          expect(response.body).to.have.property('status');
          expect(response.body).to.have.property('totalAmount');
          expect(response.body).to.have.property('createdAt');
          expect(response.body).to.have.property('orderItems');
          expect(response.body.orderItems).to.be.an('array');
          expect(response.body.orderItems.length).to.be.greaterThan(0);
          
          createdOrderId = response.body.id;
        });
      });
    });

    it('should fail to create order without authentication', () => {
      cy.request({
        method: 'POST',
        url: '/api/orders',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to create order with empty cart', () => {
      if (!userToken) {
        cy.log('User token not available, skipping test');
        return;
      }

      // Limpar carrinho primeiro
      cy.clearCart(userToken).then(() => {
        cy.request({
          method: 'POST',
          url: '/api/orders',
          headers: {
            'Authorization': `Bearer ${userToken}`
          },
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });

    it('should clear cart after successful order creation', () => {
      if (!userToken || !createdItemId) {
        cy.log('User token or item ID not available, skipping test');
        return;
      }

      // Primeiro adicionar item ao carrinho
      const cartItem = {
        itemId: createdItemId,
        quantity: 1
      };

      cy.addItemToCart(cartItem, userToken).then(() => {
        // Então criar o pedido
        cy.createOrder(userToken).then((response) => {
          expect(response.status).to.eq(201);

          // Verificar se o carrinho foi limpo
          cy.getCart(userToken).then((cartResponse) => {
            expect(cartResponse.body).to.have.length(0);
          });
        });
      });
    });
  });

  describe('GET /api/orders (Get User Orders)', () => {
    beforeEach(() => {
      // Criar um pedido para teste
      if (createdItemId && userToken) {
        const cartItem = {
          itemId: createdItemId,
          quantity: 1
        };
        cy.addItemToCart(cartItem, userToken).then(() => {
          cy.createOrder(userToken).then((response) => {
            createdOrderId = response.body.id;
          });
        });
      }
    });

    it('should get user orders successfully', () => {
      if (!userToken) {
        cy.log('User token not available, skipping test');
        return;
      }

      cy.getOrders(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        
        if (response.body.length > 0) {
          const order = response.body[0];
          expect(order).to.have.property('id');
          expect(order).to.have.property('userId');
          expect(order).to.have.property('status');
          expect(order).to.have.property('totalAmount');
          expect(order).to.have.property('createdAt');
        }
      });
    });

    it('should fail to get orders without authentication', () => {
      cy.request({
        method: 'GET',
        url: '/api/orders',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should return empty array for user with no orders', () => {
      // Criar novo usuário sem pedidos
      cy.createTestUser().then(({ userData }) => {
        cy.loginUser({ email: userData.email, password: userData.password }).then((loginResponse) => {
          const newUserToken = loginResponse.body.token;
          
          cy.getOrders(newUserToken).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.length(0);
          });
        });
      });
    });
  });

  describe('GET /api/orders/:id (Get Order by ID)', () => {
    beforeEach(() => {
      // Criar um pedido para teste
      if (createdItemId && userToken) {
        const cartItem = {
          itemId: createdItemId,
          quantity: 1
        };
        cy.addItemToCart(cartItem, userToken).then(() => {
          cy.createOrder(userToken).then((response) => {
            createdOrderId = response.body.id;
          });
        });
      }
    });

    it('should get order by ID successfully', () => {
      if (!userToken || !createdOrderId) {
        cy.log('User token or order not available, skipping test');
        return;
      }

      cy.getOrder(createdOrderId, userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', createdOrderId);
        expect(response.body).to.have.property('userId');
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('totalAmount');
        expect(response.body).to.have.property('orderItems');
        expect(response.body.orderItems).to.be.an('array');
      });
    });

    it('should fail to get order without authentication', () => {
      if (!createdOrderId) {
        cy.log('Order not available, skipping test');
        return;
      }

      cy.request({
        method: 'GET',
        url: `/api/orders/${createdOrderId}`,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to get non-existent order', () => {
      if (!userToken) {
        cy.log('User token not available, skipping test');
        return;
      }

      const nonExistentId = 99999;

      cy.request({
        method: 'GET',
        url: `/api/orders/${nonExistentId}`,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to get another user\'s order', () => {
      if (!createdOrderId) {
        cy.log('Order not available, skipping test');
        return;
      }

      // Criar outro usuário
      cy.createTestUser().then(({ userData }) => {
        cy.loginUser({ email: userData.email, password: userData.password }).then((loginResponse) => {
          const otherUserToken = loginResponse.body.token;
          
          cy.request({
            method: 'GET',
            url: `/api/orders/${createdOrderId}`,
            headers: {
              'Authorization': `Bearer ${otherUserToken}`
            },
            failOnStatusCode: false
          }).then((response) => {
            expect(response.status).to.eq(403);
          });
        });
      });
    });
  });

  describe('PUT /api/orders/:id/status (Update Order Status - Admin Only)', () => {
    beforeEach(() => {
      // Criar um pedido para teste
      if (createdItemId && userToken) {
        const cartItem = {
          itemId: createdItemId,
          quantity: 1
        };
        cy.addItemToCart(cartItem, userToken).then(() => {
          cy.createOrder(userToken).then((response) => {
            createdOrderId = response.body.id;
          });
        });
      }
    });

    it('should update order status successfully with admin token', () => {
      if (!adminToken || !createdOrderId) {
        cy.log('Admin token or order not available, skipping admin test');
        return;
      }

      const newStatus = { status: 'InProgress' };

      cy.updateOrderStatus(createdOrderId, newStatus, adminToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('status', 'InProgress');
      });
    });

    it('should fail to update order status without authentication', () => {
      if (!createdOrderId) {
        cy.log('Order not available, skipping test');
        return;
      }

      const newStatus = { status: 'InProgress' };

      cy.request({
        method: 'PUT',
        url: `/api/orders/${createdOrderId}/status`,
        body: newStatus,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to update order status with user token (non-admin)', () => {
      if (!userToken || !createdOrderId) {
        cy.log('User token or order not available, skipping test');
        return;
      }

      const newStatus = { status: 'InProgress' };

      cy.request({
        method: 'PUT',
        url: `/api/orders/${createdOrderId}/status`,
        body: newStatus,
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should fail to update non-existent order status', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      const nonExistentId = 99999;
      const newStatus = { status: 'InProgress' };

      cy.request({
        method: 'PUT',
        url: `/api/orders/${nonExistentId}/status`,
        body: newStatus,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should fail to update with invalid status', () => {
      if (!adminToken || !createdOrderId) {
        cy.log('Admin token or order not available, skipping admin test');
        return;
      }

      const invalidStatus = { status: 'InvalidStatus' };

      cy.request({
        method: 'PUT',
        url: `/api/orders/${createdOrderId}/status`,
        body: invalidStatus,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should handle all valid order statuses', () => {
      if (!adminToken || !createdOrderId) {
        cy.log('Admin token or order not available, skipping admin test');
        return;
      }

      const validStatuses = ['Pending', 'InProgress', 'Ready', 'Delivered', 'Cancelled'];

      validStatuses.forEach((status, index) => {
        cy.updateOrderStatus(createdOrderId, { status }, adminToken).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('status', status);
        });
      });
    });
  });

  describe('Order Integration Tests', () => {
    it('should handle complete order workflow', () => {
      if (!createdItemId || !userToken || !adminToken) {
        cy.log('Required tokens or item not available, skipping integration test');
        return;
      }

      // 1. Adicionar itens ao carrinho
      const cartItem = { itemId: createdItemId, quantity: 3 };
      cy.addItemToCart(cartItem, userToken).then(() => {

        // 2. Criar pedido
        cy.createOrder(userToken).then((response) => {
          const orderId = response.body.id;
          const expectedTotal = testItem.price * 3;

          expect(response.body).to.have.property('totalAmount');
          expect(response.body.totalAmount).to.be.closeTo(expectedTotal, 0.01);

          // 3. Verificar pedido criado
          cy.getOrder(orderId, userToken).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('status', 'Pending');

            // 4. Atualizar status (admin)
            cy.updateOrderStatus(orderId, { status: 'InProgress' }, adminToken).then(() => {

              // 5. Verificar status atualizado
              cy.getOrder(orderId, userToken).then((response) => {
                expect(response.body).to.have.property('status', 'InProgress');

                // 6. Finalizar pedido
                cy.updateOrderStatus(orderId, { status: 'Delivered' }, adminToken).then(() => {

                  // 7. Verificar pedido finalizado
                  cy.getOrder(orderId, userToken).then((response) => {
                    expect(response.body).to.have.property('status', 'Delivered');
                  });
                });
              });
            });
          });
        });
      });
    });

    it('should calculate order total correctly with multiple items', () => {
      if (!createdItemId || !userToken || !adminToken) {
        cy.log('Required tokens or item not available, skipping integration test');
        return;
      }

      // Criar outro item
      const secondItem = {
        name: `Test Drink ${Date.now()}`,
        description: 'Test drink',
        price: 5.50,
        category: 'Drinks',
        isAvailable: true
      };

      cy.createItem(secondItem, adminToken).then((itemResponse) => {
        const secondItemId = itemResponse.body.id;

        // Adicionar ambos os itens ao carrinho
        cy.addItemToCart({ itemId: createdItemId, quantity: 2 }, userToken).then(() => {
          cy.addItemToCart({ itemId: secondItemId, quantity: 1 }, userToken).then(() => {

            // Criar pedido
            cy.createOrder(userToken).then((response) => {
              const expectedTotal = (testItem.price * 2) + (secondItem.price * 1);
              expect(response.body.totalAmount).to.be.closeTo(expectedTotal, 0.01);
              expect(response.body.orderItems).to.have.length(2);
            });
          });
        });
      });
    });
  });
});