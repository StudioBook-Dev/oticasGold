

/**
 * Abre o modal do histórico de estoque
 * Esta função é chamada pelo botão de Histórico no modal principal de estoque
 */
function abrirModalHistoricoEstoque() {
    abrirModalSecundario({
        titulo: 'Histórico de Estoque',
        conteudo: `
            <div class="form-estoque">
                <div id="tabela-historico">
                    <p>Carregando histórico...</p>
                </div>
            </div>
        `
    });
    // Carregar o histórico inicial (sem filtros)
    gerarTabelaHistorico();
};

/**
 * Gera a tabela HTML com o histórico de movimentações
 */
async function gerarTabelaHistorico() {
    const historico = await getMovimentacoes();
    const html = document.querySelector('#tabela-historico');
    let conteudo = `
        <table class="tabela-modal">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Produto</th>
                    <th>Quantidade</th>
                </tr>
            </thead>
            <tbody>`;
    historico.forEach(movimentacao => {
        const tipoClasse = movimentacao.tipo === 'entrada' ? 'entrada-estoque' : 'saida-estoque';       
        conteudo += `
        <tr class="${tipoClasse}">
            <td>${movimentacao.data}</td>
            <td>${movimentacao.tipo}</td>
            <td>${movimentacao.produtoNome}</td>
            <td>${movimentacao.quantidade}x</td>
        </tr>`;
    });
    conteudo += `
            </tbody>
        </table>`;

    html.innerHTML = conteudo;
}; 