const API_URL = "https://localhost:7144/api"; // Verifique a porta!
let allMenuItems = [];

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    fetchMenu();
    setupEventListeners();
});

function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        // Se não tiver token, manda pro login
        window.location.href = "../users/index.html"; 
    }
}

async function fetchMenu() {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = '<p style="text-align:center; width:100%; color:#666; padding:20px;">Carregando menu...</p>';

    try {
        const response = await fetch(`${API_URL}/Items`);
        
        if (!response.ok) throw new Error("Falha ao buscar itens");

        allMenuItems = await response.json();
        renderMenu(allMenuItems);
        
    } catch (error) {
        console.error(error);
        grid.innerHTML = '<p style="text-align:center; width:100%; color:red;">Erro ao carregar o menu. Verifique a API.</p>';
    }
}

function renderMenu(items) {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    if (!items || items.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%">Nenhum item disponível.</p>';
        return;
    }

    items.forEach(item => {
        // Formata moeda
        const price = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value);
        
        // Define ícone simples por categoria
        let iconClass = "fa-pizza-slice";
        if (item.category && item.category.toLowerCase().includes("bebida")) iconClass = "fa-glass-water";
        if (item.category && item.category.toLowerCase().includes("sobremesa")) iconClass = "fa-ice-cream";

        const card = document.createElement("div");
        card.className = "menu-item-card";
        card.innerHTML = `
            <div class="card-img-placeholder">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.nameItem}</h3>
                <p class="card-desc">${item.description || "Sem descrição."}</p>
                
                <div class="card-footer">
                    <span class="card-price">${price}</span>
                    <div class="add-controls">
                        <input type="number" min="1" value="1" id="qty-${item.id}" class="qty-input">
                        <button onclick="addToCart(${item.id})" class="btn-add">
                            <i class="fa-solid fa-plus"></i> Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

async function addToCart(itemId) {
    const token = localStorage.getItem("token");
    const qtyInput = document.getElementById(`qty-${itemId}`);
    const quantity = parseInt(qtyInput.value);

    if (quantity < 1) {
        showMessage("Quantidade deve ser maior que 0", "error");
        return;
    }

    const payload = { itemId, quantity };

    try {
        const response = await fetch(`${API_URL}/Cart/item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showMessage("Item adicionado ao carrinho!", "success");
        } else {
            const err = await response.json();
            showMessage(err.message || "Erro ao adicionar", "error");
        }
    } catch (error) {
        console.error(error);
        showMessage("Erro de conexão", "error");
    }
}

function setupEventListeners() {
    // Filtro de Categorias
    const filterSelect = document.getElementById("category-filter");
    filterSelect.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "todos") {
            renderMenu(allMenuItems);
        } else {
            const filtered = allMenuItems.filter(item => 
                item.category && item.category.toLowerCase().includes(category.toLowerCase())
            );
            renderMenu(filtered);
        }
    });

    // Botão Ver Carrinho
    document.getElementById("btn-view-cart").addEventListener("click", () => {
        alert("Navegar para tela de carrinho...");
        // window.location.href = "../carrinho/carrinho.html";
    });
}

// Função utilitária para exibir mensagens (Toast)
function showMessage(msg, type) {
    const container = document.getElementById("message-container");
    const colorClass = type === "success" ? "message-success" : "message-error";
    
    // HTML da mensagem baseado no CSS do pedidos.css (.message, .message-success, etc)
    container.innerHTML = `<div class="message ${colorClass}" style="display:block">${msg}</div>`;
    
    setTimeout(() => {
        container.innerHTML = "";
    }, 3000);
}