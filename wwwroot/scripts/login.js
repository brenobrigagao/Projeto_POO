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

    mensagemEl.innerText = "Login efetuado com sucesso!";
    if (data.role === "Produtor") {
        window.location.href = "/cadastro-produtor.html";
    } else if (data.role === "Cliente") {
        window.location.href = "/cadastro-cliente.html";
    } else {
         document.getElementById("mensagem").innerText = "Role inválida.";
    }
  } catch (error) {
    mensagemEl.innerText = "Erro na comunicação com o servidor.";
    console.error(error);
  }
}
