

// Função para carregar os pedidos diretamente da API
async function getPedidos() {
    return fetch('/api/pedidos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar pedidos da API');
            }
            return response.json();
        })
        .then(pedidos => {
            // Verificar se temos pedidos válidos
            if (!Array.isArray(pedidos)) {
                console.error('Formato de resposta inválido, esperava um array de pedidos');
                return [];
            }

            // Processar os pedidos caso necessário
            const pedidosProcessados = pedidos.map(pedido => {
                // Garantir que todos os campos estejam no formato esperado
                return {
                    id: pedido.id.toString(),
                    cliente: typeof pedido.cliente === 'string' ? 
                        JSON.parse(pedido.cliente) : pedido.cliente,
                    produtos: typeof pedido.produtos === 'string' ? 
                        JSON.parse(pedido.produtos) : pedido.produtos,
                    total: parseFloat(pedido.total) || 0,
                    frete: parseFloat(pedido.frete) || 0,
                    desconto: parseFloat(pedido.desconto) || 0,
                    status: pedido.status || 'fila',
                    dataCriacao: pedido.dataCriacao,
                    pagamento: typeof pedido.pagamento === 'string' ? 
                        JSON.parse(pedido.pagamento) : (pedido.pagamento || {}),
                    cupons: typeof pedido.cupons === 'string' ? 
                        JSON.parse(pedido.cupons) : (pedido.cupons || {}),
                    observacao: pedido.observacao || ''
                };
            });

            return pedidosProcessados;
        })
        .catch(error => {
            console.error('Erro ao carregar pedidos:', error);
            return [];
        });
}


async function getPedido(id) {
    try {
        const response = await fetch(`/api/pedidos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pedido: ${response.status} ${response.statusText}`);
        }
        const pedido = await response.json();
        return pedido;
    } catch (error) {
        console.error("Erro ao carregar pedido:", error);       
        return [];
    }
}


// Carregar pedidos quando a página for carregada
document.addEventListener('DOMContentLoaded', function () {
    getPedidos().then(pedidos => {
        // Atualizar a interface, se necessário
        if (typeof atualizarKanbanPedidos === 'function') {
            atualizarKanbanPedidos();
        }
    });
});




