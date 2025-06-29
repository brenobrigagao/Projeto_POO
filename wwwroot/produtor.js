document.addEventListener("DOMContentLoaded", function() {
    // Verifica se é um produtor logado
    if (!usuarioEstaLogado() || !usuarioEhProdutor()) {
       window.location.href = 'home.html';
        return;
   }

    // Elementos do DOM
    const productsListBody = document.getElementById('products-list-body');
    const addProductBtn = document.getElementById('add-product-btn');
    const productModal = document.getElementById('product-modal');
    const closeModal = document.querySelector('.close-modal');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const productForm = document.getElementById('product-form');
    const modalTitle = document.getElementById('modal-title');
    const totalProductsSpan = document.getElementById('total-products');
    const activeProductsSpan = document.getElementById('active-products');
    const logoutBtn = document.getElementById('btn-logout');

    
    // Variáveis de estado
    let currentProducts = [];
    let editingProductId = null;
    
    // Event Listeners
    addProductBtn.addEventListener('click', openAddProductModal);
    closeModal.addEventListener('click', closeProductModal);
    cancelEditBtn.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', handleProductSubmit);

    // Carregar produtos do produtor
    loadProducerProducts();
    
    // Função para verificar se o usuário está logado
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
    
    // Função para verificar se o usuário é um produtor
    function usuarioEhProdutor() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
            const role = payload[roleKey] || '';
            return role.toLowerCase() === 'produtor';
        } catch (e) {
            console.error("Erro ao verificar perfil:", e);
            return false;
        }
    }
    
    // Função para fazer logout
    function logout() {
        localStorage.removeItem('token');
        window.location.href = 'home.html';
    }
    
    // Função para carregar produtos do produtor
    async function loadProducerProducts() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/Produtor/meus-produtos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
            currentProducts = await response.json();
            // Adaptar os dados recebidos para o formato esperado
            currentProducts = currentProducts.map(p => ({
                id: p.id,
                name: p.flor, 
                category: 'outros', // Categoria pode ser ajustada conforme necessidade
                price: p.preco,
                description: '', 
                imageUrl: p.imageUrl,
                active: true 
            }));
            renderProductsList();
            updateStats();
        } else {
            throw new Error('Erro ao carregar produtos');
        }
        } catch (error) {
            console.error("Erro:", error);
            // Usar dados de exemplo em desenvolvimento
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                currentProducts = getSampleProducts();
                renderProductsList();
                updateStats();
                alert("Modo de demonstração: usando dados locais");
            } else {
                alert("Erro ao carregar produtos. Tente novamente mais tarde.");
            }
        }
    }
    
    // Função para obter produtos de exemplo (apenas para desenvolvimento)
    function getSampleProducts() {
        return [
            {
                id: 1,
                name: "Buquê de Rosas Vermelhas",
                category: "rosas",
                price: 120.00,
                description: "12 rosas vermelhas frescas com folhagem complementar.",
                imageUrl: "https://images.unsplash.com/photo-1559563362-c667ba5f5480?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                active: true
            },
            {
                id: 2,
                name: "Arranjo de Girassóis",
                category: "girassois",
                price: 150.00,
                description: "5 girassóis vibrantes com folhagem tropical.",
                imageUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
                active: false
            }
        ];
    }
    
    // Função para renderizar a lista de produtos
    function renderProductsList() {
        productsListBody.innerHTML = '';
        
        if (currentProducts.length === 0) {
            productsListBody.innerHTML = `
                <div class="list-item empty-list">
                    <div class="item-col">Nenhum produto cadastrado ainda</div>
                </div>
            `;
            return;
        }
        
        currentProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'list-item';
            productItem.innerHTML = `
                <div class="item-col product-info">
                    <img src="${product.imageUrl || 'img/default-product.jpg'}" alt="${product.name}">
                    <span>${product.name}</span>
                </div>
                <div class="item-col">${formatCategory(product.category)}</div>
                <div class="item-col">R$ ${product.price.toFixed(2)}</div>
                <div class="item-col">
                    <span class="status-badge ${product.active ? 'active' : 'inactive'}">
                        ${product.active ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <div class="item-col actions">
                    <button class="action-btn edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                    <button class="action-btn status-btn ${product.active ? 'deactivate' : 'activate'}" data-id="${product.id}">
                        <i class="fas ${product.active ? 'fa-eye-slash' : 'fa-eye'}"></i>
                    </button>
                </div>
            `;
            productsListBody.appendChild(productItem);
        });
        
        // Adicionar event listeners aos botões
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                deleteProduct(productId);
            });
        });
        
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                toggleProductStatus(productId);
            });
        });
    }
    
    // Função para formatar categoria
    function formatCategory(category) {
        const categories = {
            'rosas': 'Rosas',
            'girassois': 'Girassóis',
            'orquideas': 'Orquídeas',
            'cactos': 'Cactos',
            'outros': 'Outros'
        };
        return categories[category] || category;
    }
    
    // Função para atualizar estatísticas
    function updateStats() {
        totalProductsSpan.textContent = currentProducts.length;
        const activeCount = currentProducts.filter(p => p.active).length;
        activeProductsSpan.textContent = activeCount;
    }
    
    // Função para abrir modal de adição de produto
    function openAddProductModal() {
        editingProductId = null;
        modalTitle.textContent = 'Adicionar Novo Produto';
        productForm.reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('product-id').value = '';
        productModal.style.display = 'block';
    }
    
    // Função para fechar modal
    function closeProductModal() {
        productModal.style.display = 'none';
    }
    
    // Função para editar produto
    function editProduct(productId) {
        const product = currentProducts.find(p => p.id === productId);
        if (!product) return;
        
        editingProductId = productId;
        modalTitle.textContent = 'Editar Produto';
        
        // Preencher formulário
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        
        // Mostrar prévia da imagem
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = '';
        if (product.imageUrl) {
            const img = document.createElement('img');
            img.src = product.imageUrl;
            img.alt = product.name;
            imagePreview.appendChild(img);
        }
        
        productModal.style.display = 'block';
    }
    
    // Função para lidar com envio do formulário
    async function handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = {
        id: document.getElementById('product-id').value,
        florId: document.getElementById('product-category').value === 'rosas' ? 1 : 
               document.getElementById('product-category').value === 'girassois' ? 2 : 3, // IDs fictícios
        preco: parseFloat(document.getElementById('product-price').value),
        estoque: 10 // Valor padrão ou adicionar campo no formulário
    };
        
        try {
            const token = localStorage.getItem('token');
            
            // Criar FormData para enviar arquivos
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('category', formData.category);
            fd.append('price', formData.price);
            fd.append('description', formData.description);
            if (formData.imageFile) {
                fd.append('image', formData.imageFile);
            }
            
            let response;
            if (editingProductId) {
                // Edição de produto existente
                response = await fetch(`/api/Produtor/editar-produto/${editingProductId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    florId: formData.florId,
                    preco: formData.preco,
                    estoque: formData.estoque
                    })
                });
            } else {
                // Novo produto
                response = await fetch('/api/Produtor/cadastrar-produto', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    florId: formData.florId,
                    preco: formData.preco,
                    estoque: formData.estoque
                    })
                });
            }
            
            if (response.ok) {
                alert(editingProductId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
                closeProductModal();
                loadProducerProducts();
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao salvar produto');
            }
        } catch (error) {
            console.error("Erro:", error);
            alert(error.message || 'Erro ao processar a requisição');
        }
    }
    
    // Função para alternar status do produto
    async function toggleProductStatus(productId) {
        if (!confirm('Deseja alterar o status deste produto?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const product = currentProducts.find(p => p.id === productId);
            const newStatus = !product.active;
            
        // Endpoint não existe no controller - podemos remover ou implementar no backend
        alert('Funcionalidade de alterar status não implementada no backend');
        return;
        
        // Código original comentado:
        /*
        const response = await fetch(`/api/Produtor/produtos/${productId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ active: newStatus })
        });
        
        if (response.ok) {
            product.active = newStatus;
            renderProductsList();
            updateStats();
            alert(`Produto ${newStatus ? 'ativado' : 'desativado'} com sucesso!`);
        } else {
            throw new Error('Erro ao alterar status');
        }
        */

    } catch (error) {
        console.error("Erro:", error);
        alert('Erro ao alterar status do produto');
    }
}

// Na função deleteProduct():
async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) return;
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/Produtor/excluir-produto/${productId}`, {  // Ajustado para o endpoint correto
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentProducts = currentProducts.filter(p => p.id !== productId);
            renderProductsList();
            updateStats();
            alert('Produto excluído com sucesso!');
        } else {
            throw new Error('Erro ao excluir produto');
        }
    } catch (error) {
        console.error("Erro:", error);
        alert('Erro ao excluir produto');
        }
    }

    // Verificar a cada minuto se o usuário ainda está logado
setInterval(() => {
    if (!usuarioEstaLogado() || !usuarioEhProdutor()) {
        window.location.href = 'home.html';
    }
}, 60000);

});