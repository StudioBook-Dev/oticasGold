

// Função para abrir o modal de observação
function mdalObservacaoParaPedido() {
    abrirModalSecundario({
        titulo: 'Adicionar Observação',
        conteudo: `
        <form id="form-observacao" class="form-modal-secundario">
            <div class="acoes-modal">
                <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarObservacao()">Cancelar</button>
                <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="adicionarObservacao()">Salvar</button>
            </div>
            <br>
            <div class="campo-formulario">
                <label for="observacao">Observação do Pedido:</label>
                <textarea id="observacao" name="observacao" placeholder="Digite uma observação para o pedido" rows="4"></textarea>
            </div>
        </form>`
    });
}


// Função para salvar observação no objeto global
function adicionarObservacao() {
    const observacao = document.getElementById('observacao').value;
    if (!observacao) {
        alert('Digite uma observação para o pedido');
        return;
    }

    localStorage.setItem("observacao", JSON.stringify(observacao));
    statusIconeNoModalPrincipalPedido('observacao', true)
    fecharModalSecundario();
    constructHtmlCarrinho()
}


// Função para cancelar a observação
function cancelarObservacao() {
    localStorage.removeItem("observacao");
    statusIconeNoModalPrincipalPedido('observacao', false)
    fecharModalSecundario();
    constructHtmlCarrinho()
}
