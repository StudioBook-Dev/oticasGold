

function abriModalPagamentoDoPedido(id) {
    abrirModalPrincipal({
        titulo: `Pagamento do Pedido #${id}` ,
        conteudo: `<div id="modalPagamentoDoPedido"></div>`,
        adicionar: false
    });
    form_pagamentoDoPedido(id);
}


function form_pagamentoDoPedido(id) {
    let conteudo = ''
    const html = document.querySelector('#modalPagamentoDoPedido')
    conteudo += `
        <form onsubmit="event.preventDefault(); lancarPagamentoDoPedido('${id}');">
            <div class="form-group">
                <div class="form-group">
                    <label>Tipo</label>
                    <div class="tipo-container">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipoReceita" value="receita"
                            onclick="selecionarTipoCategoriaFinanceira('receita')" name="tipo" checked>
                            <label class="form-check-label" for="tipoReceita">Receita</label>
                        </div>
                    </div>
                </div>
                <div class="form-group" style="display: none;">
                    <label for="descricaoCategoriaFinanceira">Descrição</label>
                    <textarea id="descricaoCategoriaFinanceira" class="form-control form-control-full" 
                    value="Pagamento do Pedido #${id}"></textarea>
                </div>
                <div class="form-group">
                    <label>Formas de Pagamento (R$)</label>
                    <div class="formas-pagamento-container" style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoPix">PIX</label>
                            <input type="number" id="pagamentoPix" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoDinheiro">Dinheiro</label>
                            <input type="number" id="pagamentoDinheiro" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoCredito">Crédito</label>
                            <input type="number" id="pagamentoCredito" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoDebito">Débito</label>
                            <input type="number" id="pagamentoDebito" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <br>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoBoleto">Boleto</label>
                            <input type="number" id="pagamentoBoleto" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoOutros">Outros</label>
                            <input type="number" id="pagamentoOutros" class="form-control" step="0.01" value="0" min="0">
                        </div>
                        <div class="forma-pagamento" style="flex: 1; min-width: 12%;">
                            <label for="pagamentoReserva">Reservas</label>
                            <input type="number" id="pagamentoReserva" class="form-control" step="0.01" value="0" min="0">
                        </div>
                    </div>
                </div>
                <div class="form-group" style="width: 20%;">
                    <label for="juros">Juros</label>
                    <input type="number" id="juros" class="form-control" step="0.01" value="0" min="0">
                </div>
                <div class="form-group" style="width: 50%;">
                    <label for="categoriaFinanceira">Categoria</label>
                    <select id="categoriaFinanceira" name="categoriaFinanceira" class="form-control" required>
                        <option value="vendas">
                            Vendas
                        </option>
                    </select>
                </div>
            </div>
            <br>
            <div class="form-actions">
                <button type="submit" class="btn-salvar">Salvar</button>
                <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
            </div>
        </form>
    `
    html.innerHTML = conteudo
}


async function lancarPagamentoDoPedido(id) {
    const pedido = await getPedido(id);
    const juros = document.querySelector('#juros').value
    // Coletar valores das formas de pagamento
    const pagamentoPix = parseFloat(document.querySelector('#pagamentoPix').value) || 0
    const pagamentoDinheiro = parseFloat(document.querySelector('#pagamentoDinheiro').value) || 0
    const pagamentoCredito = parseFloat(document.querySelector('#pagamentoCredito').value) || 0
    const pagamentoDebito = parseFloat(document.querySelector('#pagamentoDebito').value) || 0
    const pagamentoBoleto = parseFloat(document.querySelector('#pagamentoBoleto').value) || 0
    const pagamentoOutros = parseFloat(document.querySelector('#pagamentoOutros').value) || 0
    const pagamentoReserva = parseFloat(document.querySelector('#pagamentoReserva').value) || 0
    // Calcular valor total
    const valorTotal = pagamentoPix + pagamentoDinheiro + pagamentoCredito +
        pagamentoDebito + pagamentoBoleto + pagamentoOutros + pagamentoReserva
    // Criar array de formas de pagamento (incluindo apenas os que têm valor maior que zero)
    const formasPagamento = []

    if (pagamentoPix > 0) formasPagamento.push({ forma: 'pix', valor: pagamentoPix })
    if (pagamentoDebito > 0) formasPagamento.push({ forma: 'debito', valor: pagamentoDebito })
    if (pagamentoBoleto > 0) formasPagamento.push({ forma: 'boleto', valor: pagamentoBoleto })
    if (pagamentoOutros > 0) formasPagamento.push({ forma: 'outros', valor: pagamentoOutros })
    if (pagamentoCredito > 0) formasPagamento.push({ forma: 'credito', valor: pagamentoCredito })
    if (pagamentoDinheiro > 0) formasPagamento.push({ forma: 'dinheiro', valor: pagamentoDinheiro })
    if (pagamentoReserva > 0) formasPagamento.push({ forma: 'reserva', valor: pagamentoReserva })

    if (formasPagamento.length === 0) {
        alert('Nenhuma forma de pagamento selecionada')
        return
    }

    const transacao = {
        id: pedido.id,
        dataCriacao: dataFormatada().data,
        descricao: `Pagamento do Pedido #${pedido.id}`,
        tipo: 'receita',
        categoria: 'vendas',
        valor: valorTotal,
        pagamento: {
            formas: formasPagamento,
            juros: juros || 0,
        }
    };

    pedido.pagamento = transacao;

    atualizarPedidoNoBancoDeDados(pedido)
    salvarTransacaoFinanceira(transacao)
}


