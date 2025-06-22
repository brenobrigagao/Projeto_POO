
    document.addEventListener("DOMContentLoaded", function () {
      const tipoSelect = document.getElementById("signup-user-type");
      const camposProdutor = document.getElementById("campos-produtor");
      const camposCliente = document.getElementById("campos-cliente");

      tipoSelect.addEventListener("change", function () {
        if (this.value === "produtor") {
          camposProdutor.style.display = "block";
          camposCliente.style.display = "none";
        } else if (this.value === "cliente") {
          camposProdutor.style.display = "none";
          camposCliente.style.display = "block";
        } else {
          camposProdutor.style.display = "none";
          camposCliente.style.display = "none";
        }
      });
    });
  


document.querySelector('.sign-in-htm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-username').value;
  const senha = document.getElementById('login-password').value;

  const response = await fetch('/api/Auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, senha: senha })
  });

  if (response.ok) {
    const data = await response.json();
    alert('Login realizado com sucesso!');
    localStorage.setItem('token', data.token);
    window.location.href = 'home.html';
  } else {
    alert('Erro ao fazer login');
  }
});

document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tipo = document.getElementById('signup-user-type').value;

  if (tipo === 'cliente') {
    const cliente = {
      email: document.getElementById('signup-email-cliente').value,
      telefone: document.getElementById('signup-telefone-cliente').value,
      endereco: document.getElementById('signup-endereco-cliente').value,
      senha: document.getElementById('signup-password-cliente').value,
      gostos: document.getElementById('signup-gostos').value
    };

    const response = await fetch('/api/Auth/register-cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });

    if (response.ok) alert('Cadastro realizado!');
    else alert('Erro ao cadastrar cliente');

  } else if (tipo === 'produtor') {
    const produtor = {
      nomeLoja: document.getElementById('signup-nome-loja').value,
      nome: document.getElementById('signup-nome-produtor').value,
      enderecoLoja: document.getElementById('signup-endereco-loja').value,
      telefone: document.getElementById('signup-telefone-produtor').value,
      senha: document.getElementById('signup-password-produtor').value,
      email: document.getElementById('signup-email-produtor').value,
      descricao: document.getElementById('signup-descricao').value
    };

    const response = await fetch('/api/Auth/register-produtor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtor)
    });

    if (response.ok) alert('Cadastro realizado!');
    else alert('Erro ao cadastrar produtor');
  }
});