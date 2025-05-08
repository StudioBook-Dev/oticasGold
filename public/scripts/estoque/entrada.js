
/**
 * Abre o modal de entrada de estoque para um produto específico
 */
async function abrirModalEntradaEstoqueProduto(id) {
    const produto = await getProduto(id);
    abrirModalSecundario({
        titulo: `Produto ${produto.nome} - Entrada`,
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
                    <button id="btn-confirmar-entrada" class="botao-formulario" 
                    onclick="registrarEntradaEstoqueManualmente('${produto.id}')">
                        Confirmar Entrada
                    </button>
                </div>
            </div>
        `
    });
}

/**
 * Registra a entrada de estoque para um produto
 */
async function registrarEntradaEstoqueManualmente (id) {  
    const quantidade = parseFloat(document.getElementById('quantidade').value);
    const observacao = document.getElementById('observacao').value;
    const produto = await getProduto(id);
    // Criar objeto com os dados da movimentação
    const movimentacao = {
        id: gerarId(),
        tipo: 'entrada',
        produtoId: id,
        produtoNome: produto.nome,
        quantidade: quantidade,
        motivo: 'Entrada Manual',
        observacao: observacao,
        data: dataFormatada().data
    };
    // Registrar a movimentação no banco de dados
    adicionarMovimentacaoAoHistorico(movimentacao)
    fecharModalSecundario();
    abrirModalEstoque();
};



