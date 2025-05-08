

function selecionarLancamento() {
    abrirModalSecundario({
        titulo: 'Selecione o tipo de Lançamento',
        conteudo: `
            <button onclick="abrirModalPrincipalPedidos()">Pedidos</button>
            <br>
            <button onclick="abrirModalTransacaoFinanceira()">Transações Financeiras</button>
        `,
    })
}






