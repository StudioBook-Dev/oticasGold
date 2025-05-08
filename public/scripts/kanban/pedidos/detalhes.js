


function abrirModalPrincipal_DetalhesDosPedidos(id) {
    abrirModalPrincipal({
        titulo: `Detalhes do Pedido #${id}`,
        conteudo: '<div id="detalhes-pedido">Carregando detalhes...</div>',
        adicionar: false
    });
    html_visualizarDetalhesPedido(id);
}


// Função para visualizar detalhes do pedido (chamada pelo onclick do card)
async function html_visualizarDetalhesPedido(id) {
    // Buscar o pedido específico
    const pedido = await getPedido(id);
    const html = document.getElementById('detalhes-pedido');

    let clienteFormatado = 'anonimo';
    if (pedido.cliente != 'anonimo') {
        clienteFormatado = `
            <div class="detalhe-secao">
                <h3>Dados do Cliente</h3>
                <p><strong>Nome:</strong> ${pedido.cliente.nome || 'N/A'}</p>
                <p><strong>Telefone:</strong> ${pedido.cliente.telefone || 'N/A'}</p>
                <p><strong>Email:</strong> ${pedido.cliente.email || 'N/A'}</p>
                <p><strong>Endereço:</strong> ${pedido.cliente.enderecoCompleto || 
                    (pedido.cliente.rua ? `${pedido.cliente.rua}, ${pedido.cliente.casa}, ${pedido.cliente.cidade}-${pedido.cliente.estado}, ${pedido.cliente.cep}` : 'N/A')}</p>
            </div>
        `;
    }
    // Processar produtos
    let produtosFormatados = '';
    if (pedido.produtos) {
        let produtosHTML = pedido.produtos.map(produto => {
        // Converte o preço para número usando a função auxiliar
            const preco = converterParaNumero(produto.preco);
            // Garante que a quantidade seja pelo menos 1
            const quantidade = produto.quantidade || 1;
            // Calcula o subtotal (preço × quantidade)
            const subtotal = preco * quantidade;
            // Formata valores para exibição
            const precoFormatado = formatarValorMonetario(preco);
            const subtotalFormatado = formatarValorMonetario(subtotal);
            return `
                <tr>
                    <td>${produto.nome || 'Produto'}</td>
                    <td>${precoFormatado}</td>
                    <td>${quantidade}</td>
                    <td>${subtotalFormatado}</td>
                </tr>
            `;
        }).join('');
        produtosFormatados = `
            <div class="detalhe-secao">
                <h3>Produtos</h3>
                <table class="tabela-produtos-pedido">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produtosHTML}
                    </tbody>
                </table>
            </div>
        `;
    }
    // Formatar valores financeiros
    const totalFormatado    = formatarValorMonetario(pedido.total);
    const descontoFormatado = formatarValorMonetario(pedido.desconto, 'R$ 0,00');
    const freteFormatado    = formatarValorMonetario(pedido.frete, 'R$ 0,00');
    // Construir conteúdo completo
    const conteudo = `
        <div class="detalhes-pedido-container">
            <div class="detalhe-secao">
                <h3>Informações Gerais</h3>
                <p><strong>Número do Pedido:</strong> #${pedido.id}</p>
                <p><strong>Data:</strong> ${pedido.dataCriacao}</p>
                <p><strong>Status:</strong> <span class="status-pedido status-${pedido.status || 'pendente'}">${pedido.status || 'Pendente'}</span></p>
                ${pedido.receitaId ? `<p><strong>ID da Receita:</strong> ${pedido.receitaId}</p>` : ''}
            </div>
            ${clienteFormatado}
            ${produtosFormatados}
            <div class="detalhe-secao resumo-financeiro">
                <h3>Resumo Financeiro</h3>
                <div class="linha-resumo">
                    <span>Subtotal:</span>
                    <span>${totalFormatado}</span>
                </div>
                <div class="linha-resumo">
                    <span>Desconto:</span>
                    <span>${descontoFormatado}</span>
                </div>
                <div class="linha-resumo">
                    <span>Frete:</span>
                    <span>${freteFormatado}</span>
                </div>
                <div class="linha-resumo total">
                    <span>Total:</span>
                    <span>${totalFormatado}</span>
                </div>
            </div>
            ${pedido.observacao ? `
            <div class="detalhe-secao">
                <h3>Observações</h3>
                <p>${pedido.observacao}</p>
            </div>
            ` : ''}
        </div>
    `;

    html.innerHTML = conteudo;
}

