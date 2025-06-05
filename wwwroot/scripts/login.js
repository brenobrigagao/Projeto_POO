async function login() {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const mensagemEl = document.getElementById("mensagem");

  if (!email || !senha) {
    mensagemEl.innerText = "Por favor, preencha email e senha.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) {
      const erro = await res.text();
      mensagemEl.innerText = erro || "Erro ao fazer login.";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("userId", data.id);

    verificarCadastro();
  } catch (error) {
    mensagemEl.innerText = "Erro na comunicação com o servidor.";
    console.error(error);
  }
}
