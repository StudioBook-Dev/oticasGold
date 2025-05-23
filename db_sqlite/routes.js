const express = require('express');
const router = express.Router();

// Importar modelos
const pedidosModel = require('./pedidosModel');
const produtosModel = require('./produtosModel');
const clientesModel = require('./clientesModel');
const categoriasModel = require('./categoriasModel');
const cuponsModel = require('./cuponsModel');
const estoqueModel = require('./estoqueModel');
const financeiroModel = require('./financeiroModel');

// Rotas para pedidos
router.get('/pedidos', async (req, res) => {
    const pedidos = await pedidosModel.getPedidos();
    res.json(pedidos);
});

router.get('/pedidos/:id', async (req, res) => {
    const pedido = await pedidosModel.getPedidoById(req.params.id);
    if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    res.json(pedido);
});


router.post('/pedidos', async (req, res) => {
    try {
        // Verificar se o corpo da requisição contém os campos obrigatórios
        const { id, cliente, produtos, total, status } = req.body;

        if (!id || !cliente || !produtos || !total || !status) {
            return res.status(400).json({
                success: false,
                error: 'Erro: Campos obrigatórios faltando. Verifique id, cliente, produtos, total e status.'
            });
        }

        const result = await pedidosModel.createPedido(req.body);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        res.status(201).json({ id: result.id });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Erro interno ao processar pedido: ${error.message}`
        });
    }
});

router.put('/pedidos/:id', async (req, res) => {
    const result = await pedidosModel.updatePedido(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.patch('/pedidos/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const result = await pedidosModel.updatePedidoStatus(req.params.id, status);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id, status });
});

router.delete('/pedidos/:id', async (req, res) => {
    const result = await pedidosModel.deletePedido(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

// Rotas para produtos
router.get('/produtos', async (req, res) => {
    const produtos = await produtosModel.getProdutos();
    res.json(produtos);
});

router.get('/produtos/:id', async (req, res) => {
    const produto = await produtosModel.getProdutoById(req.params.id);
    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
});

router.post('/produtos', async (req, res) => {
    const result = await produtosModel.createProduto(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/produtos/:id', async (req, res) => {
    const result = await produtosModel.updateProduto(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});


router.delete('/produtos/:id', async (req, res) => {
    const result = await produtosModel.deleteProduto(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

// Rotas para clientes
router.get('/clientes', async (req, res) => {
    const clientes = await clientesModel.getClientes();
    res.json(clientes);
});

router.get('/clientes/:id', async (req, res) => {
    const cliente = await clientesModel.getClienteById(req.params.id);
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    res.json(cliente);
});

router.post('/clientes', async (req, res) => {
    const result = await clientesModel.createCliente(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/clientes/:id', async (req, res) => {
    const result = await clientesModel.updateCliente(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.delete('/clientes/:id', async (req, res) => {
    const result = await clientesModel.deleteCliente(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

// Rotas para categorias
router.get('/categorias', async (req, res) => {
    const categorias = await categoriasModel.getCategorias();
    res.json(categorias);
});

router.get('/categorias/:id', async (req, res) => {
    const categoria = await categoriasModel.getCategoriaById(req.params.id);
    if (!categoria) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    res.json(categoria);
});

router.post('/categorias', async (req, res) => {
    const result = await categoriasModel.createCategoria(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/categorias/:id', async (req, res) => {
    const result = await categoriasModel.updateCategoria(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.delete('/categorias/:id', async (req, res) => {
    const result = await categoriasModel.deleteCategoria(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

// Rotas para cupons
router.get('/cupons', async (req, res) => {
    const cupons = await cuponsModel.getCupons();
    res.json(cupons);
});

router.get('/cupons/:id', async (req, res) => {
    const cupom = await cuponsModel.getCupomById(req.params.id);
    if (!cupom) {
        return res.status(404).json({ error: 'Cupom não encontrado' });
    }
    res.json(cupom);
});

router.post('/cupons', async (req, res) => {
    const result = await cuponsModel.createCupom(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/cupons/:id', async (req, res) => {
    const result = await cuponsModel.updateCupom(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.delete('/cupons/:id', async (req, res) => {
    const result = await cuponsModel.deleteCupom(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});


// Rotas para estoque
router.get('/estoque/movimentacoes', async (req, res) => {
    try {
        const { tipo, produtoId, produtoNome, dataInicial, dataFinal } = req.query;
        const filtros = {};

        // Adicionar filtros se existirem
        if (tipo) filtros.tipo = tipo;
        if (produtoId) filtros.produtoId = produtoId;
        if (produtoNome) filtros.produtoNome = produtoNome;
        if (dataInicial) filtros.dataInicial = dataInicial;
        if (dataFinal) filtros.dataFinal = dataFinal;

        // Se houver filtros, buscar com filtros, senão buscar tudo
        const historico = Object.keys(filtros).length > 0
            ? await estoqueModel.getHistoricoEstoqueFiltrado(filtros)
            : await estoqueModel.getHistoricoEstoque();

        res.json(historico);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar histórico de estoque' });
    }
});

router.post('/estoque/movimentacao', async (req, res) => {
    try {
        // Obter os dados da movimentação diretamente do corpo da requisição
        const movimentacao = req.body;

        // Validar campos obrigatórios
        if (!movimentacao.tipo || !movimentacao.produtoId || !movimentacao.quantidade || !movimentacao.id || !movimentacao.data) {
            return res.status(400).json({
                error: 'Campos obrigatórios não informados',
                requiredFields: ['tipo', 'produtoId', 'quantidade', 'id', 'data']
            });
        }

        // Validar tipo
        if (movimentacao.tipo !== 'entrada' && movimentacao.tipo !== 'saida') {
            return res.status(400).json({
                error: 'Tipo de movimentação inválido',
                allowedValues: ['entrada', 'saida']
            });
        }

        // Chamar a função do modelo para processar a movimentação
        const result = await estoqueModel.adicionarMovimentacaoEstoque(movimentacao);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar movimentação de estoque' });
    }
});

router.post('/produtos/atualizarEstoque', async (req, res) => {
    try {
        const { produtoId, valorAjuste } = req.body;

        // Validar campos obrigatórios
        if (!produtoId || valorAjuste === undefined) {
            return res.status(400).json({
                error: 'Campos obrigatórios não informados',
                requiredFields: ['produtoId', 'valorAjuste']
            });
        }

        const result = await estoqueModel.atualizarEstoqueProduto(
            produtoId,
            parseFloat(valorAjuste)
        );

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estoque' });
    }
});

// Rota para atualizar diretamente o estoque do produto sem registrar movimentação
router.post('/produtos/atualizarEstoqueDireto', async (req, res) => {
    try {
        const { produtoId, novoEstoque } = req.body;

        // Validar campos obrigatórios
        if (!produtoId || novoEstoque === undefined) {
            return res.status(400).json({
                error: 'Campos obrigatórios não informados',
                requiredFields: ['produtoId', 'novoEstoque']
            });
        }

        const result = await estoqueModel.atualizarEstoqueProdutoInterno(
            produtoId,
            parseFloat(novoEstoque)
        );

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estoque diretamente' });
    }
});

// Rotas para excluir todos os itens
router.delete('/excluir-todos/:tabela', async (req, res) => {
    const { tabela } = req.params;
    let result = { success: false, error: 'Tabela não reconhecida' };

    try {
        switch (tabela) {
            case 'produtos':
                result = await produtosModel.deleteAllProdutos();
                break;
            case 'clientes':
                result = await clientesModel.deleteAllClientes();
                break;
            case 'categorias':
                result = await categoriasModel.deleteAllCategorias();
                break;
            case 'cupons':
                result = await cuponsModel.deleteAllCupons();
                break;
            case 'pedidos':
                result = await pedidosModel.deleteAllPedidos();
                break;
            case 'estoque':
                result = await estoqueModel.deleteAllEstoque();
                break;
            case 'transacoesFinanceiras':
                result = await financeiroModel.deleteAllTransacoesFinanceiras();
                break;
            default:
                return res.status(400).json({ success: false, mensagem: `Tabela '${tabela}' não reconhecida` });
        }

        if (!result.success) {
            return res.status(400).json({ success: false, mensagem: result.error });
        }

        res.json({ success: true, mensagem: `Todos os itens da tabela ${tabela} foram excluídos com sucesso` });
    } catch (error) {
        res.status(500).json({ success: false, mensagem: `Erro ao excluir itens: ${error.message}` });
    }
});

// Rotas para categorias financeiras
router.get('/financeiro/categorias', async (req, res) => {
    const categorias = await financeiroModel.getCategoriasFinanceiras();
    res.json(categorias);
});

router.get('/financeiro/categorias/:id', async (req, res) => {
    const categoria = await financeiroModel.getCategoriaFinanceiraById(req.params.id);
    if (!categoria) {
        return res.status(404).json({ error: 'Categoria financeira não encontrada' });
    }
    res.json(categoria);
});

router.post('/financeiro/categorias', async (req, res) => {
    const result = await financeiroModel.createCategoriaFinanceira(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/financeiro/categorias/:id', async (req, res) => {
    const result = await financeiroModel.updateCategoriaFinanceira(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.delete('/financeiro/categorias/:id', async (req, res) => {
    const result = await financeiroModel.deleteCategoriaFinanceira(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

// Rota de teste para verificar a tabela de categorias financeiras
router.get('/financeiro/teste', async (req, res) => {
    try {
        const db = require('./database');
        const result = await db.getAll("SELECT name FROM sqlite_master WHERE type='table' AND name='categoriasFinanceiras'");

        if (result.length === 0) {
            return res.json({ existe: false, mensagem: 'Tabela categoriasFinanceiras não existe' });
        }

        const dados = await db.getAll("SELECT * FROM categoriasFinanceiras");

        return res.json({
            existe: true,
            registros: dados.length,
            dados: dados
        });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Rotas para transações financeiras
router.get('/financeiro/transacoes', async (req, res) => {
    const transacoes = await financeiroModel.getTransacoesFinanceiras();
    res.json(transacoes);
});

router.get('/financeiro/transacoes/:id', async (req, res) => {
    const transacao = await financeiroModel.getTransacaoFinanceiraById(req.params.id);
    if (!transacao) {
        return res.status(404).json({ error: 'Transação financeira não encontrada' });
    }
    res.json(transacao);
});

router.post('/financeiro/transacoes', async (req, res) => {
    const result = await financeiroModel.createTransacaoFinanceira(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.status(201).json({ id: result.id });
});

router.put('/financeiro/transacoes/:id', async (req, res) => {
    const result = await financeiroModel.updateTransacaoFinanceira(req.params.id, req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

router.delete('/financeiro/transacoes/:id', async (req, res) => {
    const result = await financeiroModel.deleteTransacaoFinanceira(req.params.id);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    res.json({ id: result.id });
});

module.exports = router; 