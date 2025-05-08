/**
 * Funções para gerenciar as movimentações de estoque (entradas e saídas)
 */
async function hubAtualizarEstoque_Automatico(produto, motivo) {
    const produtoOriginal = await getProduto(produto.id)
    let movimentacao = {
        id: gerarId(),
        tipo: '',
        produtoId: produtoOriginal.id,
        produtoNome: produto.nome,
        quantidade: 0,
        motivo: motivo,
        observacao: 'edição de produto',
        data: dataFormatada().data
    };
    if (produtoOriginal.estoque == produto.estoque) {
        return
    }
    if (produtoOriginal.estoque > produto.estoque) {
        movimentacao.quantidade = produtoOriginal.estoque - produto.estoque
        movimentacao.motivo = 'Saída Manual'
        movimentacao.tipo = 'saida'
    }
    if (produtoOriginal.estoque < produto.estoque) {
        movimentacao.quantidade = produto.estoque - produtoOriginal.estoque
        movimentacao.motivo = 'Entrada Manual'
        movimentacao.tipo = 'entrada'
    }
    // console.log(movimentacao);
    adicionarMovimentacaoAoHistorico(movimentacao)
}


/**
 * Adiciona uma movimentação ao histórico de estoque no banco de dados
 * Registra entradas ou saídas e atualiza quantidade do produto
 */

function adicionarMovimentacaoAoHistorico(movimentacao) {  
    // Fazer a requisição para a API
    fetch('/api/estoque/movimentacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimentacao)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || `Erro ao registrar movimentação: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(resultado => {
        // console.log('Movimentação registrada com sucesso:', resultado);
        alert('Movimentação registrada com sucesso!');
    })
    .catch(error => {
        // console.error('Erro ao registrar movimentação:', error);
        alert(`Erro ao registrar movimentação: ${error.message}`);
    });
}


