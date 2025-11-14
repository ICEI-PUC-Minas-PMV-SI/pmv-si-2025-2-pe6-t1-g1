describe('User Controller Tests', () => {
  let testUser;
  let userToken;
  
  beforeEach(() => {
    // Criar dados de teste únicos para cada teste
    testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '11999999999'
    };
  });

  describe('POST /api/user (Register)', () => {
    it('should register a new user successfully', () => {
      cy.registerUser(testUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', testUser.name);
        expect(response.body).to.have.property('email', testUser.email);
        expect(response.body).to.have.property('phone', testUser.phone);
        expect(response.body).to.not.have.property('password');
      });
    });

    it('should fail to register user with invalid email', () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      cy.request({
        method: 'POST',
        url: '/api/user',
        body: invalidUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should fail to register user with missing required fields', () => {
      const incompleteUser = { email: testUser.email };
      
      cy.request({
        method: 'POST',
        url: '/api/user',
        body: incompleteUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });

    it('should fail to register user with duplicate email', () => {
      // Primeiro registro
      cy.registerUser(testUser).then(() => {
        // Tentativa de registro duplicado
        cy.request({
          method: 'POST',
          url: '/api/user',
          body: testUser,
          failOnStatusCode: false
        }).then((response) => {
          expect(response.status).to.eq(400);
        });
      });
    });
  });

  describe('POST /api/user/login (Login)', () => {
    beforeEach(() => {
      // Registrar usuário antes de cada teste de login
      cy.registerUser(testUser);
    });

    it('should login successfully with valid credentials', () => {
      const credentials = { email: testUser.email, password: testUser.password };
      
      cy.loginUser(credentials).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.have.property('email', testUser.email);
        expect(response.body.user).to.not.have.property('password');
        
        // Salvar token para outros testes
        userToken = response.body.token;
      });
    });

    it('should fail login with invalid email', () => {
      const invalidCredentials = { email: 'invalid@example.com', password: testUser.password };
      
      cy.request({
        method: 'POST',
        url: '/api/user/login',
        body: invalidCredentials,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail login with invalid password', () => {
      const invalidCredentials = { email: testUser.email, password: 'wrongpassword' };
      
      cy.request({
        method: 'POST',
        url: '/api/user/login',
        body: invalidCredentials,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail login with missing credentials', () => {
      cy.request({
        method: 'POST',
        url: '/api/user/login',
        body: {},
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  describe('GET /api/user (Get Profile)', () => {
    beforeEach(() => {
      // Registrar e fazer login do usuário
      cy.registerUser(testUser).then(() => {
        cy.loginUser({ email: testUser.email, password: testUser.password }).then((response) => {
          userToken = response.body.token;
        });
      });
    });

    it('should get user profile successfully with valid token', () => {
      cy.getUserProfile(userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('name', testUser.name);
        expect(response.body).to.have.property('email', testUser.email);
        expect(response.body).to.have.property('phone', testUser.phone);
        expect(response.body).to.not.have.property('password');
      });
    });

    it('should fail to get profile without token', () => {
      cy.request({
        method: 'GET',
        url: '/api/user',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to get profile with invalid token', () => {
      cy.request({
        method: 'GET',
        url: '/api/user',
        headers: {
          'Authorization': 'Bearer invalid-token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('PUT /api/user (Update Profile)', () => {
    beforeEach(() => {
      cy.registerUser(testUser).then(() => {
        cy.loginUser({ email: testUser.email, password: testUser.password }).then((response) => {
          userToken = response.body.token;
        });
      });
    });

    it('should update user profile successfully', () => {
      const updatedData = {
        name: 'Updated Name',
        phone: '11888888888'
      };

      cy.updateUserProfile(updatedData, userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', updatedData.name);
        expect(response.body).to.have.property('phone', updatedData.phone);
        expect(response.body).to.have.property('email', testUser.email); // Email não deve mudar
      });
    });

    it('should fail to update profile without token', () => {
      const updatedData = { name: 'Updated Name' };

      cy.request({
        method: 'PUT',
        url: '/api/user',
        body: updatedData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should handle partial updates', () => {
      const partialUpdate = { name: 'Only Name Updated' };

      cy.updateUserProfile(partialUpdate, userToken).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', partialUpdate.name);
        expect(response.body).to.have.property('email', testUser.email);
        expect(response.body).to.have.property('phone', testUser.phone);
      });
    });
  });

  describe('DELETE /api/user (Delete Profile)', () => {
    beforeEach(() => {
      cy.registerUser(testUser).then(() => {
        cy.loginUser({ email: testUser.email, password: testUser.password }).then((response) => {
          userToken = response.body.token;
        });
      });
    });

    it('should delete user profile successfully', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/user',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(204);
      });

      // Verificar se o usuário foi realmente deletado tentando fazer login
      cy.request({
        method: 'POST',
        url: '/api/user/login',
        body: { email: testUser.email, password: testUser.password },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should fail to delete profile without token', () => {
      cy.request({
        method: 'DELETE',
        url: '/api/user',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });

  describe('Admin User Management', () => {
    let adminToken;
    let regularUserToken;
    let regularUserId;

    beforeEach(() => {
      // Criar usuário admin (assumindo que existe um admin padrão)
      const adminCredentials = { email: 'admin@admin.com', password: 'admin123' };
      
      // Criar usuário regular para testes
      cy.registerUser(testUser).then((response) => {
        regularUserId = response.body.id;
        
        cy.loginUser({ email: testUser.email, password: testUser.password }).then((response) => {
          regularUserToken = response.body.token;
        });
      });

      // Tentar login como admin (pode falhar se admin não existir)
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
    });

    it('should get user by ID with admin privileges', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      cy.request({
        method: 'GET',
        url: `/api/user/${regularUserId}`,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id', regularUserId);
        expect(response.body).to.have.property('email', testUser.email);
      });
    });

    it('should fail to get user by ID without admin privileges', () => {
      cy.request({
        method: 'GET',
        url: `/api/user/${regularUserId}`,
        headers: {
          'Authorization': `Bearer ${regularUserToken}`
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403);
      });
    });

    it('should update user by ID with admin privileges', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      const updateData = { name: 'Admin Updated Name' };

      cy.request({
        method: 'PUT',
        url: `/api/user/${regularUserId}`,
        body: updateData,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('name', updateData.name);
      });
    });

    it('should delete user by ID with admin privileges', () => {
      if (!adminToken) {
        cy.log('Admin token not available, skipping admin test');
        return;
      }

      cy.request({
        method: 'DELETE',
        url: `/api/user/${regularUserId}`,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }).then((response) => {
        expect(response.status).to.eq(204);
      });
    });
  });
});