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
