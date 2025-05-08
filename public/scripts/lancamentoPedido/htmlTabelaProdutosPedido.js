function gerarTabelaProdutosPedido(produtos){
    if (!produtos || produtos.length === 0) {
        return '<p>Nenhum produto encontrado.</p>';
    }
    // Adicionar campo de busca e botão de adicionar
    let html = '';
    // Criar a tabela
    html += `
        <table class="tabela-modal">
        <thead><tr>
        <th class="col-15">Ações</th>
        <th class="col-20">Nome</th>
        <th class="col-40">Descrição</th>
        <th class="col-15">Preço</th>
        <th class="col-10">Estoque</th>
        </tr></thead>
        <tbody>
    `;
    // Verificar cada produto e exibir seus dados
    produtos.forEach((produto, index) => {
        // Garantir que todos os campos existam para evitar erros
        const id = produto.id !== undefined && !isNaN(produto.id) ? produto.id : index + 1;
        const nome = typeof produto.nome === 'string' ? produto.nome : '';
        const descricao = typeof produto.descricao === 'string' ? produto.descricao : '';
        // Garantir que preço seja um número válido
        let preco = 0;
        if (produto.preco !== undefined && !isNaN(parseFloat(produto.preco))) {
            preco = parseFloat(produto.preco);
        }
        // Garantir que estoque seja um número válido
        let estoque = 0;
        if (produto.estoque !== undefined && !isNaN(parseInt(produto.estoque))) {
            estoque = parseInt(produto.estoque);
        }
        // Formatar valores para exibição
        const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`;
        html += `<tr>`;
        html += `<td>
            <div class="acoes-container">
                <button class="btn-acao btn-editar" data-id="${id}" title="Editar" 
                onclick="editarProduto('${id}')"
                >
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn-acao btn-excluir" data-id="${id}" title="Excluir"
                onclick="excluirItem('produtos', '${id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            </td>
            <td>${nome}</td>
            <td class="wrap-text">${descricao}</td>
            <td class="align-right">${precoFormatado}</td>
            <td class="align-center">${estoque}</td>
            </tr>
        `;
    });
    html += '</tbody></table>';

    return html;
}