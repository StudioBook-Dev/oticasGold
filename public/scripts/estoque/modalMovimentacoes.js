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
async function constructPostMovimentacao(id, modo = 'manual') {
    let movimentacao = {
        id: gerarId(),
        data: dataFormatada().data
    }

    if (modo === 'manual') {
        const produto = await getProdutoById(id)
        const quantidade = document.getElementById('quantidade').value;
        const observacao = document.getElementById('observacao').value;
        const tipo = document.querySelector('input[name="tipo"]:checked').value;
        movimentacao.tipo = tipo
        movimentacao.motivo = 'Lançamento Manual'
        movimentacao.produtoId = produto.id
        movimentacao.produtoNome = produto.nome
        movimentacao.quantidade = Number(quantidade)
        movimentacao.observacao = observacao || ''
    }

    if (modo === 'automatico') {
        const produto = getItensPedidoInLocalStorage().itensPedido.find(item => item.id === id)
        movimentacao.tipo = 'saida'
        movimentacao.motivo = 'Lançamento de Pedido'
        movimentacao.produtoId = produto.id
        movimentacao.produtoNome = produto.nome
        movimentacao.quantidade = produto.quantidade
        movimentacao.observacao = getItensPedidoInLocalStorage().observacao
    }

    postMovimentacao(movimentacao)
}













