// Função para abrir o modal de desconto
function abrirDesconto() {
    // Obter o valor do desconto atual (se existir)
    const descontoAtual = window.valorDesconto || 0;
    const descontoFormatado = descontoAtual.toFixed(2).replace('.', ',');
    
    const conteudoHTML = `
        <form id="form-desconto" class="form-modal-secundario">
            <div class="campo-formulario">
                <label for="valor-desconto">Valor do Desconto (R$):</label>
                <input type="text" id="valor-desconto" name="valor-desconto" value="${descontoFormatado}" 
                       placeholder="0,00" autocomplete="off">
            </div>
            <div class="acoes-modal acoes-modal-rodape">
                <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="fecharModalSecundario()">Cancelar</button>
                <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarDesconto()">Aplicar</button>
            </div>
        </form>
    `;
    
    abrirModalSecundario({
        titulo: 'Adicionar Desconto',
        conteudo: conteudoHTML
    });
}

// Função para aplicar desconto
function aplicarDesconto() {
    const inputDesconto = document.getElementById('valor-desconto');
    
    if (!inputDesconto) {
        console.error('Elemento de input do desconto não encontrado');
        return;
    }
    
    let valorDesconto = inputDesconto.value.replace(',', '.');
    valorDesconto = parseFloat(valorDesconto);
    
    if (isNaN(valorDesconto) || valorDesconto < 0) {
        alert('Por favor, informe um valor de desconto válido.');
        return;
    }
    
    // Armazenar o valor do desconto globalmente
    window.valorDesconto = valorDesconto;
    
    // Atualizar a exibição do carrinho
    atualizarExibicaoCarrinhoComDesconto();
    
    // Fechar o modal
    fecharModalSecundario();
    
    console.log(`Desconto aplicado: R$ ${valorDesconto.toFixed(2)}`);
}

// Função para atualizar a exibição do carrinho com o desconto
function atualizarExibicaoCarrinhoComDesconto() {
    // Se tiver um cupom aplicado, usar a função específica
    if (window.cupomAplicado) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
    } else {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComDesconto();
    }
}

// Função para gerar o HTML do carrinho com desconto aplicado (sem cupom)
function htmlCarrinhoComDesconto() {
    // Calcular o subtotal (soma dos produtos)
    const subtotal = parseFloat(calcularTotalCarrinho().replace(',', '.'));
    
    // Obter o valor do frete (se existir)
    const valorFrete = window.valorFrete || 0;
    
    // Obter o valor do desconto
    const valorDesconto = window.valorDesconto || 0;
    
    // Calcular o total final (subtotal + frete - desconto)
    const totalFinal = Math.max(0, subtotal + valorFrete - valorDesconto);
    
    // Formatar os valores para exibição
    const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
    const descontoFormatado = valorDesconto.toFixed(2).replace('.', ',');
    const freteFormatado = valorFrete.toFixed(2).replace('.', ',');
    const totalFinalFormatado = totalFinal.toFixed(2).replace('.', ',');
    
    // Informação do frete
    const freteInfo = valorFrete > 0 ? `
        <div class="frete-valor">
            <span>Frete:</span>
            <span>+ R$ ${freteFormatado}</span>
        </div>
    ` : '';
    
    // Informação do desconto
    const descontoInfo = valorDesconto > 0 ? `
        <div class="desconto-aplicado">
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
                <p>Total: R$ ${totalFinalFormatado}</p>
            </div>
        </div>
        <button class="btn-primario" onclick="finalizarPedido()" ${produtosCarrinho.length === 0 ? 'disabled' : ''}>
            Finalizar Venda
        </button>
    `;
} 
