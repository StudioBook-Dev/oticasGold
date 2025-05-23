const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const pdf2pic = require('pdf2pic');

// Função simplificada para salvar arquivo sem conversão
async function salvarArquivo(arquivoOriginal, nomeDestino, caminhoDestino) {
    const caminhoCompleto = path.join(caminhoDestino, nomeDestino);

    try {
        // Simplesmente salvar o arquivo como foi recebido
        fs.writeFileSync(caminhoCompleto, arquivoOriginal.buffer);
        return caminhoCompleto;

    } catch (error) {
        console.error('Erro ao salvar arquivo:', error);
        throw error;
    }
}

// Função para converter arquivo para JPG
async function converterParaJPG(arquivoOriginal, nomeDestino, caminhoDestino) {
    const extensaoOriginal = path.extname(arquivoOriginal.originalname).toLowerCase();
    const caminhoCompleto = path.join(caminhoDestino, nomeDestino);

    try {
        if (extensaoOriginal === '.pdf') {
            try {
                // Converter PDF para JPG (primeira página)
                const convertOptions = {
                    density: 100,
                    saveFilename: path.basename(nomeDestino, '.jpg'),
                    savePath: caminhoDestino,
                    format: "jpg",
                    width: 800,
                    height: 1200
                };

                const convert = pdf2pic.fromBuffer(arquivoOriginal.buffer, convertOptions);
                const result = await convert(1);

                if (result && result.path && fs.existsSync(result.path)) {
                    fs.renameSync(result.path, caminhoCompleto);
                    return caminhoCompleto;
                } else {
                    throw new Error('Falha na conversão do PDF');
                }
            } catch (pdfError) {
                console.log('Erro na conversão de PDF, criando fallback:', pdfError.message);
                // Fallback: criar imagem com informação do arquivo
                const svgFallback = `
                    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100%" height="100%" fill="white"/>
                        <text x="50%" y="45%" text-anchor="middle" font-family="Arial" font-size="20" fill="red">
                            Erro na conversão do PDF
                        </text>
                        <text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="16" fill="black">
                            ${path.basename(arquivoOriginal.originalname)}
                        </text>
                    </svg>`;

                await sharp(Buffer.from(svgFallback))
                    .jpeg({ quality: 80 })
                    .toFile(caminhoCompleto);

                return caminhoCompleto;
            }

        } else if (['.doc', '.docx'].includes(extensaoOriginal)) {
            // Para documentos Word, criar uma imagem placeholder
            const svgImage = `
                <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>
                    <text x="50%" y="45%" text-anchor="middle" font-family="Arial" font-size="20" fill="blue">
                        Documento Word
                    </text>
                    <text x="50%" y="55%" text-anchor="middle" font-family="Arial" font-size="16" fill="black">
                        ${path.basename(arquivoOriginal.originalname)}
                    </text>
                    <text x="50%" y="65%" text-anchor="middle" font-family="Arial" font-size="12" fill="gray">
                        Visualização não disponível
                    </text>
                </svg>`;

            await sharp(Buffer.from(svgImage))
                .jpeg({ quality: 80 })
                .toFile(caminhoCompleto);

            return caminhoCompleto;

        } else {
            // Para imagens, usar sharp para converter diretamente
            await sharp(arquivoOriginal.buffer)
                .jpeg({ quality: 80 })
                .resize(1200, 1600, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .toFile(caminhoCompleto);

            return caminhoCompleto;
        }

    } catch (error) {
        console.error('Erro geral na conversão:', error);

        // Fallback final: criar arquivo de erro
        try {
            const errorSvg = `
                <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#ffebee"/>
                    <text x="50%" y="40%" text-anchor="middle" font-family="Arial" font-size="24" fill="red">
                        Erro na Conversão
                    </text>
                    <text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="16" fill="black">
                        ${path.basename(arquivoOriginal.originalname)}
                    </text>
                    <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="gray">
                        ${error.message}
                    </text>
                </svg>`;

            await sharp(Buffer.from(errorSvg))
                .jpeg({ quality: 80 })
                .toFile(caminhoCompleto);

            return caminhoCompleto;
        } catch (fallbackError) {
            console.error('Erro no fallback:', fallbackError);
            throw new Error('Não foi possível processar o arquivo');
        }
    }
}

// Configurar multer para armazenar arquivo em memória
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Verificar tipos de arquivo permitidos
        const allowedTypes = /\.(pdf|doc|docx|jpg|jpeg|png|gif|bmp)$/i;
        if (!allowedTypes.test(file.originalname)) {
            return cb(new Error('Tipo de arquivo não permitido'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // Limite de 10MB
    }
});

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

// Rota para upload de receitas
router.post('/upload-receita', upload.single('arquivo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo foi enviado'
            });
        }

        const { clienteId, novoNome } = req.body;

        // Definir caminho de destino
        const uploadPath = path.join(__dirname, 'receitas');

        // Criar diretório se não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Salvar arquivo com o nome do ID (sem conversão)
        const caminhoArquivoFinal = await salvarArquivo(req.file, novoNome, uploadPath);

        res.json({
            success: true,
            message: 'Receita salva com sucesso',
            arquivo: {
                nomeOriginal: req.file.originalname,
                nomeArquivoFinal: novoNome,
                tamanhoOriginal: req.file.size,
                clienteId: clienteId,
                caminhoFinal: caminhoArquivoFinal,
                formatoOriginal: path.extname(req.file.originalname)
            }
        });

    } catch (error) {
        console.error('Erro no upload da receita:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno no servidor ao fazer upload da receita: ' + error.message
        });
    }
});

module.exports = router; 