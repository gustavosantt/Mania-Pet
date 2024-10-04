document.addEventListener('DOMContentLoaded', () => {
    const botoesAdicionarCarrinho = document.querySelectorAll('.adicionar-carrinho');

    botoesAdicionarCarrinho.forEach(botao => {
        botao.addEventListener('click', () => {
            const nomeProduto = botao.getAttribute('data-nome');
            const precoProduto = parseFloat(botao.getAttribute('data-preco'));
            const imgProduto = botao.getAttribute('data-imagem');

            let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

            const produtoExistente = carrinho.find(item => item.nome === nomeProduto);

            if (produtoExistente) {
                produtoExistente.quantidade += 1;
            } else {
                carrinho.push({ nome: nomeProduto, preco: precoProduto, quantidade: 1, imagem: imgProduto });
            }

            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            alert(`${nomeProduto} foi adicionado ao carrinho!`);
        });
    });
    
    // Atualiza o carrinho ao carregar a página
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoItens = document.getElementById('carrinhoItens'); // Certifique-se de que o ID está correto

    function atualizarCarrinho(carrinho) {
        carrinhoItens.innerHTML = ''; // Limpa os itens existentes
        carrinho.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="Produtos">
                        <img src="${item.imagem}" alt="${item.nome}" style="width: 100px; height: auto;">
                    </div>
                    <span>${item.nome}</span>
                </td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td>
                    <div class="qnt">
                        <button class="remover">-</button>
                        <span>${item.quantidade}</span>
                        <button class="adicionar">+</button>
                    </div>
                </td>
                <td>R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
                <td><button class="remover-item"><img src="imagens/lixeira.png" alt="Remover" style="width: 20px; height: auto;"></button></td>
            `;
            // Adiciona eventos para remover ou alterar a quantidade
            tr.querySelector('.remover-item').addEventListener('click', () => {
                removeItem(item);
            });
            tr.querySelector('.remover').addEventListener('click', () => {
                alterarQuantidade(item, -1);
            });
            tr.querySelector('.adicionar').addEventListener('click', () => {
                alterarQuantidade(item, 1);
            });

            carrinhoItens.appendChild(tr);
        });
        atualizarSubtotal(carrinho);
    }

    atualizarCarrinho(carrinho);
});
