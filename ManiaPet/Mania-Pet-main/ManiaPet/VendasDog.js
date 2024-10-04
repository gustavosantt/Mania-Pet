document.addEventListener('DOMContentLoaded', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoItens = document.getElementById('carrinhoItens');
    const subtotalSpan = document.getElementById('subtotal');
    const cupomInput = document.getElementById('Cupom');
    const descontoSpan = document.getElementById('desconto');
    const totalSpan = document.getElementById('total');
    const loadingBar = document.getElementById('loadingBar');

    atualizarCarrinho(carrinho, carrinhoItens);

    document.querySelectorAll('.adicionar-carrinho').forEach(button => {
        button.addEventListener('click', () => {
            const itemCarrinho = {
                nome: button.getAttribute('data-nome'),
                preco: parseFloat(button.getAttribute('data-preco')),
                imagem: button.getAttribute('data-imagem'),
                quantidade: 1
            };

            const itemExistente = carrinho.find(item => item.nome === itemCarrinho.nome);
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push(itemCarrinho);
            }
            atualizarStorage(carrinho);
            atualizarCarrinho(carrinho, carrinhoItens);
        });
    });

    function atualizarCarrinho(carrinho, carrinhoItens) {
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

    function atualizarSubtotal(carrinho) {
        const subtotal = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        subtotalSpan.innerText = `R$ ${subtotal.toFixed(2)}`;
        calcularDesconto(subtotal); // Atualiza o desconto sempre que o subtotal muda
    }

    function calcularDesconto(subtotal) {
        const cupom = cupomInput.value;
        let desconto = 0;

        if (cupom === 'ganhei35') {
            desconto = subtotal * 0.35;
        }

        descontoSpan.innerText = `R$ ${desconto.toFixed(2)}`;
        const totalComDesconto = subtotal - desconto;
        totalSpan.innerText = `R$ ${totalComDesconto.toFixed(2)}`;
    }

    // Limpa o campo de cupom após clicar em "Adicionar"
    document.getElementById('aplicarCupom').addEventListener('click', () => {
        calcularDesconto(parseFloat(subtotalSpan.innerText.replace('R$ ', '')));
        cupomInput.value = ''; // Limpa o campo
    });

    document.getElementById('finalizarButton').addEventListener('click', () => {
        loadingBar.style.display = 'block'; // Mostra a barra de carregamento
        loadingBar.innerText = 'Processando...';
        
        setTimeout(() => {
            loadingBar.innerText = 'Compra finalizada!'; // Mensagem de sucesso
            setTimeout(() => {
                loadingBar.style.display = 'none'; // Esconde a barra de carregamento após um tempo
            }, 2000);
        }, 2000); // Simula um tempo de processamento
    });

    function removeItem(item) {
        const index = carrinho.indexOf(item);
        if (index > -1) {
            carrinho.splice(index, 1);
        }
        atualizarStorage(carrinho);
        atualizarCarrinho(carrinho, carrinhoItens);
    }

    function alterarQuantidade(item, delta) {
        item.quantidade += delta;
        if (item.quantidade < 1) {
            removeItem(item);
        } else {
            atualizarStorage(carrinho);
            atualizarCarrinho(carrinho, carrinhoItens);
        }
    }

    function atualizarStorage(carrinho) {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }
});
