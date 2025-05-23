async function abrirModalProdutos() {
    fecharModalSecundario();
    abrirModalPrincipal({
        titulo: 'Produtos',
        conteudo: '<div id="lista-produtos">Carregando produtos...</div>',
        adicionar: `
        <button class="modal-adicionar" 
            onclick="abrirModalSecundarioProdutos()">
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
        </button> `
    });
    gerarTabelaProdutos();
}


// Função para gerar o HTML dos produtos
async function gerarTabelaProdutos() {
    const produtos = await getProdutos();
    const html = document.getElementById('lista-produtos');

    if (!produtos || produtos.length === 0) {
        return '<p>Nenhum produto encontrado.</p>';
    }

    let conteudo = `
    <table class="tabela-modal">
        <thead><tr>
        <th class="col-15">Ações</th>
        <th class="col-20">Nome</th>
        <th class="col-30">Descrição</th>
        <th class="col-10">Preço</th>
        <th class="col-10">Custo</th>
        <th class="col-15">Estoque</th>
        </tr></thead>
        <tbody class="modal-conteudo">`;
    produtos.forEach((produto) => {
        conteudo += `
        <tr>
            <td>
                <div class="acoes-container">
                    <button class="btn-acao btn-editar" title="Editar" 
                    onclick="editarProduto('${produto.id}')">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-acao btn-excluir" title="Excluir"
                    onclick="excluirItem('produtos', '${produto.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
            <td>${produto.nome}</td>
            <td class="wrap-text">${produto.descricao}</td>
            <td class="align-right">${produto.preco}</td>
            <td class="align-right">${produto.custo}</td>
            <td class="align-center">${produto.estoque}</td>
        </tr>`;
    });

    conteudo += '</tbody></table>';
    html.innerHTML = conteudo;
}




