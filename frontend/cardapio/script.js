// URL da API
const API_URL = 'https://localhost:7144/api';
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJ2aWN0b3JAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJuYmYiOjE3NjE5NTM1OTMsImV4cCI6MTc2MTk2MDc5MywiaWF0IjoxNzYxOTUzNTkzLCJpc3MiOiJXZWJBcGlQaXp6YXJpYSIsImF1ZCI6IldlYkFwaVBpenphcmlhIn0.S-d1dI9FD0QM16Ps3Kacs_fBhJYq0joWBDOT6b7dCIE'

let itemsSection;
let itemsData = [];

// Função para buscar itens do cardápio
// Quando o DOM estiver completamente carregado, inicializa a aplicação
document.addEventListener("DOMContentLoaded", function() {
    // Configuração do modal
    const modal = document.getElementById('add-item-modal');
    const addButton = document.getElementById('add-btn');
    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.btn-cancel');
    const form = document.getElementById('add-item-form');
    const categoriesDatalist = document.getElementById('categories');

    /**
     * Atualiza a lista de categorias em um datalist específico
     * @param {HTMLElement} datalistElement - Elemento datalist para atualizar (opcional)
     */
    function updateCategoriesList(datalistElement = null) {
        // Usa o datalist fornecido ou o padrão
        const datalist = datalistElement || categoriesDatalist;
        
        // Pega todas as categorias únicas dos itens existentes
        const categorias = [...new Set(itemsData.map(item => item.category || item.Category).filter(Boolean))];
        
        // Limpa o datalist
        datalist.innerHTML = '';
        
        // Adiciona cada categoria como uma opção
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            datalist.appendChild(option);
        });
    }

    // Abre o modal
    addButton.addEventListener('click', () => {
        modal.style.display = 'block';
        // Atualiza a lista de categorias quando o modal é aberto
        updateCategoriesList();
    });

    // Fecha o modal
    function closeModal() {
        modal.style.display = 'none';
        form.reset();
    }

    closeButton.addEventListener('click', closeModal);
    cancelButton.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Manipula o envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nameItem: form.nameItem.value,
            description: form.description.value,
            value: parseFloat(form.value.value),
            category: form.category.value
        };

        try {
            await createItem(formData);
            showMessage('Item adicionado com sucesso!', 'success');
            closeModal();
            // Atualiza a lista de itens
            const items = await fetchItems();
            itemsData = items;
            renderCategoryOptions(items);
            renderItems(items);
        } catch (error) {
            showMessage('Erro ao adicionar item. ' + error.message, 'error');
        }
    });

    // Busca os itens da API e inicializa a interface
    fetchItems().then(items => {
        // Armazena os itens em uma variável global para uso posterior no filtro
        itemsData = items;
        // Preenche o select com as categorias disponíveis
        renderCategoryOptions(items);
        // Renderiza todos os itens inicialmente
        renderItems(items);
    }).catch(error => {
        // Em caso de erro, exibe uma mensagem amigável para o usuário
        showMessage('Erro ao carregar os itens do cardápio.', 'error');
    });

    // Configura o evento de filtro no select de categorias
    const select = document.getElementById('search');
    select.addEventListener('change', function() {
        const categoria = select.value;
        if (!categoria) {
            // Se nenhuma categoria estiver selecionada, mostra todos os itens
            renderItems(itemsData);
        } else {
            // Filtra os itens pela categoria selecionada
            // Usa || para lidar com diferentes formatos de dados (camelCase ou PascalCase)
            const filtrados = itemsData.filter(item => (item.category || item.Category) === categoria);
            renderItems(filtrados);
        }
    });
});

/**
 * Busca os itens do cardápio na API
 * @returns {Promise<Array>} Promise que resolve com o array de itens
 */
