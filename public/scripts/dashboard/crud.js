

async function getByIdTransacaoFinanceira(id) {
    try {
        const response = await fetch(`/api/financeiro/transacoes/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar transação: ${response.status}`);
        }
        const data = await response.json();

        // Transformar a propriedade pagamento em objeto
        if (data && typeof data.pagamento === 'string') {
            data.pagamento = JSON.parse(data.pagamento);
        }

        return data;
    } catch (error) {
        console.error('Erro ao buscar transação:', error);
        return null;
    }
}


