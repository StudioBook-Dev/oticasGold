
/**
 * Abre o modal de entrada de estoque para um produto específico
 */
async function abrirModalEntradaEstoqueProduto(id, nome) {
    abrirModalSecundario({
        titulo: `Produto ${nome} - Entrada`,
        conteudo: `
            <div class="form-estoque">
                <div class="form-grupo">
                    <label>Produto: ${nome}</label>
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
                        onclick="constructPostMovimentacao('${id}', 'Entrada Manual')">
                        Confirmar Entrada
                    </button>
                </div>
            </div>
        `
    });
}





