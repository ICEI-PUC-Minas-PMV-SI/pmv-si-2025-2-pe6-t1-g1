describe('Hello Controller API Tests', () => {
  
  beforeEach(() => {
    cy.log('Testing Hello Controller endpoints');
  });

  describe('GET /api/hello', () => {
    it('should return hello world message', () => {
      cy.getHelloWorld().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include('Hello World from Pizzaria API!');
      });
    });

    it('should have correct response headers', () => {
      cy.request('GET', '/api/hello').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers).to.have.property('content-type');
      });
    });
  });

});