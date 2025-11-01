const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  if (type === "password") {
    togglePassword.classList.remove("fa-eye-slash");
    togglePassword.classList.add("fa-eye");
  } else {
    togglePassword.classList.remove("fa-eye");
    togglePassword.classList.add("fa-eye-slash");
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = passwordInput.value;
  const message = document.getElementById("message");

  try {
    const response = await fetch("http://localhost:5123/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);

      message.style.color = "green";
      message.textContent = "Login realizado com sucesso!";

      window.location.href = '/frontend/users/index.html#';

    } else {
      const err = await response.json();
      message.style.color = "red";
      message.textContent = err.message || "Credenciais inválidas";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "red";
    message.textContent = "Erro de conexão com o servidor.";
  }
});