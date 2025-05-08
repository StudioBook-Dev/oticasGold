const { executeSql, getOne, getAll } = require('./database');

// Função para obter todos os cupons
async function getCupons() {
    try {
        // Primeiro, excluir cupons sem ID
        await executeSql('DELETE FROM cupons WHERE id IS NULL');
        
        // Depois buscar cupons
        return await getAll('SELECT * FROM cupons');
    } catch (error) {
        return [];
    }
}

// Função para obter um cupom específico pelo ID
async function getCupomById(id) {
    try {
        return await getOne('SELECT * FROM cupons WHERE id = ?', [id]);
    } catch (error) {
        return null;
    }
}

// Função para criar um novo cupom
async function createCupom(cupom) {
    try {
        // Gerar ID único se não for fornecido
        if (!cupom.id) {
            // Obter o maior ID atual e incrementar
            const maxIdResult = await getOne('SELECT MAX(id) as maxId FROM cupons');
            const maxId = maxIdResult && maxIdResult.maxId ? parseInt(maxIdResult.maxId) : 0;
            cupom.id = (maxId + 1).toString();
        }
        
        const result = await executeSql(
            `INSERT INTO cupons (id, nome, valor, tipo, datacriacao) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                cupom.id,
                cupom.nome,
                cupom.valor,
                cupom.tipo,
                cupom.datacriacao || new Date().toISOString()
            ]
        );
        
        return { success: true, id: cupom.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para atualizar um cupom existente
async function updateCupom(id, cupomData) {
    try {
        await executeSql(
            `UPDATE cupons SET 
                nome = ?, 
                valor = ?, 
                tipo = ?
             WHERE id = ?`,
            [
                cupomData.nome,
                cupomData.valor,
                cupomData.tipo,
                id
            ]
        );
        
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir um cupom
async function deleteCupom(id) {
    try {
        await executeSql('DELETE FROM cupons WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir todos os cupons
async function deleteAllCupons() {
    try {
        await executeSql('DELETE FROM cupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getCupons,
    getCupomById,
    createCupom,
    updateCupom,
    deleteCupom,
    deleteAllCupons
}; 