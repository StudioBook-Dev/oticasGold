
/**
 * Abre o modal de saída de estoque para um produto específico
 */
async function abrirModalSaidaEstoqueProduto(id, nome) {
    const produto = await getProdutoById(id)
    abrirModalSecundario({
        titulo: `Produto ${nome} - Saída`,
        conteudo: `
            <div class="form-estoque">
                <div class="form-grupo">
                    <label>Produto: ${nome}</label>
                </div>
                <div class="form-grupo">
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" class="campo-formulario" step="1"
                    min="${produto.estoque}"  
                    value="${produto.estoque}">
                </div>
                <div class="form-grupo">
                    <label for="observacao">Observação:</label>
                    <textarea id="observacao" class="campo-formulario" rows="3"></textarea>
                </div>
                <div class="form-acoes">
                    <button id="btn-confirmar-saida" class="botao-formulario" 
                        onclick="constructPostMovimentacao('${id}', 'Saída Manual')">
                        Confirmar Saída
                    </button>
                </div>
            </div>
        `
    });
}





