function menuShow(){
  let menuMobile = document.querySelector('.mobile-menu');
  if(menuMobile.classList.contains('open')){
    menuMobile.classList.remove('open');
    document.querySelector('.icon').src = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg";
  } else {
    menuMobile.classList.add('open');
    document.querySelector('.icon').src = "https://img.icons8.com/?size=100&id=83149&format=png&color=000000";
    const icon = document.querySelector('.icon');
icon.src = 'https://img.icons8.com/?size=100&id=83149&format=png&color=000000';
icon.style.width = '24px';
icon.style.height = '24px';
  }
}



document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.product-grid');
  const response = await fetch('/api/Cliente/produtos');

  if (response.ok) {
    const produtos = await response.json();
    grid.innerHTML = '';
    produtos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image"><img src="${p.imagemUrl || 'images/default.jpg'}" alt="${p.nome}"></div>
        <div class="product-info">
          <h3>${p.nome}</h3>
          <p class="price">R$ ${p.preco.toFixed(2)}</p>
          <button class="btn" onclick="adicionarAoCarrinho(${p.id})">Adicionar ao Carrinho</button>
        </div>
      `;
      grid.appendChild(card);
    });
  }
});

function adicionarAoCarrinho(idProduto) {
  fetch('/api/Cliente/carrinho', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idProduto: idProduto, quantidade: 1 })
  }).then(res => {
    if (res.ok) alert('Produto adicionado ao carrinho');
    else alert('Erro ao adicionar produto');
  });
}


document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.product-grid');
  const token = localStorage.getItem('token');

  const response = await fetch('/api/Cliente/produtos-disponiveis', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const produtos = await response.json();
    grid.innerHTML = '';
    produtos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-image"><img src="images/${p.Flor.toLowerCase()}.jpg" alt="${p.Flor}"></div>
        <div class="product-info">
          <h3>${p.Flor}</h3>
          <p class="price">R$ ${p.Preco.toFixed(2)}</p>
          <button class="btn" onclick="adicionarAoCarrinho(${p.ProdutoId})">Adicionar ao Carrinho</button>
        </div>
      `;
      grid.appendChild(card);
    });
  } else {
    alert('Erro ao carregar produtos');
  }
});

function adicionarAoCarrinho(produtoId) {
  const token = localStorage.getItem('token');

  fetch('/api/Cliente/adicionar-carrinho', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      produtoId: produtoId,
      quantidade: 1
    })
  }).then(res => {
    if (res.ok) {
      alert('Produto adicionado ao carrinho');
    } else {
      alert('Erro ao adicionar produto');
    }
  });
}
