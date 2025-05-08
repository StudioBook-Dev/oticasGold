

function htmlCarrinho() {
    // Calcular o subtotal (soma dos produtos)
    const subtotal = parseFloat(calcularTotalCarrinho().replace(',', '.'));
    
    // Obter o valor do frete (se existir)
    const valorFrete = window.valorFrete || 0;
    
    // Obter o valor do desconto manual (se existir)
    const valorDesconto = window.valorDesconto || 0;
    
    // Calcular o total (subtotal + frete - desconto)
    const total = Math.max(0, subtotal + valorFrete - valorDesconto);
    
    // Formatar os valores para exibição
    const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
    const freteFormatado = valorFrete.toFixed(2).replace('.', ',');
    const descontoFormatado = valorDesconto.toFixed(2).replace('.', ',');
    const totalFormatado = total.toFixed(2).replace('.', ',');
    
    // Informação do frete
    const freteInfo = valorFrete > 0 ? `
        <div class="frete-valor">
            <span>Frete:</span>
            <span>+ R$ ${freteFormatado}</span>
        </div>
    ` : '';
    
    // Informação do desconto
    const descontoInfo = valorDesconto > 0 ? `
        <div class="desconto-manual">
            <span>Desconto:</span>
            <span>- R$ ${descontoFormatado}</span>
        </div>
    ` : '';
    
    return `
        <h3>Carrinho de Compras</h3>
        <div id="itens-carrinho">
            ${produtosCarrinho.length === 0 ? '<p>Nenhum item no carrinho</p>' : ''}
            ${produtosCarrinho.map(item => `
                <div class="item-carrinho">
                    <span>${item.nome}</span>
                    <span>${item.quantidade}x</span>
                    <span>${item.preco}</span>
                </div>
            `).join('')}
        </div>
        <div class="resumo-carrinho">
            <div class="subtotal-carrinho">
                <span>Subtotal:</span>
                <span>R$ ${subtotalFormatado}</span>
            </div>
            ${freteInfo}
            ${descontoInfo}
            <div class="total-carrinho">
                <p>Total: R$ ${totalFormatado}</p>
            </div>
        </div>
        <button class="btn-primario" onclick="finalizarPedido('carrinho')" ${produtosCarrinho.length === 0 ? 'disabled' : ''}>
            Finalizar Venda
        </button>
    `;
}


function adicionarAoCarrinho() {
    // Encontrar o produto selecionado
    const produtoSelecionado = document.querySelector('input[name="produto"]:checked');
    if (!produtoSelecionado) {
        alert('Por favor, selecione um produto primeiro.');
        return;
    }
    
    // Obter o ID do produto e a quantidade
    const produtoId = produtoSelecionado.id.replace('input-produto-', '');
    const contador = document.querySelector(`#produto-${produtoId} .contador-valor`);
    const quantidade = parseInt(contador.textContent);
    if (quantidade === 0) {
        alert('Por favor, selecione uma quantidade maior que zero.');
        return;
    }

    // Obter informações do produto
    const nome = document.querySelector(`#produto-${produtoId} .coluna-nome`).textContent;
    const preco = document.querySelector(`#produto-${produtoId} .coluna-preco`).textContent;
    // Criar objeto do item
    const item = {
        id: produtoId,
        nome: nome,
        quantidade: quantidade,
        preco: preco
    };
    // Adicionar ao carrinho
    produtosCarrinho.push(item);
    
    // Atualizar a exibição do carrinho
    // Se houver um cupom aplicado, exibir com o cupom
    if (window.cupomAplicado) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
    } else {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
    }
    
    // Limpar a seleção e o contador
    produtoSelecionado.checked = false;
    contador.textContent = '1';
    // Exibir no console
    // console.log('Produtos no carrinho:', produtosCarrinho);
}



function calcularTotalCarrinho() {
    return produtosCarrinho.reduce((total, item) => {
        const preco = parseFloat(item.preco.replace('R$ ', '').replace(',', '.'));
        return total + (preco * item.quantidade);
    }, 0).toFixed(2).replace('.', ',');
}








