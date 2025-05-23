const { executeSql, getDb, getAll } = require('./database');

// Obter todas as categorias financeiras
async function getCategoriasFinanceiras() {
    try {
        const result = await getAll('SELECT * FROM categoriasFinanceiras');
        return result;
    } catch (error) {
        return [];
    }
}

// Obter categoria financeira por ID
async function getCategoriaFinanceiraById(id) {
    try {
        console.log(`Buscando categoria financeira com ID ${id}...`);
        const result = await getAll("SELECT * FROM categoriasFinanceiras WHERE id = ?", [id]);
        console.log(`Resultado da busca por ID ${id}:`, result);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error(`Erro ao buscar categoria financeira com ID ${id}:`, error);
        return null;
    }
}

// Criar nova categoria financeira
async function createCategoriaFinanceira(categoria) {
    try {
        // Verificar campos obrigatórios
        if (!categoria.id || !categoria.nome || !categoria.tipo) {
            return { success: false, error: 'Os campos id, nome e tipo são obrigatórios' };
        }

        await executeSql(
            `INSERT INTO categoriasFinanceiras (id, nome, tipo, descricao, icone, cor, saldo) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                categoria.id,
                categoria.nome,
                categoria.tipo,
                categoria.descricao || '',
                categoria.icone || '',
                categoria.cor || '#000000',
                categoria.saldo || 0
            ]
        );

        return { success: true, id: categoria.id };
    } catch (error) {
        console.error("Erro ao criar categoria financeira:", error);
        return { success: false, error: error.message };
    }
}

// Atualizar categoria financeira
async function updateCategoriaFinanceira(id, categoria) {
    try {
        // Verificar se a categoria existe
        const existingCategoria = await getCategoriaFinanceiraById(id);
        if (!existingCategoria) {
            return { success: false, error: 'Categoria financeira não encontrada' };
        }

        await executeSql(
            `UPDATE categoriasFinanceiras 
             SET nome = ?, tipo = ?, descricao = ?, icone = ?, cor = ?, saldo = ?
             WHERE id = ?`,
            [
                categoria.nome,
                categoria.tipo,
                categoria.descricao || '',
                categoria.icone || '',
                categoria.cor || '#000000',
                categoria.saldo || 0,
                id
            ]
        );

        return { success: true, id };
    } catch (error) {
        console.error(`Erro ao atualizar categoria financeira com ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

// Deletar categoria financeira
async function deleteCategoriaFinanceira(id) {
    try {
        // Verificar se a categoria existe
        const existingCategoria = await getCategoriaFinanceiraById(id);
        if (!existingCategoria) {
            return { success: false, error: 'Categoria financeira não encontrada' };
        }

        await executeSql("DELETE FROM categoriasFinanceiras WHERE id = ?", [id]);
        return { success: true, id };
    } catch (error) {
        console.error(`Erro ao deletar categoria financeira com ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

// FUNÇÕES PARA TRANSAÇÕES FINANCEIRAS

// Obter todas as transações financeiras
async function getTransacoesFinanceiras() {
    try {
        console.log('Iniciando busca de transações financeiras no banco de dados...');
        const result = await getAll("SELECT * FROM transacoesFinanceiras ORDER BY dataCriacao DESC");
        return result;
    } catch (error) {
        console.error("Erro ao buscar transações financeiras:", error);
        return [];
    }
}

// Obter transação financeira por ID
async function getTransacaoFinanceiraById(id) {
    try {
        console.log(`Buscando transação financeira com ID ${id}...`);
        const result = await getAll("SELECT * FROM transacoesFinanceiras WHERE id = ?", [id]);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error(`Erro ao buscar transação financeira com ID ${id}:`, error);
        return null;
    }
}

// Criar nova transação financeira
async function createTransacaoFinanceira(transacao) {
    try {
        // Verificar campos obrigatórios
        if (!transacao.id || !transacao.tipo || !transacao.valor) {
            return { success: false, error: 'Os campos id, tipo e valor são obrigatórios' };
        }

        await executeSql(
            `INSERT INTO transacoesFinanceiras (id, dataCriacao, descricao, tipo, categoria, valor, pagamento) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                transacao.id,
                transacao.dataCriacao,
                transacao.descricao || '',
                transacao.tipo,
                transacao.categoria || '',
                transacao.valor,
                JSON.stringify(transacao.pagamento || {}),
            ]
        );

        return { success: true, id: transacao.id };
    } catch (error) {
        console.error("Erro ao criar transação financeira:", error);
        return { success: false, error: error.message };
    }
}

// Atualizar transação financeira
async function updateTransacaoFinanceira(id, transacao) {
    try {
        // Verificar se a transação existe
        const existingTransacao = await getTransacaoFinanceiraById(id);
        if (!existingTransacao) {
            return { success: false, error: 'Transação financeira não encontrada' };
        }

        await executeSql(
            `UPDATE transacoesFinanceiras 
             SET descricao = ?, tipo = ?, categoria = ?, valor = ?, pagamento = ?
             WHERE id = ?`,
            [
                transacao.descricao || '',
                transacao.tipo,
                transacao.categoria || '',
                transacao.valor,
                JSON.stringify(transacao.pagamento || {}),
                id
            ]
        );

        return { success: true, id };
    } catch (error) {
        console.error(`Erro ao atualizar transação financeira com ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

// Deletar transação financeira
async function deleteTransacaoFinanceira(id) {
    try {
        // Verificar se a transação existe
        const existingTransacao = await getTransacaoFinanceiraById(id);
        if (!existingTransacao) {
            return { success: false, error: 'Transação financeira não encontrada' };
        }

        await executeSql("DELETE FROM transacoesFinanceiras WHERE id = ?", [id]);
        return { success: true, id };
    } catch (error) {
        console.error(`Erro ao deletar transação financeira com ID ${id}:`, error);
        return { success: false, error: error.message };
    }
}

// Função para excluir todas as transações financeiras
async function deleteAllTransacoesFinanceiras() {
    try {
        await executeSql('DELETE FROM transacoesFinanceiras');
        return { success: true };
    } catch (error) {
        console.error('Erro ao excluir todas as transações financeiras:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    getCategoriasFinanceiras,
    getCategoriaFinanceiraById,
    createCategoriaFinanceira,
    updateCategoriaFinanceira,
    deleteCategoriaFinanceira,

    // Exportar funções de transações financeiras
    getTransacoesFinanceiras,
    getTransacaoFinanceiraById,
    createTransacaoFinanceira,
    updateTransacaoFinanceira,
    deleteTransacaoFinanceira,
    deleteAllTransacoesFinanceiras
}; 