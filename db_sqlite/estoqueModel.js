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
            SELECT * FROM movimentacoes 
            ORDER BY dataHora DESC
        `);

        // Converter as strings JSON de volta para objetos se necessário
        return movimentacoes.map(mov => ({
            id: mov.id,
            data: mov.dataHora,
            produtoId: mov.idProduto,
            produtoNome: mov.produtoNome,
            quantidade: mov.quantidade,
            tipo: mov.tipo,
            motivo: mov.motivo,
            observacao: mov.observacao
        }));
    } catch (error) {
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
        let sql = 'SELECT * FROM movimentacoes WHERE 1=1';
        const params = [];

        if (filtros.tipo) {
            sql += ' AND tipo = ?';
            params.push(filtros.tipo);
        }

        if (filtros.produtoId) {
            sql += ' AND idProduto = ?';
            params.push(filtros.produtoId);
        }

        if (filtros.produtoNome) {
            sql += ' AND produtoNome LIKE ?';
            params.push(`%${filtros.produtoNome}%`);
        }

        if (filtros.dataInicial) {
            sql += ' AND dataHora >= ?';
            params.push(filtros.dataInicial);
        }

        if (filtros.dataFinal) {
            sql += ' AND dataHora <= ?';
            params.push(filtros.dataFinal);
        }

        sql += ' ORDER BY dataHora DESC';

        const movimentacoes = await getAll(sql, params);

        return movimentacoes.map(mov => ({
            id: mov.id,
            data: mov.dataHora,
            produtoId: mov.idProduto,
            produtoNome: mov.produtoNome,
            quantidade: mov.quantidade,
            tipo: mov.tipo,
            motivo: mov.motivo,
            observacao: mov.observacao
        }));
    } catch (error) {
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

        return {
            success: true,
            id: movimentacao.id,
            produtoNome: movimentacao.produtoNome,
            quantidade: movimentacao.quantidade,
            tipo: movimentacao.tipo,
            novoEstoque: novoEstoque
        };
    } catch (error) {
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
        // Buscar produto atual
        const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [produtoId]);
        if (!produto) {
            return { success: false, error: 'Produto não encontrado' };
        }

        // Calcular novo estoque
        const estoqueAtual = parseFloat(produto.estoque) || 0;
        const novoEstoque = estoqueAtual + valorAjuste;

        // Validar se o estoque não ficará negativo
        if (novoEstoque < 0) {
            return {
                success: false,
                error: `Estoque insuficiente. Estoque atual: ${estoqueAtual}, tentativa de ajuste: ${valorAjuste}`
            };
        }

        // Atualizar o estoque na tabela produtos
        await executeSql(
            'UPDATE produtos SET estoque = ? WHERE id = ?',
            [novoEstoque, produtoId]
        );

        return {
            success: true,
            produtoId: produtoId,
            estoqueAnterior: estoqueAtual,
            valorAjuste: valorAjuste,
            novoEstoque: novoEstoque
        };
    } catch (error) {
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
        // Buscar produto atual
        const produto = await getOne('SELECT * FROM produtos WHERE id = ?', [produtoId]);
        if (!produto) {
            return { success: false, error: 'Produto não encontrado' };
        }

        // Validar se o novo estoque não é negativo
        if (novoEstoque < 0) {
            return {
                success: false,
                error: `Estoque não pode ser negativo. Valor informado: ${novoEstoque}`
            };
        }

        // Atualizar o estoque na tabela produtos
        await executeSql(
            'UPDATE produtos SET estoque = ? WHERE id = ?',
            [novoEstoque, produtoId]
        );

        return {
            success: true,
            produtoId: produtoId,
            estoqueAnterior: parseFloat(produto.estoque) || 0,
            novoEstoque: novoEstoque
        };
    } catch (error) {
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

/**
 * Limpa o cache das transações de estoque
 */
function limparCacheEstoque() {
    cacheTransacoesEstoque = [];
}

// Função para excluir todo o estoque
async function deleteAllEstoque() {
    try {
        // Limpar tabela de movimentações
        await executeSql('DELETE FROM movimentacoes');

        // Zerar estoque de todos os produtos
        await executeSql('UPDATE produtos SET estoque = 0');

        // Limpar cache
        limparCacheEstoque();

        return { success: true };
    } catch (error) {
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