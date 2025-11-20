document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://localhost:7144/api'; 

  const messageContainer = document.getElementById('message-container');
  const orderListDiv = document.getElementById('items-container'); 
  const statusFilter = document.getElementById('status-filter');

  let allOrders = []; 

  function getToken() {

    const token = localStorage.getItem('token'); 

    if (!token) {
        showMessage('Access denied. Please log in as an employee.', 'error');
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
      orderListDiv.innerHTML = '<p style="text-align: center;">No orders found.</p>';
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
              <h3>Order #${order.id}</h3>
              <span>Client ID: ${order.userId}</span>
              <span>Date: ${orderTime}</span>
              <span class="order-total">Total: R$ ${order.totalAmount.toFixed(2)}</span>
            </div>
            <div class="order-status">
              <label for="status-${order.id}">Change Status:</label>
              <select id="status-${order.id}" class="styled-select status-select-dynamic" data-id="${order.id}">
                <option value="PENDING" ${order.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                <option value="CONFIRMED" ${order.status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
                <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>Preparing</option>
                <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>Ready</option>
                <option value="DELIVERED" ${order.status === 'DELIVERED' ? 'selected' : ''}>Delivered</option>
                <option value="CANCELLED" ${order.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
              </select>
            </div>
        </div>

        <button class="btn-details" data-id="${order.id}">
            View Items (${order.itemCount})
        </button>

        <div class="order-items-container" id="items-for-order-${order.id}"></div>
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
        showMessage('Session expired. Please log in again.', 'error');
      } else if (response.status === 403) {
        showMessage('Access denied. Employee role required.', 'error');
      } else {
        showMessage('Error fetching orders.', 'error');
      }
    } catch (error) {
      showMessage('Connection failed.', 'error');
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

        body: JSON.stringify({ status: newStatus }) 
      });

      if (response.ok) {
        showMessage(`Order #${orderId} updated to "${newStatus}".`, 'success');
        const orderToUpdate = allOrders.find(o => o.id == orderId);
        if (orderToUpdate) orderToUpdate.status = newStatus;
        filterAndRenderOrders(); 
      } else {
        showMessage('Error updating status.', 'error');
      }
    } catch (error) {
      showMessage('Connection failed.', 'error');
    }
  }

  async function loadOrderDetails(orderId, buttonEl) {
    const itemsContainer = document.getElementById(`items-for-order-${orderId}`);

    if (itemsContainer.innerHTML !== '') {
      itemsContainer.innerHTML = '';
      buttonEl.textContent = `View Items (${buttonEl.textContent.split('(')[1]}`; 
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
        showMessage('Error fetching order details.', 'error');
        return;
      }

      const orderData = await response.json();

      let itemsHtml = '<ul class="order-item-list">';

      if(orderData.items && orderData.items.length > 0) {
          orderData.items.forEach(item => {
            itemsHtml += `
              <li class="order-item">
                <span class="item-qty">${item.quantity}x</span>
                <span class="item-name">${item.itemName}</span>
                <span class="item-price">R$ ${item.itemValue.toFixed(2)}</span>
              </li>`;
          });
      } else {
          itemsHtml += '<li>No items found.</li>';
      }

      itemsHtml += '</ul>';

      itemsContainer.innerHTML = itemsHtml;
      buttonEl.textContent = 'Hide Items';

    } catch (error) {
      console.error(error);
      showMessage('Connection failed.', 'error');
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