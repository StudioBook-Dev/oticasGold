const { executeSql, getOne, getAll } = require('./database');

// Função para obter todos os clientes
async function getClientes() {
    try {
        // Primeiro, excluir clientes sem ID
        await executeSql('DELETE FROM clientes WHERE id IS NULL');
        
        // Depois buscar clientes
        return await getAll('SELECT * FROM clientes');
    } catch (error) {
        return [];
    }
}

// Função para obter um cliente específico pelo ID
async function getClienteById(id) {
    try {
        return await getOne('SELECT * FROM clientes WHERE id = ?', [id]);
    } catch (error) {
        return null;
    }
}

// Função para criar um novo cliente
async function createCliente(cliente) {
    try {
        // Gerar ID único se não for fornecido
        if (!cliente.id) {
            // Obter o maior ID atual e incrementar
            const maxIdResult = await getOne('SELECT MAX(id) as maxId FROM clientes');
            const maxId = maxIdResult && maxIdResult.maxId ? parseInt(maxIdResult.maxId) : 0;
            cliente.id = (maxId + 1).toString();
        }
        
        const result = await executeSql(
            `INSERT INTO clientes (id, nome, telefone, enderecoCompleto, estado, cidade, rua, casa, cep, datanascimento, email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cliente.id,
                cliente.nome,
                cliente.telefone,
                cliente.enderecoCompleto,
                cliente.estado,
                cliente.cidade,
                cliente.rua,
                cliente.casa,
                cliente.cep,
                cliente.datanascimento,
                cliente.email
            ]
        );
        
        return { success: true, id: cliente.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para atualizar um cliente existente
async function updateCliente(id, clienteData) {
    try {
        await executeSql(
            `UPDATE clientes SET 
                nome = ?, 
                telefone = ?, 
                enderecoCompleto = ?, 
                estado = ?, 
                cidade = ?, 
                rua = ?, 
                casa = ?, 
                cep = ?, 
                datanascimento = ?, 
                email = ? 
             WHERE id = ?`,
            [
                clienteData.nome,
                clienteData.telefone,
                clienteData.enderecoCompleto,
                clienteData.estado,
                clienteData.cidade,
                clienteData.rua,
                clienteData.casa,
                clienteData.cep,
                clienteData.datanascimento,
                clienteData.email,
                id
            ]
        );
        
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir um cliente
async function deleteCliente(id) {
    try {
        await executeSql('DELETE FROM clientes WHERE id = ?', [id]);
        return { success: true, id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para excluir todos os clientes
async function deleteAllClientes() {
    try {
        await executeSql('DELETE FROM clientes');
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    deleteAllClientes
}; 