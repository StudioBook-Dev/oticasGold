const { executeSql, getOne, getAll } = require('./database');

// Função para obter todos os produtos
async function getProdutos() {
    try {
        return await getAll('SELECT * FROM produtos');
    } catch (error) {
        return [];
    }
}

// Função para obter um produto específico pelo ID
async function getProdutoById(id) {
    try {
        return await getOne('SELECT * FROM produtos WHERE id = ?', [id]);
    } catch (error) {
        return null;
    }
}

// Função para criar um novo produto
async function createProduto(produtoData) {
    try {
        // Validar se produto com mesmo código interno já existe
        const produtoExistente = await getOne(
            'SELECT id FROM produtos WHERE codigoInterno = ?',
            [produtoData.codigoInterno]
        );

        if (produtoExistente) {
            return {
                success: false,
                error: `Produto com código interno "${produtoData.codigoInterno}" já existe`
            };
        }

        await executeSql(
            `INSERT INTO produtos (id, nome, descricao, preco, custo, estoque, codigoInterno, codigoExterno, categoria, dataCriacao) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                produtoData.id,
                produtoData.nome,
                produtoData.descricao,
                produtoData.preco,
                produtoData.custo || 0,
                produtoData.estoque,
                produtoData.codigoInterno,
                produtoData.codigoExterno,
                produtoData.categoria,
                produtoData.dataCriacao
            ]
        );
        return { success: true, id: produtoData.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para atualizar um produto existente
async function updateProduto(id, produtoData) {
    try {
        // Verificar se produto existe
        const produtoExistente = await getOne('SELECT * FROM produtos WHERE id = ?', [id]);
        if (!produtoExistente) {
            return { success: false, error: 'Produto não encontrado' };
        }

        // Verificar se outro produto já tem o mesmo código interno (se fornecido)
        if (produtoData.codigoInterno) {
            const outroComMesmoCodigo = await getOne(
                'SELECT id FROM produtos WHERE codigoInterno = ? AND id != ?',
                [produtoData.codigoInterno, id]
            );

            if (outroComMesmoCodigo) {
                return {
                    success: false,
                    error: `Produto com código interno "${produtoData.codigoInterno}" já existe`
                };
            }
        }

        await executeSql(
            `UPDATE produtos SET nome = ?, descricao = ?, preco = ?, custo = ?, estoque = ?, codigoInterno = ?, codigoExterno = ?, categoria = ? WHERE id = ?`,
            [
                produtoData.nome,
                produtoData.descricao,
                produtoData.preco,
                produtoData.custo || 0,
                produtoData.estoque,
                produtoData.codigoInterno,
                produtoData.codigoExterno,
                produtoData.categoria,
                id
            ]
        );
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir um produto
async function deleteProduto(id) {
    try {
        await executeSql('DELETE FROM produtos WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir todos os produtos
async function deleteAllProdutos() {
    try {
        await executeSql('DELETE FROM produtos');
        return { success: true };
    } catch (error) {
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