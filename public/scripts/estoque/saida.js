/**
 * Abre o modal de saída de estoque para um produto específico
 */
async function abrirModalSaidaEstoqueProduto(id) {
    const produto = await getProduto(id);
    abrirModalSecundario({
        titulo: `Produto ${produto.nome} - Saída`,
        conteudo: `
            <div class="form-estoque">
                <div class="form-grupo">
                    <label>Produto: ${produto.nome}</label>
                </div>
                <div class="form-grupo">
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" class="campo-formulario" min="1" step="1" value="1">
                </div>
                <div class="form-grupo">
                    <label for="observacao">Observação:</label>
                    <textarea id="observacao" class="campo-formulario" rows="3"></textarea>
                </div>
                <div class="form-acoes">
                    <button id="btn-confirmar-saida" class="botao-formulario" 
                    onclick="registrarSaidaEstoqueManualmente('${produto.id}')">
                        Confirmar Saída
                    </button>
                </div>
            </div>
        `
    });
}

/**
 * Registra a saída de estoque para um produto
 */
async function registrarSaidaEstoqueManualmente(id) {
    // Obter os valores dos campos
    const quantidadeInput = document.getElementById('quantidade');
    const observacaoInput = document.getElementById('observacao');
    
    // Validar a quantidade
    if (!quantidadeInput || !quantidadeInput.value || isNaN(parseFloat(quantidadeInput.value)) || parseFloat(quantidadeInput.value) <= 0) {
        alert('Por favor, informe uma quantidade válida maior que zero.');
        return;
    }
    
    const quantidade = parseFloat(quantidadeInput.value);
    const observacao = observacaoInput ? observacaoInput.value : '';
    
    try {
        // Buscar dados do produto
        const produto = await getProduto(id);
        if (!produto) {
            alert('Produto não encontrado.');
            return;
        }
        
        // Verificar estoque disponível
        if (quantidade > produto.estoque) {
            alert(`Estoque insuficiente. Disponível: ${produto.estoque}`);
            return;
        }
        
        // Criar objeto com os dados da movimentação
        const movimentacao = {
            id: gerarId(),
            tipo: 'saida',
            produtoId: id,
            produtoNome: produto.nome,
            quantidade: quantidade,
            motivo: 'Saída Manual',
            observacao: observacao,
            data: dataFormatada().data
        };
        
        // Registrar a movimentação no banco de dados
        await adicionarMovimentacaoAoHistorico(movimentacao);
        fecharModalSecundario();
        abrirModalEstoque();
    } catch (error) {
        alert(`Erro ao registrar saída: ${error.message}`);
    }
}



