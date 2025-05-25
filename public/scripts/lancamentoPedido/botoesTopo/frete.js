

// Função para abrir o modal de frete
function modalFreteParaPedido() {
    const freteSelecionado = getItensPedidoInLocalStorage().frete
    abrirModalSecundario({
        titulo: 'Adicionar Frete',
        conteudo: `
        <form id="form-frete" class="form-modal-secundario form-frete">
            <div class="acoes-modal">
                <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarFrete()">Cancelar</button>
                <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarFrete()">Salvar</button>
            </div>
            <br>
            <div class="campo-formulario">
                <label for="valor-frete"></label>
                <input type="text" id="valor-frete" name="valor-frete" value="${freteSelecionado}" 
                       placeholder="0,00" autocomplete="off">
            </div>
        </form> `
    });
}


function aplicarFrete() {
    const inputFrete = document.getElementById('valor-frete');
    if (!inputFrete) {
        alert('Elemento de input do desconto não encontrado');
        return;
    }
    let valorFrete = parseFloat(inputFrete.value.replace(',', '.'))
    
    localStorage.setItem("frete", JSON.stringify(valorFrete));
    statusIconeNoModalPrincipalPedido('frete', true)
    fecharModalSecundario();
    constructHtmlCarrinho()
}


function cancelarFrete() {
    localStorage.removeItem("frete");
    statusIconeNoModalPrincipalPedido('frete', false)
    fecharModalSecundario();
    constructHtmlCarrinho()
}



