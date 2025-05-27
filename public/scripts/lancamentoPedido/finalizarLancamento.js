

function constructPostPedido() {
    let total = 0
    const { itensPedido, cupom, frete, desconto, cliente, observacao } = getItensPedidoInLocalStorage()

    if (itensPedido.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }
    itensPedido.forEach(item => {
        total += parseFloat(item.preco) * item.quantidade
    })

    // Criar o pedido com os dados do carrinho
    const pedido = {
        id: gerarId(),
        cliente: cliente,
        produtos: itensPedido,
        total: total || 0,
        frete: frete || 0,
        status: 'fila', 
        dataCriacao: dataFormatada().data, 
        cupons: cupom || 0,
        desconto: desconto || 0,
        observacao: observacao || '',
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
    }
    postPedido(pedido)
    atualizarEstoqueDeProdutosDoPedido(itensPedido);
    abrirKanban
}


async function atualizarEstoqueDeProdutosDoPedido(itensPedido) {
    itensPedido.forEach(async (item) => {
        // Lança a movimentação no estoque
        constructPostMovimentacao(item.id, 'automatico')

        // Atualiza o estoque do produto
        const produto = await getProdutoById(item.id);
        produto.estoque = produto.estoque - item.quantidade
        putProduto(produto)
    })
} 