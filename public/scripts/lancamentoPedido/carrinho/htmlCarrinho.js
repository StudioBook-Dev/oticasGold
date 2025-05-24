

function constructHtmlCarrinho() {
    const html = document.querySelector('.coluna.carrinho')
    const { itensPedido, frete, desconto, cupom } = getItensPedidoInLocalStorage()

    // Calcular o valor do desconto do cupom
    let descontoCupom = 0;
    if (cupom) {
        if (cupom.tipo === 'percentual') {
            descontoCupom = itensPedido.valor * (parseFloat(cupom.valor) / 100);
        } else {
            descontoCupom = parseFloat(cupom.valor);
        }
    }
    // Calcular o desconto total (manual + cupom)
    const descontoTotal = desconto.valor + descontoCupom;
    // Calcular o total final (subtotal + frete - desconto total)
    const totalFinal = Math.max(0, itensPedido.valor + frete.valor - descontoTotal);
    // Formatar os valores para exibição
    const subtotalFormatado = itensPedido.valor.toFixed(2).replace('.', ',');
    const descontoManualFormatado = desconto.valor.toFixed(2).replace('.', ',');
    const descontoCupomFormatado = descontoCupom.toFixed(2).replace('.', ',');
    const freteFormatado = frete.valor.toFixed(2).replace('.', ',');
    const totalFinalFormatado = totalFinal.toFixed(2).replace('.', ',');
    
    // Formatar a apresentação do cupom
    let conteudoCupom = '';
    if (cupom.valor > 0) {
        let valorFormatado;
        if (cupom.tipo === 'percentual') {
            valorFormatado = `${cupom.valor}%`;
        } else {
            valorFormatado = `R$ ${parseFloat(cupom.valor).toFixed(2).replace('.', ',')}`;
        }
        conteudoCupom = `
            <div class="cupom-aplicado">
                <div class="info-cupom">
                    <span class="label-cupom">Cupom: </span>
                    <span class="nome-cupom">${cupom.data.nome}</span>
                    <span class="valor-cupom">${valorFormatado}</span>
                    <button type="button" class="btn-remover-cupom" onclick="cancelarCupomSelecionado()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="desconto-aplicado">
                <span>Desconto do cupom:</span>
                <span>- R$ ${descontoCupomFormatado}</span>
            </div>
        `;
    }
    // Informação do desconto manual
    const conteudoDesconto = desconto.valor > 0 ? `
        <div class="desconto-manual">
            <span>Desconto manual:</span>
            <span>- R$ ${descontoManualFormatado}</span>
        </div>
    ` : '';
    // Informação do frete
    const conteudoFrete = frete.valor > 0 ? `
        <div class="frete-valor">
            <span>Frete:</span>
            <span>+ R$ ${freteFormatado}</span>
        </div>
    ` : '';

    // Conteudo do carrinho
    const conteudoCarrinho = `
        <h3>Carrinho de Compras</h3>
        <div id="itens-carrinho">
            ${itensPedido.data.length === 0 ? '<p>Nenhum item no carrinho</p>' : ''}
            ${itensPedido.data.map(item => `
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
            ${conteudoFrete}
            ${conteudoDesconto}
            ${conteudoCupom}
            <div class="total-carrinho">
                <p>Total: R$ ${totalFinalFormatado}</p>
            </div>
        </div>
        <button class="btn-primario" onclick="finalizarPedido()" 
        ${itensPedido.data.length === 0 ? 'disabled' : ''}>
            Finalizar Venda
        </button>
    `;

    html.innerHTML = conteudoCarrinho
}


// function adicionarAoCarrinho() {
//     // Encontrar o produto selecionado
//     const produtoSelecionado = document.querySelector('input[name="produto"]:checked');
//     if (!produtoSelecionado) {
//         alert('Por favor, selecione um produto primeiro.');
//         return;
//     }
    
//     // Obter o ID do produto e a quantidade
//     const produtoId = produtoSelecionado.id.replace('input-produto-', '');
//     const contador = document.querySelector(`#produto-${produtoId} .contador-valor`);
//     const quantidade = parseInt(contador.textContent);
//     if (quantidade === 0) {
//         alert('Por favor, selecione uma quantidade maior que zero.');
//         return;
//     }

//     // Obter informações do produto
//     const nome = document.querySelector(`#produto-${produtoId} .coluna-nome`).textContent;
//     const preco = document.querySelector(`#produto-${produtoId} .coluna-preco`).textContent;
//     // Criar objeto do item
//     const item = {
//         id: produtoId,
//         nome: nome,
//         quantidade: quantidade,
//         preco: preco
//     };
//     // Adicionar ao carrinho
//     itensPedido.push(item);
    
//     // Atualizar a exibição do carrinho
//     // Se houver um cupom aplicado, exibir com o cupom
//     if (window.cupomAplicado) {
//         document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
//     } else {
//         document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
//     }
    
//     // Limpar a seleção e o contador
//     produtoSelecionado.checked = false;
//     contador.textContent = '1';
//     // Exibir no console
//     // console.log('Produtos no carrinho:', itensPedido);
// }











