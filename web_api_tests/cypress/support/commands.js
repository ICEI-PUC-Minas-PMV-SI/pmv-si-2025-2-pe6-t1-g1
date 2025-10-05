
// Hello Controller Commands
Cypress.Commands.add('getApiStatus', () => {
  return cy.request('GET', '/api/hello/status');
});

Cypress.Commands.add('getHelloWorld', () => {
  return cy.request('GET', '/api/hello');
});

Cypress.Commands.add('getWelcomeMessage', (name) => {
  return cy.request('GET', `/api/hello/welcome/${name}`);
});

// User Controller Commands
Cypress.Commands.add('registerUser', (userData) => {
  return cy.request('POST', '/api/user', userData);
});

Cypress.Commands.add('loginUser', (credentials) => {
  return cy.request('POST', '/api/user/login', credentials);
});

Cypress.Commands.add('getUserProfile', (token) => {
  return cy.request({
    method: 'GET',
    url: '/api/user',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('updateUserProfile', (userData, token) => {
  return cy.request({
    method: 'PUT',
    url: '/api/user',
    body: userData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

// Items Controller Commands
Cypress.Commands.add('createItem', (itemData, token) => {
  return cy.request({
    method: 'POST',
    url: '/api/items',
    body: itemData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('getItems', () => {
  return cy.request('GET', '/api/items');
});

Cypress.Commands.add('getItem', (id) => {
  return cy.request('GET', `/api/items/${id}`);
});

Cypress.Commands.add('updateItem', (id, itemData, token) => {
  return cy.request({
    method: 'PUT',
    url: `/api/items/${id}`,
    body: itemData,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('deleteItem', (id, token) => {
  return cy.request({
    method: 'DELETE',
    url: `/api/items/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

// Cart Controller Commands
Cypress.Commands.add('addItemToCart', (cartItem, token) => {
  return cy.request({
    method: 'POST',
    url: '/api/cart/item',
    body: cartItem,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('getCart', (token) => {
  return cy.request({
    method: 'GET',
    url: '/api/cart',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('updateCartItem', (id, quantity, token) => {
  return cy.request({
    method: 'PUT',
    url: `/api/cart/item/${id}`,
    body: quantity,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('removeCartItem', (id, token) => {
  return cy.request({
    method: 'DELETE',
    url: `/api/cart/item/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('clearCart', (token) => {
  return cy.request({
    method: 'DELETE',
    url: '/api/cart/clear',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

// Orders Controller Commands
Cypress.Commands.add('createOrder', (token) => {
  return cy.request({
    method: 'POST',
    url: '/api/orders',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('getOrders', (token) => {
  return cy.request({
    method: 'GET',
    url: '/api/orders',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('getOrder', (id, token) => {
  return cy.request({
    method: 'GET',
    url: `/api/orders/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

Cypress.Commands.add('updateOrderStatus', (id, status, token) => {
  return cy.request({
    method: 'PUT',
    url: `/api/orders/${id}/status`,
    body: status,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
});

// Utility Commands
Cypress.Commands.add('createTestUser', () => {
  const userData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    phone: '11999999999'
  };
  
  return cy.registerUser(userData).then((response) => {
    return { userData, response };
  });
});

Cypress.Commands.add('loginAndGetToken', (email = null, password = null) => {
  if (!email || !password) {
    return cy.createTestUser().then(({ userData }) => {
      return cy.loginUser({ email: userData.email, password: userData.password }).then((response) => {
        return response.body.token;
      });
    });
  } else {
    return cy.loginUser({ email, password }).then((response) => {
      return response.body.token;
    });
  }
});