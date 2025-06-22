// Função de verificação de login
function usuarioEstaLogado() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (e) {
    console.error("Token inválido:", e);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
   // Redireciona se já estiver logado
  if (usuarioEstaLogado()) {
    window.location.href = 'home.html';
    return;
  }
  // Configura alternância de formulários
  const tipoSelect = document.getElementById("signup-user-type");
  const camposProdutor = document.getElementById("campos-produtor");
  const camposCliente = document.getElementById("campos-cliente");
  
  const toggleCampos = () => {
    camposProdutor.style.display = tipoSelect.value === "produtor" ? "block" : "none";
    camposCliente.style.display = tipoSelect.value === "cliente" ? "block" : "none";
  };
  
  tipoSelect.addEventListener("change", toggleCampos);
  toggleCampos(); // Inicializa estado
});

// Login
document.querySelector('.sign-in-htm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-username').value;
  const senha = document.getElementById('login-password').value;
  
  if (!email || !senha) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const response = await fetch('/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      window.location.href = 'home.html';
    } else {
      const error = await response.json();
      alert(`Erro: ${error.message || 'Falha no login'}`);
    }
  } catch (erro) {
    alert('Erro de conexão');
  }
});


// Cadastro
document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const tipo = document.getElementById('signup-user-type').value;
  let dados, url;

  if (tipo === 'cliente' && !validarEmail(dados.email)) {
    alert('Email inválido');
      return;
}

  if (tipo === 'produtor' && !validarEmail(dados.email)) {
    alert('Email inválido');
      return;
}

  if (tipo === 'cliente') {
    dados = {
      email: document.getElementById('signup-email-cliente').value,
      telefone: document.getElementById('signup-telefone-cliente').value,
      endereco: document.getElementById('signup-endereco-cliente').value,
      senha: document.getElementById('signup-password-cliente').value,
      gostos: document.getElementById('signup-gostos').value
    };
    url = '/api/Auth/registro-cliente';
  
  } else if (tipo === 'produtor') {
    dados = {
      nomeLoja: document.getElementById('signup-nome-loja').value,
      nome: document.getElementById('signup-nome-produtor').value,
      enderecoLoja: document.getElementById('signup-endereco-loja').value,
      telefone: document.getElementById('signup-telefone-produtor').value,
      senha: document.getElementById('signup-password-produtor').value,
      email: document.getElementById('signup-email-produtor').value,
      descricao: document.getElementById('signup-descricao').value
    };
    url = '/api/Auth/registro-produtor';
  
  } else {
    alert('Selecione um tipo de usuário');
    return;
  }

  // Validação básica
  if (!dados.email || !dados.senha) {
    alert('Email e senha são obrigatórios');
    return;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (response.ok) {
      alert('Cadastro realizado com sucesso!');
      e.target.reset(); // Limpa o formulário
    } else {
      const error = await response.json();
      alert(`Erro: ${error.message || 'Falha no cadastro'}`);
    }
  } catch (erro) {
    alert('Erro de conexão com o servidor');
  }

    // Validar formato de email
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

if (!validarEmail(cliente.email)) {
  alert('Email inválido');
  return;
}

});