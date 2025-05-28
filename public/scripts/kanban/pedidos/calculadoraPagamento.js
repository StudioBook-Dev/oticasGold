

let valorTotalPedido = 0;

function inicializarCalculadoraPagamento(valorTotal) {
    valorTotalPedido = valorTotal;
    adicionarEventListenersInputs();
    atualizarCalculadora();
}

function adicionarEventListenersInputs() {
    const formas = ['Pix', 'Dinheiro', 'Crédito', 'Débito', 'Boleto'];

    formas.forEach(forma => {
        const input = document.getElementById(forma);
        if (input) {
            input.addEventListener('input', calcularPagamento);
            input.addEventListener('change', calcularPagamento);
        }
    });
}

function calcularPagamento() {
    const valores = obterValoresInputs();
    const totalPago = calcularTotalPago(valores);
    const valorRestante = valorTotalPedido - totalPago;
    const troco = totalPago > valorTotalPedido ? totalPago - valorTotalPedido : 0;

    atualizarDisplayCalculadora(totalPago, valorRestante, troco, valores);
}

function obterValoresInputs() {
    return {
        pix: parseFloat(document.getElementById('Pix')?.value) || 0,
        dinheiro: parseFloat(document.getElementById('Dinheiro')?.value) || 0,
        credito: parseFloat(document.getElementById('Crédito')?.value) || 0,
        debito: parseFloat(document.getElementById('Débito')?.value) || 0,
        boleto: parseFloat(document.getElementById('Boleto')?.value) || 0
    };
}

function calcularTotalPago(valores) {
    return valores.pix + valores.dinheiro + valores.credito + valores.debito + valores.boleto;
}

function atualizarDisplayCalculadora(totalPago, valorRestante, troco, valores) {
    const calculadoraDiv = document.getElementById('calculadora-pagamento');

    if (!calculadoraDiv) return;

    const statusPagamento = determinarStatusPagamento(valorRestante);

    calculadoraDiv.innerHTML = `
        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
            <h4 style="margin-bottom: 15px; color: #495057;">💰 Calculadora de Pagamento</h4>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Valor Total do Pedido:</strong></span>
                    <span style="color: #007bff; font-weight: bold;">R$ ${valorTotalPedido.toFixed(2)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Total Pago:</strong></span>
                    <span style="color: #28a745; font-weight: bold;">R$ ${totalPago.toFixed(2)}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span><strong>Valor Restante:</strong></span>
                    <span style="color: ${valorRestante > 0 ? '#dc3545' : '#28a745'}; font-weight: bold;">
                        R$ ${Math.abs(valorRestante).toFixed(2)}
                    </span>
                </div>
                
                ${troco > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background-color: #fff3cd; border-radius: 4px;">
                    <span><strong>💸 Troco:</strong></span>
                    <span style="color: #856404; font-weight: bold;">R$ ${troco.toFixed(2)}</span>
                </div>
                ` : ''}
            </div>
            
            <div style="margin-bottom: 15px; padding: 10px; border-radius: 4px; ${statusPagamento.style}">
                <div style="display: flex; align-items: center;">
                    <span style="margin-right: 8px;">${statusPagamento.icon}</span>
                    <strong>${statusPagamento.texto}</strong>
                </div>
            </div>
            
            ${gerarResumoFormasPagamento(valores)}
        </div>
    `;
}

function determinarStatusPagamento(valorRestante) {
    if (valorRestante > 0) {
        return {
            icon: '⚠️',
            texto: `Faltam R$ ${valorRestante.toFixed(2)} para completar o pagamento`,
            style: 'background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'
        };
    } else if (valorRestante === 0) {
        return {
            icon: '✅',
            texto: 'Pagamento completo!',
            style: 'background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724;'
        };
    } else {
        return {
            icon: '💰',
            texto: `Pagamento excedeu em R$ ${Math.abs(valorRestante).toFixed(2)} - Troco necessário`,
            style: 'background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404;'
        };
    }
}

function gerarResumoFormasPagamento(valores) {
    const formasComValor = Object.entries(valores).filter(([forma, valor]) => valor > 0);

    if (formasComValor.length === 0) {
        return `
            <div style="padding: 8px; background-color: #e2e3e5; border-radius: 4px; text-align: center;">
                <small style="color: #6c757d;">Nenhuma forma de pagamento informada</small>
            </div>
        `;
    }

    let resumo = '<div style="margin-bottom: 10px;"><strong>📋 Resumo das Formas de Pagamento:</strong></div>';
    resumo += '<div style="background-color: white; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6;">';

    formasComValor.forEach(([forma, valor]) => {
        const nomeFormatado = formatarNomeForma(forma);
        resumo += `
            <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                <span>${nomeFormatado}:</span>
                <span style="font-weight: bold;">R$ ${valor.toFixed(2)}</span>
            </div>
        `;
    });

    resumo += '</div>';
    return resumo;
}

function formatarNomeForma(forma) {
    const nomes = {
        'pix': '💳 PIX',
        'dinheiro': '💵 Dinheiro',
        'credito': '💳 Cartão de Crédito',
        'debito': '💳 Cartão de Débito',
        'boleto': '📄 Boleto'
    };
    return nomes[forma] || forma;
}

function atualizarCalculadora() {
    calcularPagamento();
}

function validarPagamentoCompleto() {
    const valores = obterValoresInputs();
    const totalPago = calcularTotalPago(valores);

    if (totalPago === 0) {
        alert('⚠️ Nenhuma forma de pagamento foi informada!');
        return false;
    }

    if (totalPago < valorTotalPedido) {
        const valorRestante = valorTotalPedido - totalPago;
        const confirmar = confirm(`⚠️ O pagamento está incompleto!\n\nFaltam R$ ${valorRestante.toFixed(2)} para completar o pagamento.\n\nDeseja continuar mesmo assim?`);
        return confirmar;
    }

    if (totalPago > valorTotalPedido) {
        const troco = totalPago - valorTotalPedido;
        const confirmar = confirm(`💰 O pagamento excede o valor do pedido!\n\nTroco necessário: R$ ${troco.toFixed(2)}\n\nDeseja continuar?`);
        return confirmar;
    }

    return true;
}
