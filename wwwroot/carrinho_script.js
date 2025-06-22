const produtos = [
  { nome: "Buquê de Rosas Vermelhas", preco: 120.00, quantidade: 0 },
  { nome: "Arranjo de Girassóis", preco: 150.00, quantidade: 0 }
];

function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function changeQuantity(id, delta) {
  const produto = produtos[id];
  produto.quantidade += delta;
  if (produto.quantidade < 0) produto.quantidade = 0;

  // Atualiza a quantidade na interface
  document.getElementById(`quantity-${id}`).textContent = produto.quantidade;

  // Atualiza total do produto
  const totalProduto = produto.quantidade * produto.preco;
  document.getElementById(`total-${id}`).textContent = formatarPreco(totalProduto);

  atualizarTotalGeral();
}

function atualizarTotalGeral() {
  const total = produtos.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
  document.getElementById('totalfinal').textContent = formatarPreco(total);
}


document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.querySelector('tbody');
  const totalFinal = document.getElementById('totalfinal');
  const response = await fetch('/api/Cliente/carrinho');

  if (response.ok) {
    const itens = await response.json();
    tbody.innerHTML = '';
    let total = 0;

    itens.forEach((item, index) => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="product"><img src="${item.imagemUrl}"/>
            <div class="info"><div class="name">${item.nome}</div></div>
          </div>
        </td>
        <td>R$ ${item.preco.toFixed(2)}</td>
        <td>
          <div class="qty" data-id="${item.id}">
            <button onclick="alterarQtd(${item.id}, -1)">-</button>
            <span class="quantity">${item.quantidade}</span>
            <button onclick="alterarQtd(${item.id}, 1)">+</button>
          </div>
        </td>
        <td>R$ ${(subtotal).toFixed(2)}</td>
        <td><button class="remove" onclick="removerItem(${item.id})"><i class="bx bx-x"></i></button></td>
      `;
      tbody.appendChild(tr);
    });

    totalFinal.textContent = `R$ ${total.toFixed(2)}`;
  }
});

function alterarQtd(idProduto, delta) {
  fetch('/api/Cliente/carrinho/alterar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idProduto: idProduto, delta: delta })
  }).then(() => location.reload());
}

function removerItem(idProduto) {
  fetch(`/api/Cliente/carrinho/${idProduto}`, {
    method: 'DELETE'
  }).then(() => location.reload());
}


document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.querySelector('tbody');
  const totalFinal = document.getElementById('totalfinal');
  const token = localStorage.getItem('token');

  const response = await fetch('/api/Cliente/ver-carrinho', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    tbody.innerHTML = '';
    data.Itens.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="product"><img src="${item.ImageUrl}"/>
            <div class="info"><div class="name">${item.Flor}</div></div>
          </div>
        </td>
        <td>R$ ${item.PrecoUnitario.toFixed(2)}</td>
        <td>
          <div class="qty">
            <span>${item.Quantidade}</span>
          </div>
        </td>
        <td>R$ ${item.Subtotal.toFixed(2)}</td>
        <td></td>
      `;
      tbody.appendChild(tr);
    });

    totalFinal.textContent = `R$ ${data.Total.toFixed(2)}`;
  } else {
    alert('Erro ao carregar carrinho');
  }
});
