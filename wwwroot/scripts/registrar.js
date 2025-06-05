async function registrar() {
  const email = document.getElementById("emailRegistro").value.trim();
  const senha = document.getElementById("senhaRegistro").value.trim();
  const role = document.getElementById("role").value;
  const mensagemEl = document.getElementById("mensagem");

  if (!email || !senha || !role) {
    mensagemEl.innerText = "Preencha todos os campos!";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/Auth/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha, role })
    });

    const respostaTexto = await res.text();
    mensagemEl.innerText = res.ok ? "Registro realizado com sucesso!" : respostaTexto;
  } catch (err) {
    mensagemEl.innerText = "Erro na comunicação com o servidor.";
    console.error(err);
  }
}
