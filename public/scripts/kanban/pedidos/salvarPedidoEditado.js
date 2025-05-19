/**
 * Função para salvar as alterações em um pedido
 * Verifica diferenças de produtos para atualizar o estoque corretamente
 * @param {string} idPedido - ID do pedido sendo editado
 * @param {Object} dados - Objeto contendo os dados do pedido
 */
async function salvarPedidoEditado(idPedido, dados = null) {
    try {
        // Se não recebeu dados como parâmetro, tenta obter do DOM
        if (!dados) {
            // Obter dados do dataset do container do carrinho
            const carrinhoContainer = document.querySelector('.coluna.carrinho');
            if (carrinhoContainer && carrinhoContainer.dataset.pedidoDados) {
                try {
                    dados = JSON.parse(carrinhoContainer.dataset.pedidoDados);
                    console.log('Dados obtidos do DOM:', dados);
                } catch (e) {
                    console.error('Erro ao ler dados do carrinho:', e);
                }
            }
            
            // Se ainda não temos dados, criar objeto vazio
            if (!dados) {
                console.error('Dados não fornecidos para salvarPedidoEditado e não encontrados no DOM');
                alert('Erro ao salvar pedido: dados não encontrados');
                return;
            }
        }
        
        // Verificar se temos produtos no carrinho
        if (!dados.produtosCarrinho || dados.produtosCarrinho.length === 0) {
            alert('Adicione pelo menos um produto ao pedido');
            return;
        }

        // Buscar o pedido original
        const pedidoOriginal = dados.pedidoOriginal;
        
        if (!pedidoOriginal) {
            console.error('Pedido original não encontrado');
            alert('Erro ao processar o pedido. Tente novamente.');
            return;
        }
        
        // Manter o status do pedido original
        const statusPedido = pedidoOriginal.status || 'fila';
        
        // Criar o objeto atualizado do pedido
        const pedidoAtualizado = {
            ...pedidoOriginal,
            produtos: dados.produtosCarrinho,
            cliente: dados.clienteSelecionado || pedidoOriginal.cliente,
            frete: dados.valorFrete.toFixed(2).replace('.', ',') || '0,00',
            desconto: dados.valorDesconto.toFixed(2).replace('.', ',') || '0,00',
            observacao: dados.observacaoPedido || '',
            status: statusPedido
        };
        
        console.log('Salvando pedido com dados:', pedidoAtualizado);
        
        // Calcular o valor total
        const valorTotal = calcularTotalDoPedido(dados);
        pedidoAtualizado.total = valorTotal.toFixed(2).replace('.', ',');
        
        // Comparar produtos para ajustar estoque
        await processarDiferencasEstoque(pedidoOriginal.produtos, dados.produtosCarrinho, idPedido);

        // Salvar pedido atualizado
        const response = await fetch(`/api/pedidos/${idPedido}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoAtualizado)
        });
        
        if (!response.ok) {
            throw new Error(`Erro ao atualizar pedido: ${response.status}`);
        }
        
        // Obter resultado da API
        const resultado = await response.json();
        console.log('Resposta da API:', resultado);
        
        // Fechar o modal
        fecharModalPrincipal();
        
        // Atualizar o kanban
        if (typeof atualizarKanbanPedidos === 'function') {
            atualizarKanbanPedidos();
        } else if (typeof carregarPedidos === 'function') {
            carregarPedidos();
        }
        
        // Limpar dados do pedido
        limparDadosPedido();
        
        // Notificar o usuário
        alert('Pedido atualizado com sucesso!');
        
    } catch (erro) {
        console.error('Erro ao salvar pedido editado:', erro);
        alert(`Erro ao salvar pedido: ${erro.message}`);
    }
}



// Definir a função saidaDoEstoque_LancamentoPedido se não estiver disponível
if (typeof saidaDoEstoque_LancamentoPedido !== 'function') {
    /**
     * Processa a saída de múltiplos produtos do estoque via API
     * @param {Array} produtos - Lista de produtos para dar saída
     * @returns {Promise<Object>} Resultado da operação
     */
    async function saidaDoEstoque_LancamentoPedido(produtos) {
        try {
            // Para cada produto, processar saída de estoque
            for (const produto of produtos) {
                if (!produto || !produto.id || !produto.quantidade) {
                    console.error('Produto inválido para saída de estoque:', produto);
                    continue;
                }
                
                // Registrar no histórico de movimentações
                const movimentacao = {
                    id: gerarId(),
                    tipo: 'saida',
                    produtoId: produto.id,
                    produtoNome: produto.nome || `Produto ID: ${produto.id}`,
                    quantidade: produto.quantidade,
                    motivo: 'Saída para Pedido',
                    observacao: 'Produto utilizado em pedido',
                    data: dataFormatada().data
                };
                
                // Chamar a função para registrar a saída
                await adicionarMovimentacaoAoHistorico(movimentacao);
            }
            
            return { success: true };
        } catch (erro) {
            console.error('Erro ao processar saídas de estoque:', erro);
            return { success: false, error: erro.message };
        }
    }
}

/**
 * Compara os produtos antes e depois da edição e processa as diferenças de estoque
 * @param {Array} produtosAntigos - Lista de produtos do pedido original
 * @param {Array} produtosNovos - Lista de produtos do pedido atualizado
 * @param {string} idPedido - ID do pedido para referência
 */
async function processarDiferencasEstoque(produtosAntigos, produtosNovos, idPedido) {
    // Garantir que os arrays são válidos
    const arrayAntigo = Array.isArray(produtosAntigos) ? produtosAntigos : [];
    const arrayNovo = Array.isArray(produtosNovos) ? produtosNovos : [];
    
    // Criar mapas para facilitar a comparação
    const mapaProdutosAntigos = new Map();
    const mapaProdutosNovos = new Map();
    
    // Preencher o mapa de produtos antigos
    arrayAntigo.forEach(produto => {
        mapaProdutosAntigos.set(produto.id, produto);
    });
    
    // Preencher o mapa de produtos novos
    arrayNovo.forEach(produto => {
        mapaProdutosNovos.set(produto.id, produto);
    });
    
    // Arrays para separar as operações de estoque
    const produtosParaSaida = [];
    const produtosParaEntrada = [];
    
    // Verificar produtos novos ou com quantidades maiores (requerem saída do estoque)
    for (const [id, produtoNovo] of mapaProdutosNovos) {
        const produtoAntigo = mapaProdutosAntigos.get(id);
        
        if (!produtoAntigo) {
            // Produto novo, adicionado ao pedido
            produtosParaSaida.push(produtoNovo);
        } else {
            // Produto existente, verificar diferença de quantidade
            const quantidadeAntiga = parseInt(produtoAntigo.quantidade) || 0;
            const quantidadeNova = parseInt(produtoNovo.quantidade) || 0;
            
            if (quantidadeNova > quantidadeAntiga) {
                // Quantidades aumentaram, dar saída da diferença
                const diferenca = quantidadeNova - quantidadeAntiga;
                produtosParaSaida.push({
                    ...produtoNovo,
                    quantidade: diferenca
                });
            } else if (quantidadeNova < quantidadeAntiga) {
                // Quantidades diminuíram, dar entrada da diferença
                const diferenca = quantidadeAntiga - quantidadeNova;
                produtosParaEntrada.push({
                    ...produtoNovo,
                    quantidade: diferenca
                });
            }
            // Se quantidades iguais, não faz nada
        }
    }
    
    // Verificar produtos removidos do pedido (requerem entrada no estoque)
    for (const [id, produtoAntigo] of mapaProdutosAntigos) {
        if (!mapaProdutosNovos.has(id)) {
            // Produto foi removido do pedido
            produtosParaEntrada.push(produtoAntigo);
        }
    }
    
    // Processar saídas do estoque (produtos adicionados ou com quantidades aumentadas)
    if (produtosParaSaida.length > 0) {
        console.log('Processando saídas de estoque:', produtosParaSaida);
        await saidaDoEstoque_LancamentoPedido(produtosParaSaida);
    }
    
    // Processar entradas no estoque (produtos removidos ou com quantidades diminuídas)
    if (produtosParaEntrada.length > 0) {
        console.log('Processando entradas de estoque:', produtosParaEntrada);
        await processarEntradasNoEstoque(produtosParaEntrada, idPedido);
    }
}

/**
 * Processa entradas no estoque para produtos removidos ou com quantidade reduzida
 * @param {Array} produtos - Lista de produtos para dar entrada no estoque
 * @param {string} idPedido - ID do pedido para referência
 */
async function processarEntradasNoEstoque(produtos, idPedido) {
    try {
        const todosProdutos = await getProdutos();
        
        // Para cada produto, processar entrada no estoque
        for (const produtoADevolver of produtos) {
            const produtoDB = todosProdutos.find(p => p.id === produtoADevolver.id);
            
            if (produtoDB) {
                // Atualizar estoque no banco de dados
                const novoEstoque = (parseInt(produtoDB.estoque) || 0) + (parseInt(produtoADevolver.quantidade) || 0);
                produtoDB.estoque = novoEstoque;
                
                // Salvar produto com estoque atualizado
                await salvaProdutoNaPlanilha(produtoDB);
                
                // Registrar no histórico de movimentações
                const movimentacao = {
                    id: gerarId(),
                    tipo: 'entrada',
                    produtoId: produtoADevolver.id,
                    produtoNome: produtoADevolver.nome || produtoDB.nome,
                    quantidade: produtoADevolver.quantidade,
                    motivo: 'extorno vindo de pedido',
                    observacao: `Estorno de produto ao editar pedido #${idPedido}`,
                    data: dataFormatada().data
                };
                
                adicionarMovimentacaoAoHistorico(movimentacao);
            }
        }
    } catch (erro) {
        console.error('Erro ao processar entradas no estoque:', erro);
    }
}

