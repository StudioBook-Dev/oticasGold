

async function salvarPedidoNoBancoDeDados(pedido) {
    try {
        // Enviar para a API SQLite
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Status HTTP: ${response.status}` }));
            throw new Error(errorData.error || `Erro ao salvar pedido: ${response.status}`);
        }

        const data = await response.json();

        // Atualizar o kanban se necessário
        if (typeof atualizarKanbanPedidos === 'function') {
            atualizarKanbanPedidos();
        }

        return { success: true, id: data.id };
    } catch (error) {
        console.error('Erro ao salvar pedido:', error);
        return { success: false, error: error.message };
    }
}


async function atualizarPedidoNoBancoDeDados(pedido) {
    try {
        // Enviar para a API SQLite
        const response = await fetch(`/api/pedidos/${pedido.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Status HTTP: ${response.status}` }));
            throw new Error(errorData.error || `Erro ao atualizar pedido: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        return { success: false, error: error.message };
    }
}



