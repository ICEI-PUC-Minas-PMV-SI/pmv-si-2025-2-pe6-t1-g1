document.addEventListener('DOMContentLoaded', () => {
  // --- CONFIGURAÇÃO ---
  const API_URL = 'http://localhost:5123/api';
  const messageDiv = document.getElementById('message');
  const orderListDiv = document.getElementById('order-list');
  const statusFilter = document.getElementById('statusFilter');

  let allOrders = []; // Armazena todos os pedidos para filtrar

  // --- AUTENTICAÇÃO ---
  function getToken() {
    // Busca o token do funcionário/admin do localStorage
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1IiwiZW1haWwiOiJtYW51YWxAZW1haWwuY29tIiwicm9sZSI6IlVTRVIiLCJuYmYiOjE3NjI5ODYxMTcsImV4cCI6MTc2Mjk5MzMxNywiaWF0IjoxNzYyOTg2MTE3LCJpc3MiOiJXZWJBcGlQaXp6YXJpYSIsImF1ZCI6IldlYkFwaVBpenphcmlhIn0.BmQYv1hb-8mUCiuzspwvdpJ6G-PFOGAJn2McIdhtjRs'; 
    
    
    if (!token) {
      showMessage('Acesso negado. Você precisa estar autenticado como funcionário.', 'error');
      return null;
    }
    return token;
  }

  // --- FUNÇÕES DE EXIBIÇÃO ---
  function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
  }

  function renderOrders(ordersToRender) {
    orderListDiv.innerHTML = ''; // Limpa a lista

    if (ordersToRender.length === 0) {
      orderListDiv.innerHTML = '<p style="text-align: center;">Nenhum pedido encontrado.</p>';
      return;
    }

    ordersToRender.forEach(order => {
      const orderCard = document.createElement('div');
      // Adiciona classes de status para o CSS
      const statusClass = `status-${order.status.toLowerCase()}`;
      orderCard.className = `order-card ${statusClass}`;

      // Formata a data (do C#) para ser mais legível
      const orderTime = new Date(order.orderDate).toLocaleString('pt-BR');

      orderCard.innerHTML = `
        <div class="order-info">
          <h3>Pedido #${order.id}</h3>
          <span>Cliente ID: ${order.userId}</span>
          <span>Horário: ${orderTime}</span>
          <span class="order-total">Total: R$ ${order.totalAmount.toFixed(2)}</span>
        </div>
        <div class="order-status">
          <label for="status-${order.id}">Alterar Status:</label>
          <select id="status-${order.id}" class="status-select" data-id="${order.id}">
            <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>Pendente</option>
            <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>Confirmado</option>
            <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>Preparando</option>
            <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>Pronto p/ Entrega</option>
            <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>Entregue</option>
            <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>Cancelado</option>
          </select>
        </div>
      `;
      orderListDiv.appendChild(orderCard);
    });
  }

  // --- FUNÇÕES DE API ---

  /**
   * Carrega TODOS os pedidos
   * CORRESPONDE A: GET /api/orders
   */
  async function loadOrders() {
    const token = getToken();
    if (!token) return;

    try {
      // Esta é a rota correta do seu controller
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        allOrders = await response.json();

        allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        filterAndRenderOrders();
      } else if (response.status === 401) {
        showMessage('Sessão expirada. Faça login novamente.', 'error');
      } else if (response.status === 403) {
        // 403 é 'Forbidden' (Proibido) - acontece se um 'USER' tentar acessar
        showMessage('Acesso negado. Esta página é apenas para funcionários.', 'error');
      } else {
        showMessage('Erro ao buscar pedidos.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }

  /**
   * Atualiza o status de um pedido
   * CORRESPONDE A: PUT /api/orders/{id}/status
   */
  async function updateStatus(orderId, newStatus) {
    const token = getToken();
    if (!token) return;

    try {

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },


        body: JSON.stringify(newStatus) 
      });

      if (response.ok) {
        showMessage(`Pedido #${orderId} atualizado para "${newStatus}".`, 'success');
        // Atualiza o status no objeto local para não precisar recarregar tudo
        const orderToUpdate = allOrders.find(o => o.id == orderId);
        if (orderToUpdate) orderToUpdate.status = newStatus;
        filterAndRenderOrders();
      } else {
        showMessage('Erro ao atualizar status.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }

  // --- FILTRAGEM E EVENTOS ---

  function filterAndRenderOrders() {
    const filterValue = statusFilter.value;
    if (filterValue === 'todos') {
      renderOrders(allOrders);
    } else {
      const filtered = allOrders.filter(order => order.status === filterValue);
      renderOrders(filtered);
    }
  }

  // Carrega os pedidos quando a página abre
  loadOrders();

  // Adiciona o listener para o filtro
  statusFilter.addEventListener('change', filterAndRenderOrders);

  // Adiciona listener na lista (event delegation) para os dropdowns de status
  orderListDiv.addEventListener('change', (e) => {
    if (e.target.classList.contains('status-select')) {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      updateStatus(orderId, newStatus);
    }
  });
});