

function finalizarPedido() {
    if (produtosCarrinho.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    // Calcular o valor final considerando o frete, cupom e desconto
    let subtotal = parseFloat(calcularTotalCarrinho().replace(',', '.'));
    let valorDesconto = window.valorDesconto || 0; // Iniciar com o desconto manual se existir
    let valorFrete = window.valorFrete || 0; // Obter o valor do frete do objeto global
    let valorTotal = subtotal + valorFrete - valorDesconto;
    let cupomInfo = '';
    let clienteInfo = window.clienteSelecionado || { id: '', nome: 'anonimo' };
    let observacaoPedido = window.observacaoPedido || '';

    // Se tiver um cupom aplicado, calcular o desconto adicional do cupom
    if (window.cupomAplicado) {
        cupomInfo = window.cupomAplicado;

        // Calcular o valor do desconto com base no tipo de cupom
        if (cupomInfo.tipo === 'percentual') {
            // Desconto percentual sobre o valor já descontado
            const descontoCupom = subtotal * (parseFloat(cupomInfo.valor) / 100);
            valorDesconto += descontoCupom;
        } else {
            // Desconto fixo
            valorDesconto += parseFloat(cupomInfo.valor);
        }

        // Resetar a variável global após o uso
        window.cupomAplicado = null;
    }

    // Recalcular o total final: subtotal + frete - desconto (total)
    valorTotal = Math.max(0, subtotal + valorFrete - valorDesconto);

    // Formatar o valor total
    const valorTotalFormatado = valorTotal.toFixed(2).replace('.', ',');

    // Limpar o carrinho
    // Atualizar a exibição do carrinho
    document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();

    const cliente = {
        id: clienteInfo.id || 0,
        nome: clienteInfo.nome || 'anonimo'
    }

    // Criar o pedido com os dados do carrinho
    const pedido = {
        id: gerarId(),
        cliente: cliente,
        produtos: produtosCarrinho,
        total: valorTotalFormatado || '0,00',
        frete: valorFrete.toFixed(2).replace('.', ',') || '0,00',
        status: 'fila', 
        dataCriacao: dataFormatada().data, 
        pagamento: {
            id: '',
            dataCriacao: '',
            descricao: ``,
            tipo: '',
            categoria: '',
            valor: 0,
            pagamento: {
            formas: '',
            juros: 0,
        }
        },
        cupons: cupomInfo || {},
        desconto: valorDesconto.toFixed(2).replace('.', ',') || '0,00',
        observacao: observacaoPedido || '',
    };
    
    // Processar saída do estoque
    salvarPedidoNoBancoDeDados(pedido)
    atualizarEstoqueDeProdutosDoPedido(produtosCarrinho);
        
    // Limpar o carrinho
    produtosCarrinho = [];
    // Resetar as variáveis globais após finalizar o pedido
    window.valorFrete = 0;
    window.valorDesconto = 0;
    window.clienteSelecionado = null;
    window.observacaoPedido = '';

    // Atualizar a interface do Kanban se necessário
    if (typeof carregarPedidos === 'function') {
        carregarPedidos();
    }
    
    // Fechar o modal de pedido se estiver aberto
    fecharModalPrincipal();  
}

/**
 * Processa a saída de múltiplos produtos do estoque via API
 * @param {Array} produtosCarrinho - Array de objetos com id e quantidade para dar saída
 */
async function atualizarEstoqueDeProdutosDoPedido(produtosCarrinho) {
    try {
        const produtosDb = await getProdutos();
        
        // Para cada produto no carrinho, registrar a saída no estoque
        for (const produtoCarrinho of produtosCarrinho) {
            const produtoDb = produtosDb.find(p => p.id === produtoCarrinho.id);
            
            if (produtoDb) {
                // Registrar no histórico de movimentações
                const movimentacao = {
                    id: gerarId(),
                    tipo: 'saida',
                    produtoId: produtoCarrinho.id,
                    produtoNome: produtoCarrinho.nome || produtoDb.nome,
                    quantidade: produtoCarrinho.quantidade,
                    motivo: 'Saída para Pedido',
                    observacao: 'Produto utilizado em pedido',
                    data: dataFormatada().data
                };
                
                // Usar a API de movimentação que já atualiza o estoque automaticamente
                await adicionarMovimentacaoAoHistorico(movimentacao);
            }
        }
    } catch (erro) {
        console.error('Erro ao atualizar estoque de produtos do pedido:', erro);
        alert('Houve um erro ao processar a saída de estoque. Por favor, verifique o estoque manualmente.');
    }
} 