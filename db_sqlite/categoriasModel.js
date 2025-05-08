const { executeSql, getOne, getAll } = require('./database');

// Função para obter todas as categorias
async function getCategorias() {
    try {
        // Primeiro, excluir categorias sem ID
        await executeSql('DELETE FROM categorias WHERE id IS NULL');
        
        // Depois buscar categorias
        return await getAll('SELECT * FROM categorias');
    } catch (error) {
        return [];
    }
}

// Função para obter uma categoria específica pelo ID
async function getCategoriaById(id) {
    try {
        return await getOne('SELECT * FROM categorias WHERE id = ?', [id]);
    } catch (error) {
        return null;
    }
}

// Função para criar uma nova categoria
async function createCategoria(categoria) {
    try {
        // Gerar ID único se não for fornecido
        if (!categoria.id) {
            // Obter o maior ID atual e incrementar
            const maxIdResult = await getOne('SELECT MAX(id) as maxId FROM categorias');
            const maxId = maxIdResult && maxIdResult.maxId ? parseInt(maxIdResult.maxId) : 0;
            categoria.id = (maxId + 1).toString();
        }
        
        const result = await executeSql(
            `INSERT INTO categorias (id, nome, descricao) 
             VALUES (?, ?, ?)`,
            [
                categoria.id,
                categoria.nome,
                categoria.descricao
            ]
        );
        
        return { success: true, id: categoria.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para atualizar uma categoria existente
async function updateCategoria(id, categoriaData) {
    try {
        await executeSql(
            `UPDATE categorias SET 
                nome = ?, 
                descricao = ? 
             WHERE id = ?`,
            [
                categoriaData.nome,
                categoriaData.descricao,
                id
            ]
        );
        
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir uma categoria
async function deleteCategoria(id) {
    try {
        // Verificar se existem produtos associados a esta categoria
        const produtosAssociados = await getAll('SELECT id FROM produtos WHERE categoria = ?', [id]);
        if (produtosAssociados.length > 0) {
            return { 
                success: false, 
                error: 'Não é possível excluir esta categoria pois existem produtos associados a ela' 
            };
        }
        
        await executeSql('DELETE FROM categorias WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir todas as categorias
async function deleteAllCategorias() {
    try {
        await executeSql('DELETE FROM categorias');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    deleteAllCategorias
}; 