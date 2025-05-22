

// Função para buscar todas as movimentações da API
async function getMovimentacoes() {
    try {
        const response = await fetch('/api/estoque/movimentacoes');
        if (!response.ok) {
            throw new Error(`Erro ao buscar movimentações: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
        return [];
    }
}


// Função para buscar uma movimentação pelo ID
async function getMovimentacaoById(id) {
    try {
        const response = await fetch(`/api/estoque/movimentacao/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar movimentação: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar movimentação:', error);
        return null;
    }
}


// Função para excluir uma categoria pelo ID
function deleteCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
        fetch(`/api/estoque/movimentacao/${id}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                alert('Movimentação excluída com sucesso!');
                gerarTabelaMovimentacoes(); // Atualizar a tabela
            })
            .catch(error => {
                console.error('Erro ao excluir movimentação:', error);
                alert('Erro ao excluir movimentação.');
            });
    }
}


// Função para salvar uma nova movimentação
function postMovimentacao(movimentacao) {
    fetch('/api/estoque/movimentacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimentacao)
    })
        .then(response => response.json())
        .then(data => {
            alert('Movimentação salva com sucesso!');
            fecharModalSecundario();
            gerarTabelaMovimentacoes();
        })
        .catch(error => {
            console.error('Erro ao salvar movimentação:', error);
            alert('Erro ao salvar movimentação.');
        });
}


// Função para salvar a edição da movimentação
function putMovimentacao(movimentacao) {
    fetch(`/api/estoque/movimentacao/${movimentacao.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimentacao)
    })
        .then(response => response.json())
        .then(data => {
            alert('Movimentação atualizada com sucesso!');
            fecharModalSecundario();
            gerarTabelaMovimentacoes();
        })
        .catch(error => {
            console.error('Erro ao atualizar movimentação:', error);
            alert('Erro ao atualizar movimentação.');
        });
}

