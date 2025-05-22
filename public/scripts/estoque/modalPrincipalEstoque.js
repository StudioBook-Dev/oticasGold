
/**
 * Abre o modal principal de estoque
 */
function abrirModalEstoque() {
    getProdutos()
    abrirModalPrincipal({
        titulo: 'Estoque',
        conteudo: `
            <div class="acoes-estoque">
                <button class="botao-estoque" onclick="abrirModalHistoricoEstoque()">
                    <i class="fas fa-history"></i> Histórico
                </button>
            </div>
            <div id="lista-produtos">Carregando produtos...</div>`,
        adicionar: ''
    });
    gerarTabelaEstoque()
}

/**
 * Gera a tabela de estoque com as colunas: ID, nome, código interno, código externo e quantidade
 */
async function gerarTabelaEstoque() {
    const produtos = await getProdutos();
    const html = document.querySelector('#lista-produtos');
    let conteudo = `
        <div class="tabela-container modal-conteudo">
            <table class="tabela-modal">
                <thead>
                    <tr>
                        <th>Açoes</th>
                        <th>Nome</th>
                        <th>Código Interno</th>
                        <th>Código Externo</th>
                        <th>Estoque</th>
                    </tr>
                </thead>
                <tbody class="modal-conteudo">`;
    produtos.forEach((produto) => {
        conteudo += `
            <tr>
                <td style="display: flex; gap: 10px;">
                    <button class="botao-estoque" 
                    onclick="abrirModalMovimentacoes(${produto.id})">
                        <i class="fas fa-plus-circle"></i> 
                    </button>
                </td>
                <td>${produto.nome}</td>
                <td>${produto.codigoInterno}</td>
                <td>${produto.codigoExterno}</td>
                <td>${produto.estoque}x</td>
            </tr>`;
    });

    conteudo += `</tbody></table></div>`;
    html.innerHTML = conteudo;
} 













