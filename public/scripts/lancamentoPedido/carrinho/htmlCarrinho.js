

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
    const descontoTotal = desconto + descontoCupom;
    // Calcular o total final (subtotal + frete - desconto total)
    const totalFinal = Math.max(0, itensPedido.valor + frete.valor - descontoTotal);
    // Formatar os valores para exibição
    const subtotalFormatado = itensPedido.valor.toFixed(2).replace('.', ',');
    const descontoManualFormatado = desconto.toFixed(2).replace('.', ',');
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
    const conteudoDesconto = desconto > 0 ? `
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














