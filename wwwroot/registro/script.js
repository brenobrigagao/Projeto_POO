document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    try {
        const response = await fetch('http://localhost:5211/api/Auth/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: password,
                role: role
            })
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');
        
        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = 'Cadastro realizado com sucesso!';
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = result.message || 'Erro no cadastro';
        }
    } catch (error) {
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'error';
        messageDiv.textContent = 'Erro de conexão: ' + error.message;
    }
});