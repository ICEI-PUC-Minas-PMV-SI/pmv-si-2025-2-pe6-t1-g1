describe('Testes completos da API /api/cart', () => {

  // URL base da sua API. Certifique-se de que a API esteja rodando neste endereço.
  const apiUrl = 'http://localhost:5123/api/cart';

  // Dados que usaremos para o teste.
  // IMPORTANTE: O 'itemId' deve existir no seu banco de dados (vindo do sample_data.sql).
  // O item com ID 5 é a "Pizza Calabresa" no seu script.
  const itemParaAdicionar = {
    itemId: 5, 
    quantity: 1
  };

  const quantidadeAtualizada = {
    quantity: 4
  };

  it('Deve executar o ciclo completo de CRUD: Adicionar, Listar, Atualizar e Deletar um item', () => {

    // --- 1. ADICIONAR ITEM (POST) ---
    cy.request({
      method: 'POST',
      url: apiUrl,
      body: itemParaAdicionar
    }).then((responseAdicionar) => {
      expect(responseAdicionar.status).to.eq(201); // Verifica se o status é 201 Created
      expect(responseAdicionar.body).to.have.property('id'); // Verifica se o item criado tem um ID
      
      const idItemNoCarrinho = responseAdicionar.body.id; // Guarda o ID do item que acabamos de criar no carrinho

      // --- 2. LISTAR ITENS (GET) E VERIFICAR A CRIAÇÃO ---
      cy.request('GET', apiUrl).then((responseListar) => {
        expect(responseListar.status).to.eq(200); // Verifica se o status é 200 OK
        
        // Procura na lista de itens do carrinho se o item que acabamos de adicionar está lá
        const itemEncontrado = responseListar.body.items.find(item => item.cartItemId === idItemNoCarrinho);
        expect(itemEncontrado).to.not.be.undefined; // Garante que o item foi encontrado
        expect(itemEncontrado.quantity).to.eq(itemParaAdicionar.quantity); // Verifica se a quantidade está correta
      });

      // --- 3. ATUALIZAR ITEM (PUT) ---
      cy.request({
        method: 'PUT',
        url: `${apiUrl}/${idItemNoCarrinho}`, // Usa o ID do item que foi criado
        body: quantidadeAtualizada
      }).then((responseAtualizar) => {
        expect(responseAtualizar.status).to.eq(200); // Verifica se o status é 200 OK
        expect(responseAtualizar.body.quantity).to.eq(quantidadeAtualizada.quantity); // Verifica se a quantidade foi atualizada
      });

      // --- 4. DELETAR ITEM (DELETE) ---
      cy.request('DELETE', `${apiUrl}/${idItemNoCarrinho}`).then((responseDeletar) => {
        expect(responseDeletar.status).to.eq(204); // Verifica se o status é 204 No Content (sucesso na deleção)
      });

      // --- 5. VERIFICAR A DELEÇÃO (GET) ---
      cy.request('GET', apiUrl).then((responseListarFinal) => {
        expect(responseListarFinal.status).to.eq(200);
        
        // Procura novamente pelo item na lista do carrinho
        const itemDeletado = responseListarFinal.body.items.find(item => item.cartItemId === idItemNoCarrinho);
        expect(itemDeletado).to.be.undefined; // Garante que o item NÃO foi encontrado
      });
    });
  });
});