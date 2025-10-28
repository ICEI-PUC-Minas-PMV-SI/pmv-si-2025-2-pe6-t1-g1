document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const message = document.getElementById('message');

  message.textContent = '';
  message.className = 'message';

  if (password !== confirmPassword) {
    message.textContent = 'As senhas não coincidem!';
    message.classList.add('error');
    return;
  }

  const data = { name, email, phone, password };

  try {
    const response = await fetch('https://localhost:7144/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      message.textContent = 'Usuário cadastrado com sucesso!';
      message.classList.add('success');
      document.getElementById('registerForm').reset();
    } else {
      const err = await response.json();
      message.textContent = err.message || 'Erro ao cadastrar.';
      message.classList.add('error');
    }
  } catch (error) {
    message.textContent = 'Falha na conexão com o servidor.';
    message.classList.add('error');
  }
});
