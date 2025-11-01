/*
================================================================
ATENÇÃO: CONFIGURAÇÃO DE AUTENTICAÇÃO E API
================================================================
*/

// !!!!!!!!!!!! COLOQUE SEU TOKEN DE TESTE AQUI !!!!!!!!!!!!
const FAKE_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJqb2huQGVtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTc2MjAxNjIzNSwiZXhwIjoxNzYyMDIzNDM1LCJpYXQiOjE3NjIwMTYyMzUsImlzcyI6IldlYkFwaVBpenphcmlhIiwiYXVkIjoiV2ViQXBpUGl6emFyaWEifQ.0p4C6CqvWwousAWUZPKrQ4YJ6fKTvsARN9tdckGy0BA";
// !!!!!!!!!!!! VERIFIQUE A URL DA SUA API !!!!!!!!!!!!
const API_BASE_URL = "https://localhost:7144/api/User";


// Espera o HTML carregar completamente para começar a rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS DO FORMULÁRIO ---
    const form = document.getElementById('edit-user-form');
    const messageContainer = document.getElementById('message-container');

    // Campos do Usuário
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const telefoneInput = document.getElementById('telefone');
    const funcaoInput = document.getElementById('funcao');

    // /* //   CAMPOS DE ENDEREÇO REMOVIDOS DAQUI
    // */
    
    // Pega o ID do usuário da URL (ex: ...?id=123)
    const userId = getUserIdFromUrl();

    if (userId) {
        // Se achou um ID, carrega os dados do usuário
        loadUserData(userId);
    } else {
        // Se não, mostra um erro
        showMessage('ERRO: ID do usuário não encontrado na URL.', true);
    }

    // --- 2. FUNÇÃO PARA CARREGAR DADOS DO USUÁRIO ---
    async function loadUserData(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'GET',
                headers: {
                    // Envia o token de autenticação
                    'Authorization': `Bearer ${FAKE_AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Preenche o formulário com os dados da API
            nomeInput.value = data.name;
            emailInput.value = data.email;
            telefoneInput.value = data.phone;
            funcaoInput.value = data.role;
            // Não preenchemos a senha por segurança

            /* BLOCO 'if (data.addresses...)' REMOVIDO DAQUI
            */

        } catch (error) {
            showMessage(`Falha ao carregar dados: ${error.message}`, true);
        }
    }

    // --- 3. FUNÇÃO PARA SALVAR (ENVIAR) O FORMULÁRIO ---
    form.addEventListener('submit', async (event) => {
        // Impede o recarregamento padrão da página
        event.preventDefault(); 

        // Pega o ID da URL novamente para saber qual usuário atualizar
        const currentUserId = getUserIdFromUrl();
        if (!currentUserId) {
            showMessage('Erro fatal: ID do usuário perdido.', true);
            return;
        }

        // Monta o objeto de dados que será enviado como JSON
        // A estrutura deste objeto deve ser a que sua API espera
        const dataToSend = {
            name: nomeInput.value,
            password: senhaInput.value, // Envia em branco ou preenchido
            phone: telefoneInput.value,
            role: funcaoInput.value
            
            /* PROPRIEDADE 'address: { ... }' REMOVIDA DAQUI
            */
        };

        // Lógica da Senha: Se o campo estiver vazio, envie 'null'
        if (!dataToSend.password || dataToSend.password.trim() === "") {
            dataToSend.password = null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${currentUserId}`, {
                method: 'PUT', // PUT é usado para "substituir" (atualizar) um recurso
                headers: {
                    'Authorization': `Bearer ${FAKE_AUTH_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend) // Converte o objeto JS em texto JSON
            });

            if (!response.ok) {
                // Se a API retornar um erro (ex: 400, 404, 500)
                const errorData = await response.json(); // Tenta ler a mensagem de erro da API
                throw new Error(errorData.message || response.statusText);
            }

            // Se tudo deu certo
            showMessage('Usuário atualizado com sucesso!', false);

        } catch (error) {
            showMessage(`Falha ao salvar: ${error.message}`, true);
        }
    });

    // --- 4. FUNÇÕES UTILITÁRIAS ---

    // Pega o parâmetro 'id' da URL
    function getUserIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function showMessage(message, isError = false) {
        messageContainer.textContent = message;
        
        // Remove as classes da vez anterior
        messageContainer.classList.remove('success', 'error');

        // Adiciona a classe correta (do novo CSS)
        if (isError) {
            messageContainer.classList.add('error');
        } else {
            messageContainer.classList.add('success');
        }
    }

});