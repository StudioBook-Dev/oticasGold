/**
 * Funções para manipulação do banco de dados SQLite para o módulo de estoque
 */
const { executeSql, getOne, getAll } = require('./database');

// Cache de IDs de transações processadas recentemente para evitar duplicação
const transacoesRecentes = new Set();
// Registro de transações que já foram completamente processadas
const transacoesCompletadas = new Map();

// Timer para limpar transações antigas periodicamente
setInterval(() => {
    transacoesRecentes.clear();
    transacoesCompletadas.clear();
    // console.log('Cache de transações do estoque limpo');
}, 30 * 60 * 1000); // Limpa a cada 30 minutos

/**
 * Obtém todo o histórico de movimentações de estoque
 * @returns {Promise<Array>} Array com todas as movimentações
 */
async function getHistoricoEstoque() {
    try {
        const movimentacoes = await getAll(`
            SELECT m.*, p.nome as produtoNome
            FROM movimentacoes m
            LEFT JOIN produtos p ON m.idProduto = p.id
            ORDER BY m.dataHora DESC
        `);
        
        return movimentacoes.map(formatarMovimentacao);
    } catch (error) {
        // console.error('Erro ao buscar histórico de estoque:', error);
        return [];
    }
}

/**
 * Obtém o histórico de estoque filtrado
 * @param {Object} filtros - Filtros a serem aplicados
 * @returns {Promise<Array>} Array com as movimentações filtradas
 */
async function getHistoricoEstoqueFiltrado(filtros) {
    try {
        let sql = `
            SELECT m.*, p.nome as produtoNome
            FROM movimentacoes m
            LEFT JOIN produtos p ON m.idProduto = p.id
            WHERE 1=1
        `;
        
        const params = [];
        
        // Filtrar por tipo de transação (entrada/saída)
        if (filtros.tipo && filtros.tipo !== 'todos') {
            sql += ` AND m.tipo = ?`;
            params.push(filtros.tipo);
        }
        
        // Filtrar por ID do produto
        if (filtros.produtoId) {
            sql += ` AND m.idProduto = ?`;
            params.push(filtros.produtoId);
        }
        
        // Filtrar por nome do produto
        if (filtros.produtoNome) {
            sql += ` AND p.nome LIKE ?`;
            params.push(`%${filtros.produtoNome}%`);
        }
        
        // Filtrar por data inicial
        if (filtros.dataInicial) {
            sql += ` AND m.dataHora >= ?`;
            params.push(filtros.dataInicial);
        }
        
        // Filtrar por data final
        if (filtros.dataFinal) {
            sql += ` AND m.dataHora <= ?`;
            params.push(filtros.dataFinal);
        }
        
        sql += ` ORDER BY m.dataHora DESC`;
        
        const movimentacoes = await getAll(sql, params);
        return movimentacoes.map(formatarMovimentacao);
    } catch (error) {
        // console.error('Erro ao buscar histórico filtrado:', error);
        return [];
    }
}

/**
 * Adiciona uma movimentação ao histórico de estoque
 * @param {Object} movimentacao - Dados da movimentação
 * @returns {Promise<Object>} Resultado da operação
 */
