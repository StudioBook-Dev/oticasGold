

function abriModalPagamentoDoPedido(id) {
    abrirModalPrincipal({
        titulo: `Pagamento do Pedido #${id}`,
        conteudo: `<div id="modalPagamentoDoPedido"></div>`,
        adicionar: ''
    });
    form_pagamentoDoPedido(id);
}


async function form_pagamentoDoPedido(id) {
    const pedido = await getPedidoById(id);
    console.log(pedido)
    const valorTotal = pedido.total
    const formas = ['Pix', 'Dinheiro', 'Crédito', 'Débito', 'Boleto']
    const html = document.querySelector('#modalPagamentoDoPedido')
    let conteudo = `
        <form onsubmit="event.preventDefault(); constructPostPagamentoDoPedido('${id}');" style="display: flex; flex-direction: column;">
            <div style="display: flex; flex-direction: row; width: 100%; gap: 20px;">

                <div class="form-group" style="flex: 1; max-width: 50%;">
                    <div class="form-group" style="display: none;">
                        <label for="descricaoCategoriaFinanceira">Descrição</label>
                        <textarea id="descricaoCategoriaFinanceira" class="form-control form-control-full" 
                        value="Pagamento do Pedido #${id}"></textarea>
                    </div>
                    <div class="form-group">
                        <h4 style="margin-bottom: 15px; color: #495057;">💳 Formas de Pagamento</h4>
                        <div class="modalInputs" style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; border: 1px solid #dee2e6;">`;
    formas.forEach(forma => {
        conteudo += `
                            <div style="display: flex; flex-direction: row; margin-bottom: 12px; align-items: center;">
                                <label style="width: 8em; font-weight: 500;" for="${forma}">${forma}:</label>
                                <div style="display: flex; align-items: center;">
                                    <span style="margin-right: 5px;">R$</span>
                                    <input style="width: 12em; height: 2.5em; padding: 5px; border: 1px solid #ced4da; border-radius: 4px;" 
                                           type="number" id="${forma}" class="form-control" step="0.01" value="0" min="0" 
                                           placeholder="0,00">
                                </div>
                            </div>`
    })
    conteudo += `
                        </div>
                    </div> 
                </div>

                <div id="calculadora-pagamento" style="flex: 1; max-width: 50%;">
                    <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; text-align: center;">
                        <h4 style="color: #495057;">💰 Calculadora de Pagamento</h4>
                        <p style="color: #6c757d;">Carregando...</p>
                    </div>
                </div>
            </div>
            <br>
            <div class="form-actions" style="width: 100%; text-align: center;">
                <button type="submit" class="btn-salvar" style="margin-right: 10px;">Salvar Pagamento</button>
                <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
            </div>
        </form>
    `
    html.innerHTML = conteudo

    // Inicializar a calculadora após criar o HTML
    setTimeout(() => {
        inicializarCalculadoraPagamento(valorTotal);
    }, 100);
}




async function constructPostPagamentoDoPedido(id) {
    // Validar pagamento usando a calculadora
    if (!validarPagamentoCompleto()) {
        return;
    }

    const pedido = await getPedidoById(id);
    const juros = 0
    // Coletar valores das formas de pagamento (usando os IDs corretos)
    const pagamentoPix = parseFloat(document.querySelector('#Pix').value) || 0
    const pagamentoDinheiro = parseFloat(document.querySelector('#Dinheiro').value) || 0
    const pagamentoCredito = parseFloat(document.querySelector('#Crédito').value) || 0
    const pagamentoDebito = parseFloat(document.querySelector('#Débito').value) || 0
    const pagamentoBoleto = parseFloat(document.querySelector('#Boleto').value) || 0

    // Calcular valor total
    const valorTotal = pagamentoPix + pagamentoDinheiro + pagamentoCredito +
        pagamentoDebito + pagamentoBoleto

    // Criar array de formas de pagamento (incluindo apenas os que têm valor maior que zero)
    const formasPagamento = []

    if (pagamentoPix > 0) formasPagamento.push({ forma: 'pix', valor: pagamentoPix })
    if (pagamentoDebito > 0) formasPagamento.push({ forma: 'debito', valor: pagamentoDebito })
    if (pagamentoBoleto > 0) formasPagamento.push({ forma: 'boleto', valor: pagamentoBoleto })
    if (pagamentoCredito > 0) formasPagamento.push({ forma: 'credito', valor: pagamentoCredito })
    if (pagamentoDinheiro > 0) formasPagamento.push({ forma: 'dinheiro', valor: pagamentoDinheiro })

    if (formasPagamento.length === 0) {
        alert('Nenhuma forma de pagamento selecionada')
        return
    }

    const transacao = {
        id: gerarId(),
        dataCriacao: dataFormatada().data,
        descricao: `Pagamento do Pedido #${pedido.id}`,
        tipo: 'receita',
        categoria: 'vendas',
        valor: valorTotal,
        pagamento: {
            formas: formasPagamento,
            juros,
        }
    };
    pedido.pagamento = transacao;
    pedido.status = 'finalizado'

    putPedido(pedido)
    postTransacaoFinanceira(transacao)
    fecharModalSecundario()
    fecharModalPrincipal()
}