/**
 * Calcula o valor total do pedido considerando produtos, frete e desconto
 * @param {Object} dados - Objeto contendo os dados do pedido
 * @returns {number} Valor total do pedido
 */
function calcularTotalDoPedido(dados) {
    let subtotal = 0;
    
    // Verificar se dados foi fornecido
    if (!dados) {
        console.error('Dados não fornecidos para calcularTotalDoPedido');
        return 0;
    }
    
    // Somar valor dos produtos
    if (dados.produtosCarrinho && dados.produtosCarrinho.length > 0) {
        subtotal = dados.produtosCarrinho.reduce((total, produto) => {
            const preco = typeof produto.preco === 'string' ? 
                parseFloat(produto.preco.replace('R$', '').replace(',', '.')) : 
                (parseFloat(produto.preco) || 0);
            const quantidade = parseInt(produto.quantidade) || 1;
            return total + (preco * quantidade);
        }, 0);
    }
    
    // Adicionar frete e subtrair desconto
    const total = subtotal + (dados.valorFrete || 0) - (dados.valorDesconto || 0);
    return Math.max(0, total); // Garantir que o total não seja negativo
}

/**
 * Limpa os dados do pedido após salvamento
 * @returns {Object} Objeto de dados limpo
 */
function limparDadosPedido() {
    // Limpar dataset do container do carrinho
    const carrinhoContainer = document.querySelector('.coluna.carrinho');
    if (carrinhoContainer) {
        delete carrinhoContainer.dataset.pedidoDados;
    }
    
    // Retornar objeto de dados limpo (para possível uso futuro)
    return {
        produtosCarrinho: [],
        valorFrete: 0,
        valorDesconto: 0,
        clienteSelecionado: null,
        observacaoPedido: '',
        pedidoOriginal: null,
        modoEdicaoPedido: false
    };
}