async function fetchItems() {
    try {
        // Faz a requisição GET para a API
        const response = await fetch(`${API_URL}/Items`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MOCK_TOKEN}`
            },
            cache: 'no-cache',
            credentials: 'same-origin'
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Converte a resposta para JSON
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar items:', error);
        throw error;
    }
}

/**
 * Cria um novo item através da API
 * @param {Object} item - Dados do item a ser criado
 * @returns {Promise<Object>} Promise que resolve com o item criado
 */
async function createItem(item) {
    try {
        const response = await fetch(`${API_URL}/Items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MOCK_TOKEN}`
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao criar item');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao criar item:', error);
        throw error;
    }
}

/**
 * Atualiza um item existente através da API
 * @param {Object} item - Dados do item a ser atualizado
 * @returns {Promise<Object>} Promise que resolve com o item atualizado
 */
async function updateItem(item) {
    try {
        const response = await fetch(`${API_URL}/Items/${item.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MOCK_TOKEN}`
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erro ao atualizar item');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao atualizar item:', error);
        throw error;
    }
}

/**
 * Abre o modal de edição com os dados do item selecionado
 * @param {number} itemId - ID do item a ser editado
 */
function editItem(itemId) {
    const item = itemsData.find(i => i.id === itemId);
    if (!item) {
        showMessage('Item não encontrado.', 'error');
        return;
    }

    const editModal = document.getElementById('edit-item-modal');
    const form = document.getElementById('edit-item-form');
    const closeButton = editModal.querySelector('.close-button');
    const cancelButton = editModal.querySelector('.btn-cancel');

    // Preenche o formulário com os dados do item
    form.querySelector('#edit-item-id').value = item.id;
    form.querySelector('#edit-nameItem').value = item.nameItem || item.NameItem;
    form.querySelector('#edit-description').value = item.description || item.Description;
    form.querySelector('#edit-value').value = item.value || item.Value;
    const categoryInput = form.querySelector('#edit-category');
    categoryInput.value = item.category || item.Category;

    // Atualiza a lista de categorias no datalist de edição
    setTimeout(() => {
        const editCategoriesDatalist = document.getElementById('edit-categories');
        if (editCategoriesDatalist) {
            updateCategoriesList(editCategoriesDatalist);
        }
    }, 0);

    // Exibe o modal
    editModal.style.display = 'block';

    // Funções para fechar o modal
    function closeEditModal() {
        editModal.style.display = 'none';
        form.reset();
    }

    closeButton.onclick = closeEditModal;
    cancelButton.onclick = closeEditModal;
    window.onclick = function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    };

    // Manipula o envio do formulário de edição
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const formData = {
            id: parseInt(form.querySelector('#edit-item-id').value),
            nameItem: form.querySelector('#edit-nameItem').value,
            description: form.querySelector('#edit-description').value,
            value: parseFloat(form.querySelector('#edit-value').value),
            category: form.querySelector('#edit-category').value
        };

        try {
            await updateItem(formData);
            showMessage('Item atualizado com sucesso!', 'success');
            closeEditModal();
            
            // Atualiza a lista de itens
            const items = await fetchItems();
            itemsData = items;
            renderCategoryOptions(items);
            renderItems(items);
        } catch (error) {
            showMessage('Erro ao atualizar item. ' + error.message, 'error');
        }
    };
}

/**
 * Deleta um item do cardápio através da API
 * @param {number} itemId - ID do item a ser deletado
 */
async function deleteItem(itemId) {
    const item = itemsData.find(i => i.id === itemId);
    if (!item) {
        showMessage('Item não encontrado.', 'error');
        return;
    }

    // Confirmação do usuário
    const isConfirmed = confirm(`Tem certeza que deseja excluir o item "${item.nameItem || item.NameItem}"?\nEsta ação não pode ser desfeita.`);
    
    if (isConfirmed) {
        try {
            const response = await fetch(`${API_URL}/Items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MOCK_TOKEN}`
                }
            });

            if (!response.ok) {
                throw new Error(response.status === 404 
                    ? 'Item não encontrado no servidor.' 
                    : 'Erro ao excluir o item.');
            }

            // Remove o item da lista local
            itemsData = itemsData.filter(i => i.id !== itemId);
            
            // Atualiza a interface
            renderItems(itemsData);
            
            // Atualiza as categorias no filtro
            renderCategoryOptions(itemsData);
            
            showMessage(`Item "${item.nameItem || item.NameItem}" excluído com sucesso!`, 'success');
        } catch (error) {
            console.error('Erro ao deletar item:', error);
            showMessage(`Erro ao excluir o item: ${error.message}`, 'error');
        }
    }
}


/*-----------------------------------------------Funções Complementares-----------------------------------------------/*


/**
 * Preenche o select com as categorias únicas dos itens
 * @param {Array} items - Array de itens do cardápio
 */
function renderCategoryOptions(items) {
    const select = document.getElementById('search');
    // Adiciona a opção padrão para mostrar todas as categorias
    select.innerHTML = '<option value="">Todas as categorias</option>';
    
    // Cria um Set de categorias únicas usando spread operator
    // O filter(Boolean) remove valores vazios ou undefined
    const categorias = [...new Set(items.map(item => item.category || item.Category).filter(Boolean))];
    
    // Cria e adiciona uma option para cada categoria
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });
}

/**
 * Renderiza os itens do cardápio na interface
 * @param {Array} items - Array de itens a serem exibidos
 */
function renderItems(items) {
    const container = document.getElementById('items-container');
    
    // Se não houver itens, exibe uma mensagem apropriada
    if (!items || items.length === 0) {
        container.innerHTML = '<p>Nenhum item encontrado.</p>';
        return;
    }
    
    // Limpa o container antes de adicionar os novos itens
    container.innerHTML = '';
    
    // Cria um card para cada item
    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item-card';
        // Template do card com fallbacks para diferentes formatos de dados
        itemDiv.innerHTML = `
            <h3>${item.nameItem || item.NameItem || 'Sem nome'}</h3>
            <hr>
            <p>${item.description || item.Description || ''}</p>
            <b><p class="price">R$: ${(item.value || item.Value || 0).toFixed(2)}</p></b>
            <p class="category">Categoria: ${item.category || item.Category || ''}</p>
            <div class="item-actions">
                <button type="button" class="btn btn-edit" onclick="editItem(${item.id || item.Id})">
                    Editar
                </button>
                <button type="button" class="btn btn-delete" onclick="deleteItem(${item.id || item.Id})">
                    Apagar
                </button>
            </div>
        `;
        container.appendChild(itemDiv);
    });
}

/**
 * Exibe uma mensagem temporária na interface
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem ('success', 'error', 'info', 'warning')
 */
function showMessage(message, type = 'info') {
    // Remove mensagens existentes
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Cria um novo elemento de mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Adiciona a mensagem no topo da seção de itens
    const container = document.getElementById('items-container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
        
        // Remove a mensagem após 4 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }
}

/**
 * Atualiza a lista de categorias em um datalist específico
 * @param {HTMLElement} datalistElement - Elemento datalist para atualizar (opcional)
 */
function updateCategoriesList(datalistElement = null) {
    // Se não foi fornecido um elemento específico, usa o datalist padrão
    const datalist = datalistElement || document.getElementById('categories');
    if (!datalist) return;

    // Pega todas as categorias únicas dos itens existentes
    const categorias = [...new Set(itemsData.map(item => item.category || item.Category).filter(Boolean))];
    
    // Limpa o datalist
    datalist.innerHTML = '';
    
    // Adiciona cada categoria como uma opção
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        datalist.appendChild(option);
    });
}