// Função para buscar todas as transações financeiras
async function Ler_TransacoesFinanceiras() {
    try {
        const response = await fetch('/api/financeiro/transacoes');
        if (!response.ok) {
            throw new Error(`Erro ao buscar transações financeiras: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            // Transformar a propriedade pagamento em objeto para cada transação
            return data.map(transacao => ({
                ...transacao,
                pagamento: typeof transacao.pagamento === 'string' ? JSON.parse(transacao.pagamento) : transacao.pagamento
            }));
        } else if (data && typeof data === 'object') {
            console.log('Resposta não é um array:', data);
            return data;
        } else {
            console.log('Resposta inválida, retornando array vazio');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar transações financeiras:', error);
        return [];
    }
}

// Função para salvar uma transação financeira no banco de dados
async function salvarTransacaoFinanceira(transacao) {
    // console.log(transacao)
    try {
        // Verificar campos obrigatórios
        if (!transacao.id || !transacao.tipo || !transacao.valor) {
            console.error('Erro: Campos obrigatórios faltando', {
                id: transacao.id,
                tipo: transacao.tipo,
                valor: transacao.valor
            });
            alert('Erro: Os campos id, tipo e valor são obrigatórios para salvar uma transação.');
            return;
        }

        // Converter o objeto pagamento para string JSON
        const transacaoModificada = {
            ...transacao,
            // Garantir que pagamento seja uma string JSON válida
            pagamento: typeof transacao.pagamento === 'object' ?
                JSON.stringify(transacao.pagamento) :
                transacao.pagamento
        };

        console.log('Enviando transação:', transacaoModificada);

        const response = await fetch('/api/financeiro/transacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transacaoModificada)
        });

        const data = await response.json();

        if (data.error) {
            console.error('Erro ao salvar transação:', data.error);
            alert(`Erro ao salvar transação: ${data.error}`);
            return;
        }

        console.log('Transação salva com sucesso:', data);
        alert('Transação financeira salva com sucesso!');
        return data;
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
        alert('Erro ao salvar transação financeira.');
        throw error;
    }
}

// Função para excluir uma transação financeira
async function excluirTransacaoFinanceira(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        try {
            const response = await fetch(`/api/financeiro/transacoes/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            alert('Transação excluída com sucesso!');
            return data;
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            alert('Erro ao excluir transação.');
            throw error;
        }
    }
}

// Função para atualizar uma transação financeira existente
async function atualizarTransacaoFinanceira(id, transacaoAtualizada) {
    try {
        const response = await fetch(`/api/financeiro/transacoes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transacaoAtualizada)
        });

        const data = await response.json();
        alert('Transação atualizada com sucesso!');
        return data;
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        alert('Erro ao atualizar transação.');
        throw error;
    }
}

// Função para buscar uma transação específica pelo ID
async function buscarTransacaoPorId(id) {
    try {
        const response = await fetch(`/api/financeiro/transacoes/${id}`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar transação: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Transformar a propriedade pagamento em objeto
        if (data && typeof data.pagamento === 'string') {
            data.pagamento = JSON.parse(data.pagamento);
        }

        return data;
    } catch (error) {
        console.error(`Erro ao buscar transação com ID ${id}:`, error);
        return null;
    }
}

