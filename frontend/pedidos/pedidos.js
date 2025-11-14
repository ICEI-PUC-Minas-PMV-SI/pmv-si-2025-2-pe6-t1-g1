document.addEventListener('DOMContentLoaded', () => {

  const API_URL = 'https://localhost:7144/api';

  const messageContainer = document.getElementById('message-container');
  const orderListDiv = document.getElementById('items-container'); 
  const statusFilter = document.getElementById('status-filter');

  let allOrders = []; 

function getToken() {
    
    const token = localStorage.getItem('token'); 
    
    if (!token) {
        showMessage('Acesso negado. Faça o login primeiro.', 'error');
        
      
        window.location.href = '/frontend/LoginScreen/index.html#'; 
        return null;
    }
    
   
    return token;
}

function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  function renderOrders(ordersToRender) {
    orderListDiv.innerHTML = ''; 

    if (ordersToRender.length === 0) {
      orderListDiv.innerHTML = '<p style="text-align: center;">Nenhum pedido encontrado.</p>';
      return;
    }

    ordersToRender.forEach(order => {
      const orderCard = document.createElement('div');
      const statusClass = `status-${order.status.toLowerCase()}`;
      orderCard.className = `order-card ${statusClass}`;

      const orderTime = new Date(order.orderDate).toLocaleString('pt-BR');

      orderCard.innerHTML = `
        <div class="order-header">
            <div class="order-info">
              <h3>Pedido #${order.id}</h3>
              <span>Cliente ID: ${order.userId}</span>
              <span>Horário: ${orderTime}</span>
              <span class="order-total">Total: R$ ${order.totalAmount.toFixed(2)}</span>
            </div>
            <div class="order-status">
              <label for="status-${order.id}">Alterar Status:</label>
              <select id="status-${order.id}" class="styled-select status-select-dynamic" data-id="${order.id}">
                <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>Pendente</option>
                <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>Confirmado</option>
                <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>Preparando</option>
                <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>Pronto p/ Entrega</option>
                <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>Entregue</option>
                <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>Cancelado</option>
              </select>
            </div>
        </div>

        <button class="btn-details" data-id="${order.id}">Ver Detalhes</button>

        <div class="order-items-container" id="items-for-order-${order.id}">
        </div>
      `;
      orderListDiv.appendChild(orderCard);
    });
  }

  async function loadOrders() {
    const token = getToken();
    if (!token) return;

    try {
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
        showMessage('Acesso negado. Esta página é apenas para funcionários.', 'error');
      } else {
        showMessage('Erro ao buscar pedidos.', 'error');
      }
    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }

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

  async function loadOrderDetails(orderId, buttonEl) {
    const itemsContainer = document.getElementById(`items-for-order-${orderId}`);

    if (itemsContainer.innerHTML !== '') {
      itemsContainer.innerHTML = '';

      buttonEl.textContent = 'Ver Detalhes'; 
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        showMessage('Erro ao buscar detalhes do pedido.', 'error');
        return;
      }

      const orderDetails = await response.json();

      let itemsHtml = '<ul class="order-item-list">';
      orderDetails.items.forEach(item => {
        itemsHtml += `
          <li class="order-item">
            <span class="item-qty">${item.quantity}x</span>
            <span class="item-name">${item.itemName}</span>
            <span class="item-price">R$ ${item.itemValue.toFixed(2)}</span>
          </li>`;
      });
      itemsHtml += '</ul>';

      itemsContainer.innerHTML = itemsHtml;

      buttonEl.textContent = 'Esconder Detalhes'; 

    } catch (error) {
      showMessage('Falha na conexão com o servidor.', 'error');
    }
  }

  function filterAndRenderOrders() {
    const filterValue = statusFilter.value;
    if (filterValue === 'todos') {
      renderOrders(allOrders);
    } else {
      const filtered = allOrders.filter(order => order.status === filterValue);
      renderOrders(filtered);
    }
  }

  loadOrders();

  statusFilter.addEventListener('change', filterAndRenderOrders);

  orderListDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-details')) {
      const orderId = e.target.dataset.id;
      loadOrderDetails(orderId, e.target); 
    }
  });

  orderListDiv.addEventListener('change', (e) => {
    if (e.target.classList.contains('status-select-dynamic')) { 
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      updateStatus(orderId, newStatus);
    }
  });

});
