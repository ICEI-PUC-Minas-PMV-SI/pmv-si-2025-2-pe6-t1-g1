
Cypress.Commands.add('getApiStatus', () => {
  return cy.request('GET', '/api/hello/status');
});

Cypress.Commands.add('getHelloWorld', () => {
  return cy.request('GET', '/api/hello');
});

Cypress.Commands.add('getWelcomeMessage', (name) => {
  return cy.request('GET', `/api/hello/welcome/${name}`);
});