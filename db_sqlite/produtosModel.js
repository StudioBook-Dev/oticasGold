const { executeSql, getOne, getAll } = require('./database');

// Função para obter todos os produtos
async function getProdutos() {
    try {
        // Primeiro, excluir produtos sem ID
        await executeSql('DELETE FROM produtos WHERE id IS NULL');
        
        // Depois buscar produtos
        return await getAll('SELECT * FROM produtos');
    } catch (error) {
        // console.error('Erro ao buscar produtos:', error);
        return [];
    }
}

// Função para obter um produto específico pelo ID
async function getProdutoById(id) {
    try {
        return await getOne('SELECT * FROM produtos WHERE id = ?', [id]);
    } catch (error) {
        // console.error(`Erro ao buscar produto ${id}:`, error);
        return null;
    }
}

// Função para criar um novo produto
async function createProduto(produto) {
    try {
        // Gerar ID único se não for fornecido
        if (!produto.id) {
            // Obter o maior ID atual e incrementar
            const maxIdResult = await getOne('SELECT MAX(id) as maxId FROM produtos');
            const maxId = maxIdResult && maxIdResult.maxId ? parseInt(maxIdResult.maxId) : 0;
            produto.id = (maxId + 1).toString();
        }
        
        const result = await executeSql(
            `INSERT INTO produtos (id, nome, descricao, preco, estoque, codigoInterno, codigoExterno, categoria, dataCriacao) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produto.id,
                produto.nome,
                produto.descricao,
                produto.preco,
                produto.estoque,
                produto.codigoInterno,
                produto.codigoExterno,
                produto.categoria,
                produto.dataCriacao || new Date().toISOString()
            ]
        );
        
        return { success: true, id: produto.id };
    } catch (error) {
        // console.error('Erro ao criar produto:', error);
        return { success: false, error: error.message };
    }
}

// Função para atualizar um produto existente
async function updateProduto(id, produtoData) {
    try {
        await executeSql(
            `UPDATE produtos SET 
                nome = ?, 
                descricao = ?, 
                preco = ?, 
                estoque = ?, 
                codigoInterno = ?, 
                codigoExterno = ?, 
                categoria = ? 
             WHERE id = ?`,
            [
                produtoData.nome,
                produtoData.descricao,
                produtoData.preco,
                produtoData.estoque,
                produtoData.codigoInterno,
                produtoData.codigoExterno,
                produtoData.categoria,
                id
            ]
        );
        
        return { success: true, id };
    } catch (error) {
        // console.error(`Erro ao atualizar produto ${id}:`, error);
        return { success: false, error: error.message };
    }
}


// Função para excluir um produto
async function deleteProduto(id) {
    try {
        await executeSql('DELETE FROM produtos WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        // console.error(`Erro ao excluir produto ${id}:`, error);
        return { success: false, error: error.message };
    }
}

// Função para excluir todos os produtos
async function deleteAllProdutos() {
    try {
        await executeSql('DELETE FROM produtos');
        return { success: true };
    } catch (error) {
        // console.error('Erro ao excluir todos os produtos:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    getProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto,
    deleteAllProdutos
}; 