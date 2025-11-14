const API_BASE_URL = "https://localhost:7144/api";

document.addEventListener('DOMContentLoaded', () => {
    
    
    const userToken = localStorage.getItem('token');
    
        if (!userToken) { 
       alert('Acesso negado. Por favor, faça o login.');
       window.location.href = '/frontend/LoginScreen/index.html#'; 
       return;
    }

    const form = document.getElementById('edit-user-form');
    const messageContainer = document.getElementById('message-container');

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const telefoneInput = document.getElementById('telefone');
    const funcaoInput = document.getElementById('funcao');

    const userId = getUserIdFromUrl();

    if (userId) {
        loadUserData(userId);
    } else {
        showMessage('ERRO: ID do usuário não encontrado na URL.', true);
    }

    
    async function loadUserData(id) {
        try {
           const response = await fetch(`${API_BASE_URL}/User/${id}`, {
               method: 'GET',
               headers: {
                   
                   'Authorization': `Bearer ${userToken}`,
                   'Content-Type': 'application/json'
                }
           });

           if (!response.ok) {
               throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
           }

           const data = await response.json();
           
           nomeInput.value = data.name;
           
           
           emailInput.value = data.email; 
           
           telefoneInput.value = data.phone;
           funcaoInput.value = data.role;

        } catch (error) {
           showMessage(`Falha ao carregar dados: ${error.message}`, true);
        }
    }

    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        const currentUserId = getUserIdFromUrl();
        if (!currentUserId) {
           showMessage('Erro fatal: ID do usuário perdido.', true);
           return;
        }

        const dataToSend = {
            name: nomeInput.value,
            password: senhaInput.value, 
            phone: telefoneInput.value,
            role: funcaoInput.value
        };

        if (!dataToSend.password || dataToSend.password.trim() === "") {
           dataToSend.password = null;
        }

        try {
           const response = await fetch(`${API_BASE_URL}/User/${currentUserId}`, {
               method: 'PUT', 
               headers: {
                   
                   'Authorization': `Bearer ${userToken}`,
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(dataToSend)
           });

           if (!response.ok) {
               const errorData = await response.json(); 
               throw new Error(errorData.message || response.statusText);
           }
           
           showMessage('Usuário atualizado com sucesso!', false);

        } catch (error) {
           showMessage(`Falha ao salvar: ${error.message}`, true);
        }
    });

    
    function getUserIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        messageContainer.classList.remove('success', 'error');

        if (isError) {
            messageContainer.classList.add('error');
        } else {
            messageContainer.classList.add('success');
        }
    }
});