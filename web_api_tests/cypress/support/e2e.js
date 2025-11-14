import './commands'
Cypress.on('window:before:load', (win) => {
  const originalFetch = win.fetch;
  win.fetch = function(...args) {
    return originalFetch.apply(this, args);
  };
});

Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  return cy.request({
    method: method,
    url: url,
    body: body,
    headers: {
      'Content-Type': 'application/json'
    },
    failOnStatusCode: false
  });
});