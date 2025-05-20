
/**
 * Funções para registrar as movimentações de estoque (entradas e saídas)
 */
async function constructPostMovimentacao(id, motivo) {
    const produto = await getProdutoById(id)
    const quantidade = parseFloat(document.getElementById('quantidade').value);    
    const observacao = document.getElementById('observacao').value;
    
    let movimentacao = {
        id: gerarId(),
        tipo: '',
        motivo: motivo || '',
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: quantidade || produto.estoque,
        observacao: observacao || '',
        data: dataFormatada().data
    };
    
    if (produto.estoque > produto.estoque) {
        movimentacao.quantidade = produto.estoque - produto.estoque
        movimentacao.motivo = 'Saída Manual'
        movimentacao.tipo = 'saida'
    }
    if (produto.estoque < produto.estoque) {
        movimentacao.quantidade = produto.estoque - produto.estoque
        movimentacao.motivo = 'Entrada Manual'
        movimentacao.tipo = 'entrada'
    }

    postMovimentacao(movimentacao)
}





