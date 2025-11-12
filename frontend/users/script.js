const API_BASE_URL = 'https://localhost:7144/api';

let usersSection;
let searchInput;
let addUserBtn;
let usersData = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Acesso negado. Por favor, faça o login.');
        window.location.href = '/frontend/LoginScreen/index.html#'; 
        return; 
    }
    usersSection = document.querySelector('section:last-of-type');
    searchInput = document.getElementById('search-user');
    addUserBtn = document.getElementById('add-user-btn');
    
    usersSection.id = 'users-list';
    usersSection.innerHTML = '<div class="loading">Carregando usuários...</div>';
    
    setupEventListeners();
    
    loadUsers();
}

function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('change', handleSearch);
    }
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', () => handleAddUser());
    }
}

async function fetchUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/User/all_users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}

async function loadUsers() {
    try {
        const users = await fetchUsers();
        usersData = users;
        renderUsers(users);
    } catch (error) {
        showError('Erro ao carregar usuários. Tente novamente mais tarde.');
    }
}

function renderUsers(users) {
    if (!usersSection) return;
    
    if (!users || users.length === 0) {
        usersSection.innerHTML = `
            <div class="no-users">
                <p>Nenhum usuário encontrado.</p>
            </div>
        `;
        return;
    }
    
    const usersList = users.map((user, index) => createUserCard(user, index)).join('');
    
    usersSection.innerHTML = `
        <div class="users-list">
            ${usersList}
        </div>
    `;
}

function createUserCard(user, index) {
    return `
        <div class="user-row" data-user-id="${user.id}">
            <div class="user-number">${index + 1}</div>
            <div class="user-name">${escapeHtml(user.name || 'Nome não informado')}</div>
            <div class="user-email">${escapeHtml(user.email || 'Email não informado')}</div>
            <div class="user-phone">${escapeHtml(user.phone || 'Telefone não informado')}</div>
            <div class="user-address">${escapeHtml(user.address || 'Endereço não informado')}</div>
            <div class="user-role">
                <span class="role-badge role-${(user.role || 'user').toLowerCase()}">
                    ${getRoleLabel(user.role).toUpperCase()}
                </span>
            </div>
            <div class="user-actions">
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">
                    Apagar
                </button>
                <button class="btn btn-edit" onclick="editUser(${user.id})">
                    Editar
                </button>
            </div>
        </div>
    `;
}

function handleSearch(event) {
    const selectedRole = event.target.value.trim();
    
    if (!selectedRole) {
        renderUsers(usersData);
        return;
    }
    
    const filteredUsers = usersData.filter(user => {
        return user.role && user.role.toUpperCase() === selectedRole.toUpperCase();
    });
    
    renderUsers(filteredUsers);
    
    if (filteredUsers.length === 0) {
        showMessage(`Nenhum usuário encontrado com o role "${selectedRole}".`, 'info');
    } else {
        showMessage(`${filteredUsers.length} usuário(s) encontrado(s) com role "${selectedRole}".`, 'success');
    }
}

function handleAddUser() {

    
        window.location.href = '/frontend/cadastro_usuario/usuarios.html#';
   

}

function editUser(userId) {
   
    const editPagePath = '/frontend/edit_user/index.html'; 
    

    window.location.href = `${editPagePath}?id=${userId}`;
}

function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (user && confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
        showMessage(`Funcionalidade de excluir usuário "${user.name}" será implementada em breve.`, 'info');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getRoleLabel(role) {
    const roles = {
        'admin': 'Admin',
        'manager': 'Manager',
        'user': 'User',
        'employee': 'Employee',
        'employer': 'Employer'
    };
    return roles[role?.toLowerCase()] || 'User';
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
        return dateString;
    }
}

function showMessage(message, type = 'info') {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div')

    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    if (usersSection) {
        usersSection.insertBefore(messageDiv, usersSection.firstChild);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }
}

function showError(message) {
    if (usersSection) {
        usersSection.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h3>Ops! Algo deu errado</h3>
                <p>${message}</p>
                <button class="btn btn-retry" onclick="loadUsers()">Tentar Novamente</button>
            </div>
        `;
    }
}

function refreshUsers() {
    if (usersSection) {
        usersSection.innerHTML = '<div class="loading">Carregando usuários...</div>';
    }
    loadUsers();
}

window.userManager = {
    refreshUsers,
    loadUsers,
    usersData: () => usersData
};

console.log('Sistema de Usuários carregado!');
console.log('Funções disponíveis: userManager.refreshUsers(), userManager.loadUsers()');