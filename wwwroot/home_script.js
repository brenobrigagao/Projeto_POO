
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
 