async function adicionarMovimentacaoEstoque(movimentacao) {
    try {
        // Debug para entender o que está vindo
        // console.log('Recebendo movimentacao:', JSON.stringify(movimentacao));
        
        // Verificar se o estoque ficaria negativo em caso de saída
        if (movimentacao.tipo === 'saida') {
            const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [movimentacao.produtoId]);
            if (!produto) {
                return { success: false, error: 'Produto não encontrado' };
            }
            
            if (produto.estoque < parseFloat(movimentacao.quantidade)) {
                return { success: false, error: 'Estoque insuficiente para realizar esta saída' };
            }
        }
        
        // Inserir na tabela movimentacoes
        await executeSql(
            `INSERT INTO movimentacoes (id, dataHora, quantidade, idProduto, produtoNome, tipo, motivo, observacao) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                movimentacao.id,
                movimentacao.data, // campo 'data' do objeto mapeia para 'dataHora' da tabela
                parseFloat(movimentacao.quantidade),
                movimentacao.produtoId,
                movimentacao.produtoNome,
                movimentacao.tipo,
                movimentacao.motivo || '',
                movimentacao.observacao || ''
            ]
        );
        
        // Atualizar o estoque do produto automaticamente
        const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [movimentacao.produtoId]);
        if (produto) {
            let novoEstoque = produto.estoque;
            
            if (movimentacao.tipo === 'entrada') {
                novoEstoque += parseFloat(movimentacao.quantidade);
            } else if (movimentacao.tipo === 'saida') {
                novoEstoque -= parseFloat(movimentacao.quantidade);
            }
            
            // Atualizar o estoque do produto
            await executeSql('UPDATE produtos SET estoque = ? WHERE id = ?', [novoEstoque, movimentacao.produtoId]);
        }
        
        return { success: true, id: movimentacao.id };
    } catch (error) {
        // console.error('[SERVER] Erro ao adicionar movimentação:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Atualiza a quantidade de um produto no estoque
 * @param {string} produtoId - ID do produto
 * @param {number} valorAjuste - Valor a ser ajustado (positivo ou negativo)
 * @returns {Promise<Object>} Resultado da operação
 */
async function atualizarEstoqueProduto(produtoId, valorAjuste) {
    try {
        // Obter o produto
        const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [produtoId]);
        if (!produto) {
            return { success: false, error: 'Produto não encontrado' };
        }
        
        const estoqueAnterior = produto.estoque;
        const novoEstoque = estoqueAnterior + parseFloat(valorAjuste);
        
        // Verificar se o novo estoque ficaria negativo
        if (novoEstoque < 0) {
            return { success: false, error: 'Estoque não pode ficar negativo' };
        }
        
        // Atualizar o estoque do produto
        await executeSql('UPDATE produtos SET estoque = ? WHERE id = ?', [novoEstoque, produtoId]);
        
        // Gerar ID para o log
        const id = Date.now().toString();
        
        // Determinar o tipo de transação e tipo de movimento
        const tipo = valorAjuste > 0 ? 'entrada' : 'saida';
        const motivo = tipo === 'saida' ? 'saida_manual' : 'ajuste';
        const observacao = tipo === 'saida' ? 'Saída manual de estoque' : 'Ajuste de estoque via API';
        
        // Registrar na tabela de movimentações
        await executeSql(
            `INSERT INTO movimentacoes (id, dataHora, quantidade, idProduto, produtoNome, tipo, motivo, observacao) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                new Date().toISOString(),
                Math.abs(valorAjuste),
                produtoId,
                produto.nome,
                tipo,
                motivo,
                observacao
            ]
        );
        
        return { 
            success: true, 
            produtoId, 
            estoqueAnterior,
            valorAjuste,
            novoEstoque
        };
    } catch (error) {
        // console.error('Erro ao atualizar estoque do produto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Função auxiliar interna para atualizar apenas o estoque do produto sem registrar movimentação
 * @param {string} produtoId - ID do produto
 * @param {number} novoEstoque - Novo valor de estoque
 * @returns {Promise<Object>} Resultado da operação
 */
async function atualizarEstoqueProdutoInterno(produtoId, novoEstoque) {
    try {
        // Obter o produto para verificar se existe
        const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [produtoId]);
        if (!produto) {
            return { success: false, error: 'Produto não encontrado' };
        }
        
        // Verificar se o novo estoque é válido
        if (novoEstoque < 0) {
            return { success: false, error: 'Estoque não pode ficar negativo' };
        }
        
        // Atualizar o estoque do produto
        await executeSql('UPDATE produtos SET estoque = ? WHERE id = ?', [novoEstoque, produtoId]);
        
        return { 
            success: true, 
            produtoId, 
            estoqueAnterior: produto.estoque,
            novoEstoque
        };
    } catch (error) {
        // console.error('Erro ao atualizar estoque do produto:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Função auxiliar para formatar uma movimentação para o formato esperado pelo frontend
 * @param {Object} movimentacao - Dados da movimentação do banco
 * @returns {Object} Dados formatados
 */
function formatarMovimentacao(movimentacao) {
    return {
        id: movimentacao.id,
        tipo: movimentacao.tipo,
        produtoId: movimentacao.idProduto,
        produtoNome: movimentacao.produtoNome || `Produto ID: ${movimentacao.idProduto}`,
        quantidade: movimentacao.quantidade,
        motivo: movimentacao.motivo,
        observacao: movimentacao.observacao,
        data: movimentacao.dataHora
    };
}

/**
 * Limpa todo o histórico de estoque (apenas para fins administrativos)
 * @returns {Promise<Object>} Resultado da operação
 */
async function limparHistorico() {
    try {
        await executeSql('DELETE FROM movimentacoes');
        return { success: true };
    } catch (error) {
        // console.error('Erro ao limpar histórico de estoque:', error);
        return { success: false, error: error.message };
    }
}

// Função para excluir todo o estoque
async function deleteAllEstoque() {
    try {
        await executeSql('DELETE FROM movimentacoes');
        return { success: true };
    } catch (error) {
        // console.error('Erro ao excluir todo o estoque:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    getHistoricoEstoque,
    getHistoricoEstoqueFiltrado,
    adicionarMovimentacaoEstoque,
    atualizarEstoqueProduto,
    atualizarEstoqueProdutoInterno,
    limparHistorico,
    deleteAllEstoque
}; 