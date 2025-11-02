document.addEventListener('DOMContentLoaded', () => {
	
  // URL base
  const API_URL = 'http://localhost:5123/api';

  // Seleciona elementos HTML usados para exibir mensagens e informações do carrinho
  const messageDiv = document.getElementById('message');
  const cartListDiv = document.getElementById('cart-items-list');
  const totalPriceEl = document.getElementById('total-price');
  const subtotalEl = document.getElementById('subtotal');
  const clearCartBtn = document.getElementById('clear-cart-btn');

  // Função responsável por retornar o token JWT
  function getToken() {

	//  Troque esse token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1IiwiZW1haWwiOiJtYW51YWxAZW1haWwuY29tIiwicm9sZSI6IlVTRVIiLCJuYmYiOjE3NjIwNDExNTEsImV4cCI6MTc2MjA0ODM1MSwiaWF0IjoxNzYyMDQxMTUxLCJpc3MiOiJXZWJBcGlQaXp6YXJpYSIsImF1ZCI6IldlYkFwaVBpenphcmlhIn0.cWlxjcVJQd6ufPIkBQOCvUW8em1vmCZIUr_12fQXeXY';

    if (!token) {
      showMessage('Você não está autenticado. Faça login primeiro.', 'error');
      return null;
    }
    return token;
  }
  
  // Exibe mensagens de status (sucesso, erro, etc.)
  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
  }

  // Renderiza a lista de itens do carrinho na tela
  function renderCart(items) {

    cartListDiv.innerHTML = '';

    if (items.length === 0) {
      cartListDiv.innerHTML = '<p style="text-align: center;">Seu carrinho está vazio.</p>';
      return;
    }

    // Cria o HTML de cada item do carrinho
    items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';

      itemEl.innerHTML = `
        <div class="item-details">
          <span class="item-name">${item.itemName}</span>
          <span class="item-price">R$ ${item.itemPrice.toFixed(2)}</span>
        </div>
        <div class="item-actions">
          <input 
            type="number" 
            class="item-quantity" 
            value="${item.quantity}" 
            min="1" 
            data-id="${item.id}" 
          />
          <button class="remove-btn" data-id="${item.id}">Remover</button>
        </div>
      `;
      cartListDiv.appendChild(itemEl);
    });
  }


  // Calcula o subtotal
  function calculateSummary(items) {
    const total = items.reduce((acc, item) => acc + item.totalPrice, 0);
    subtotalEl.textContent = `R$ ${total.toFixed(2)}`;

    const taxaEntrega = 5.00; 
    totalPriceEl.textContent = `R$ ${(total + taxaEntrega).toFixed(2)}`;
  }


  // Busca os itens do carrinho na API
  async function loadCart() {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const items = await response.json();
        renderCart(items);
        calculateSummary(items);
      } else if (response.status === 401) {
        showMessage('Sessão expirada. Faça login novamente.', 'error');
      } else {
        showMessage('Erro ao buscar o carrinho.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }


  // Atualiza a quantidade de um item no carrinho
  async function updateQuantity(cartItemId, newQuantity) {
    const token = getToken();
    if (!token) return;

    // Se a quantidade for 0 ou menor, o item é removido
    if (newQuantity <= 0) {

      await removeItem(cartItemId);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/item/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        showMessage('Carrinho atualizado!', 'success');
        loadCart(); 
      } else {
        showMessage('Erro ao atualizar a quantidade.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }
  
  
  // Remove um item do carrinho
  async function removeItem(cartItemId) {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/cart/item/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showMessage('Item removido com sucesso.', 'success');
        loadCart(); 
      } else {
        showMessage('Erro ao remover o item.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }


  // Limpa completamente o carrinho
  async function clearCart() {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 204) { 
        showMessage('Carrinho limpo com sucesso.', 'success');
        loadCart(); 
      } else {
        showMessage('Erro ao limpar o carrinho.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }

  // Carrega o carrinho assim que a página for carregada
  loadCart();
  
  // Evento para o botão "Limpar carrinho"
  clearCartBtn.addEventListener('click', clearCart);

  // Evento de clique para remover um item
  cartListDiv.addEventListener('click', (e) => {

    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.dataset.id;
      removeItem(id);
    }
  });

  // Evento para atualizar quantidade de item no carrinho
  cartListDiv.addEventListener('change', (e) => {

    if (e.target.classList.contains('item-quantity')) {
      const id = e.target.dataset.id;
      const newQuantity = parseInt(e.target.value);
      updateQuantity(id, newQuantity);
    }
  });
});