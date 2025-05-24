

// Função para abrir o modal de desconto
function modalDescontoParaPedido() {
    abrirModalSecundario({
        titulo: 'Adicionar Desconto',
        conteudo: `
            <form id="form-desconto" class="form-modal-secundario">
                <div class="campo-formulario">
                    <label for="valor-desconto">Valor do Desconto (R$):</label>
                    <input type="text" id="valor-desconto" name="valor-desconto" value="" 
                        placeholder="0,00" autocomplete="off" min="0" required>
                </div>
                <div class="acoes-modal acoes-modal-rodape">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarDesconto()">Cancelar</button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarDesconto()">Aplicar</button>
                </div>
            </form>`
    });
}


function aplicarDesconto() {
    const inputDesconto = document.getElementById('valor-desconto');
    if (!inputDesconto) {
        alert('Elemento de input do desconto não encontrado');
        return;
    }
    let valorDesconto = parseFloat(inputDesconto.value.replace(',', '.'))
    
    localStorage.setItem("desconto", JSON.stringify(valorDesconto));
    statusIconeNoModalPrincipalPedido('desconto', true)
    fecharModalSecundario();
    constructHtmlCarrinho()
}


function cancelarDesconto() {
    localStorage.removeItem("desconto");
    statusIconeNoModalPrincipalPedido('desconto', false)
    fecharModalSecundario();
    constructHtmlCarrinho()
}

