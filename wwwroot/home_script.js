
    // Mostrar botão de logout se usuário estiver logado
    document.addEventListener('DOMContentLoaded', function() {
      const token = localStorage.getItem('token');
      const logoutBtn = document.getElementById('logout-btn');
      
      if (token) {
        logoutBtn.style.display = 'block';
        logoutBtn.addEventListener('click', function() {
          localStorage.removeItem('token');
          alert('Você foi desconectado!');
          window.location.href = 'login_usuario.html';
        });
      } else {
        logoutBtn.style.display = 'none';
      }
    });
 
    // auth-check.js
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  let isProdutor = false;
  
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isProdutor = payload.role === 'produtor' && payload.exp * 1000 > Date.now();
    } catch (e) {
      console.error("Erro ao verificar token:", e);
    }
  }

  document.body.classList.toggle('user-is-produtor', isProdutor);
});