function botoesNavDoModalLancamento() {
    return `
        <button class="botao-icone-lancamento" title="Adicionar cupom" onclick="abrirCupom()">
            <i class="fas fa-ticket-alt"></i>
        </button>
        <button class="botao-icone-lancamento" title="Adicionar frete" onclick="abrirFrete()">
            <i class="fas fa-truck"></i>
        </button>
        <button class="botao-icone-lancamento" title="Adicionar observação" onclick="abrirObservacao()">
            <i class="fas fa-comment-alt"></i>
        </button>
        <button class="botao-icone-lancamento" title="Selecionar cliente" onclick="abrirCliente()">
            <i class="fas fa-user"></i>
        </button>
        <button class="botao-icone-lancamento" title="Adicionar desconto" onclick="abrirDesconto()">
            <i class="fas fa-cash-register"></i>
        </button>
        <button class="botao-icone-lancamento" title="Anexar Receita" onclick="abrirModalAnexarReceita()">
            <i class="fas fa-prescription"></i>
        </button>
        
    `;
}