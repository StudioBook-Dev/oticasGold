/**
 * Abre o modal de saída de estoque para um produto específico
 */
async function abrirModalMovimentacoes(id) {
    const produto = await getProdutoById(id)
    abrirModalSecundario({
        titulo: `Lançar Movimentação do ${produto.nome}`,
        conteudo: `
        <form onsubmit="event.preventDefault(); 
            constructPostMovimentacao(${produto.id})">
            <div class="form-estoque">
                <div class="form-grupo">
                    <label>Produto: ${produto.nome}</label>
                </div>

                <div class="form-grupo">
                    <label for="quantidade">Quantidade:</label>
                    <input type="number" id="quantidade" class="campo-formulario" step="1"
                    min="1" value="">
                </div>

                <div class="form-group">
                    <label>Tipo</label>
                    <div class="tipo-container">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipoEntrada" value="entrada"       name="tipo" checked>
                            <label class="form-check-label" for="tipoEntrada">Entrada</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="tipoSaida" value="saida" name="tipo" >
                            <label class="form-check-label" for="tipoSaida">Saída</label>
                        </div>
                    </div>
                </div>

                <div class="form-grupo">
                    <label for="observacao">Observação:</label>
                    <textarea id="observacao" class="campo-formulario" rows="3"></textarea>
                </div>

                <div class="form-acoes">
                    <button class="botao-formulario">
                        Confirmar Lançamento
                    </button>
                </div>
            </div>
        </form> `
    });
}


/**
 * Funções para registrar as movimentações de estoque (entradas e saídas)
 */
async function constructPostMovimentacao(id) {
    const produto = await getProdutoById(id)
    const quantidade = document.getElementById('quantidade').value;
    const observacao = document.getElementById('observacao').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    // Validação básica
    if (!quantidade || quantidade === '' || Number(quantidade) <= 0) {
        alert('Por favor, informe uma quantidade válida maior que zero.');
        return;
    }

    let movimentacao = {
        id: gerarId(),
        tipo: tipo,
        motivo: 'Lançamento Manual',
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: Number(quantidade), // Converter para número
        observacao: observacao || '',
        data: dataFormatada().data
    };

    console.log('Dados da movimentação antes de enviar:', movimentacao);
    postMovimentacao(movimentacao)
}













