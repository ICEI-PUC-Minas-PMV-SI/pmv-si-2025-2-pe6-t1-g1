/*
================================================================
ATENÇÃO: CONFIGURAÇÃO DE AUTENTICAÇÃO E API
================================================================

Este script precisa se autenticar para falar com sua API,
pois seus endpoints são protegidos com [Authorize].

Para fins de TESTE, estamos usando um "token falso" (hardcoded).
Em um aplicativo real, você NUNCA faria isso. O usuário faria
login em outra página, e você salvaria o token real que a API
enviou, para então usá-lo aqui.

*/

// !!!!!!!!!!!! COLOQUE SEU TOKEN DE TESTE AQUI !!!!!!!!!!!!
// (Você pode obter um fazendo login pela sua API e copiando o string do token)
const FAKE_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJqb2huQGVtYWlsLmNvbSIsInJvbGUiOiJBRE1JTiIsIm5iZiI6MTc2MTU5OTA0NiwiZXhwIjoxNzYxNjA2MjQ2LCJpYXQiOjE3NjE1OTkwNDYsImlzcyI6IldlYkFwaVBpenphcmlhIiwiYXVkIjoiV2ViQXBpUGl6emFyaWEifQ.t4rwWKRGXZHjVefb0nVpzNiDnnXFUVt36cyTWMXj3Z8";
// !!!!!!!!!!!! VERIFIQUE A URL DA SUA API !!!!!!!!!!!!
// (Confira a porta em que seu Visual Studio está rodando a API)
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

    // Campos do Endereço
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const complementoInput = document.getElementById('complemento');
    const cidadeInput = document.getElementById('cidade');
    
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

            // NOTA: Assumindo que sua API retorna o endereço junto com o usuário.
            // O ideal é que `GET /api/User/{id}` retorne o usuário E seus endereços.
            // Vamos assumir que ele retorna o primeiro endereço.
            
            // Verifique como sua API retorna o endereço.
            // Estou assumindo que ela retorna um array `addresses` (como no seu Model)
            // e que vamos editar o primeiro endereço (`addresses[0]`)
            if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0];
                
                // Mapeia os campos do Model `UserAddress` para o HTML
                cepInput.value = address.zipCode;
                ruaInput.value = address.street;
                numeroInput.value = address.number;
                complementoInput.value = address.complement;
                cidadeInput.value = address.city;
                
                // Você pode querer guardar o ID do endereço para a atualização
                // Ex: form.dataset.addressId = address.id;
            }

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
            email: emailInput.value,
            password: senhaInput.value, // Envia em branco ou preenchido
            phone: telefoneInput.value,
            role: funcaoInput.value,
            
            // Enviar os dados de endereço de forma aninhada é uma boa prática
            address: {
                street: ruaInput.value,
                number: numeroInput.value,
                zipCode: cepInput.value,
                complement: complementoInput.value,
                city: cidadeInput.value
                // OBS: O Bairro (Neighborhood) e Estado (State) do seu Model
                // não estão no HTML, então não serão enviados.
            }
        };

        // Lógica da Senha: Se o campo estiver vazio, envie 'null'
        // Sua API deve ser programada para ignorar a atualização da senha se ela for nula.
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

    // Mostra uma mensagem de feedback para o usuário
   // ...
function showMessage(message, isError = false) {
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? 'red' : 'green';
    messageContainer.style.padding = '10px';
    // A LINHA CORRIGIDA
    messageContainer.style.border = isError ? '1px solid red' : '1px solid green'; 
    messageContainer.style.borderRadius = '4px';
    messageContainer.style.marginBottom = '15px';
}

});