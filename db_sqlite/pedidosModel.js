const { executeSql, getOne, getAll } = require('./database');

// Função para obter todos os pedidos
async function getPedidos() {
    try {
        const pedidos = await getAll('SELECT * FROM pedidos');

        // Converter os campos JSON para objetos JavaScript
        return pedidos.map(pedido => ({
            ...pedido,
            produtos: JSON.parse(pedido.produtos || '[]'),
            pagamento: JSON.parse(pedido.pagamento || '{}'),
            cupons: JSON.parse(pedido.cupons || '{}'),
            cliente: JSON.parse(pedido.cliente || '{}')
        }));
    } catch (error) {
        return [];
    }
}

// Função para obter um pedido específico pelo ID
async function getPedidoById(id) {
    try {
        const pedido = await getOne('SELECT * FROM pedidos WHERE id = ?', [id]);
        if (!pedido) return null;

        // Converter os campos JSON para objetos JavaScript
        return {
            ...pedido,
            produtos: JSON.parse(pedido.produtos || '[]'),
            pagamento: JSON.parse(pedido.pagamento || '{}'),
            cupons: JSON.parse(pedido.cupons || '{}'),
            cliente: JSON.parse(pedido.cliente || '{}')
        };
    } catch (error) {
        return null;
    }
}

// Função para criar um novo pedido
async function createPedido(pedido) {
    try {
        // Converter objetos JavaScript para strings JSON
        const pedidoProcessado = {
            ...pedido,
            produtos: JSON.stringify(pedido.produtos || []),
            pagamento: JSON.stringify(pedido.pagamento || {}),
            cupons: JSON.stringify(pedido.cupons || {}),
            cliente: JSON.stringify(pedido.cliente || {})
        };
        // Verificar se todos os campos necessários existem
        const result = await executeSql(
            `INSERT INTO pedidos (id, cliente, produtos, desconto, frete, total, status, dataCriacao, pagamento, cupons, observacao) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                pedidoProcessado.id,
                pedidoProcessado.cliente,
                pedidoProcessado.produtos,
                pedidoProcessado.desconto,
                pedidoProcessado.frete,
                pedidoProcessado.total,
                pedidoProcessado.status,
                pedidoProcessado.dataCriacao,
                pedidoProcessado.pagamento,
                pedidoProcessado.cupons,
                pedidoProcessado.observacao || ''
            ]
        );
        return { success: true, id: pedidoProcessado.id };
    } catch (error) {
        return { success: false, error: `Erro ao criar pedido: ${error.message}` };
    }
}

// Função para atualizar um pedido existente
async function updatePedido(id, pedidoData) {
    try {
        // Obter o pedido atual para manter os campos não atualizados
        const pedidoAtual = await getPedidoById(id);
        if (!pedidoAtual) {
            return { success: false, error: 'Pedido não encontrado' };
        }

        // Mesclar os dados atuais com os novos dados
        const pedidoAtualizado = { ...pedidoAtual, ...pedidoData };

        // Converter objetos JavaScript para strings JSON
        const pedidoProcessado = {
            ...pedidoAtualizado,
            produtos: JSON.stringify(pedidoAtualizado.produtos || []),
            pagamento: JSON.stringify(pedidoAtualizado.pagamento || {}),
            cupons: JSON.stringify(pedidoAtualizado.cupons || {}),
            cliente: JSON.stringify(pedidoAtualizado.cliente || {})
        };

        await executeSql(
            `UPDATE pedidos SET 
                cliente = ?, 
                produtos = ?, 
                desconto = ?, 
                frete = ?, 
                total = ?, 
                status = ?, 
                dataCriacao = ?, 
                pagamento = ?, 
                cupons = ?, 
                observacao = ? 
             WHERE id = ?`,
            [
                pedidoProcessado.cliente,
                pedidoProcessado.produtos,
                pedidoProcessado.desconto,
                pedidoProcessado.frete,
                pedidoProcessado.total,
                pedidoProcessado.status,
                pedidoProcessado.dataCriacao,
                pedidoProcessado.pagamento,
                pedidoProcessado.cupons,
                pedidoProcessado.observacao,
                id
            ]
        );

        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


// Função para atualizar apenas o status de um pedido
async function updatePedidoStatus(id, novoStatus) {
    try {
        await executeSql('UPDATE pedidos SET status = ? WHERE id = ?', [novoStatus, id]);
        return { success: true, id, status: novoStatus };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


// Função para excluir um pedido
async function deletePedido(id) {
    try {
        await executeSql('DELETE FROM pedidos WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir todos os pedidos
async function deleteAllPedidos() {
    try {
        await executeSql('DELETE FROM pedidos');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getPedidos,
    getPedidoById,
    createPedido,
    updatePedido,
    updatePedidoStatus,
    deletePedido,
    deleteAllPedidos
}; 