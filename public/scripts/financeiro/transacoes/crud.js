           

// Função para buscar todas as categorias financeiras da API
async function getTransacoesFinanceiras() {
    try {
        const response = await fetch('/api/financeiro/transacoes');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar transações financeiras: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar transações financeiras:', error);
        return [];
    }
}


// Função para buscar uma transação financeira pelo ID
async function getTransacaoFinanceiraById(id) {
    try {
        const response = await fetch(`/api/financeiro/transacoes/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar transação financeira: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar transação financeira:', error);
        return null;
    }
}


// Função para excluir uma categoria financeira pelo ID
function deleteCategoriaFinanceira(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        fetch(`/api/financeiro/transacoes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Categoria excluída com sucesso!');
            gerarTabelaCategoriasFinanceiras(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria.');
        });
    }
}


// Função para salvar uma nova transação financeira
function postTransacaoFinanceira(transacao) {
    fetch('/api/financeiro/transacoes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transacao)
    })
    .then(response => response.json())
    .then(data => {
        alert('Transação financeira salva com sucesso!');
        abrirDashboard()
    })
    .catch(error => {
        console.error('Erro ao salvar transação:', error);
        alert('Erro ao salvar transação financeira.');
    });
}


// Função para salvar a edição da transação
function putTransacaoFinanceira(transacao) {
    fetch(`/api/financeiro/transacoes/${transacao.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transacao)
    })
    .then(response => response.json())
    .then(data => {
        alert('Transação atualizada com sucesso!');
        fecharModalSecundario();
        gerarTabelaCategoriasFinanceiras(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar transação:', error);
        alert('Erro ao atualizar transação.');
    });
}

