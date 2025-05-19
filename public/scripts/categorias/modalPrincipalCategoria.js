

function abrirModalCategorias() {
    fecharModalSecundario();
    abrirModalPrincipal({
        titulo: 'Categorias',
        conteudo: '<div id="lista-categorias">Carregando categorias...</div>',
        adicionar: `
        <button class="modal-adicionar" 
            onclick="abrirModalSecundarioCategorias()">
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
        </button> `
    });
    gerarTabelaCategorias()
}


// Função para gerar o HTML das categorias
async function gerarTabelaCategorias() {
    const categorias = await getCategorias()
    const html = document.getElementById('lista-categorias')

    if (!categorias || categorias.length === 0) {
        return '<p>Nenhuma categoria encontrada.</p>';
    }

    let conteudo = `
    <table class="tabela-modal">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    categorias.forEach(categoria => {
        conteudo += `
        <tr>
            <td>
                <div class="acoes-container">
                    <button class="btn-acao btn-editar" title="Editar" 
                        onclick="editarCategoria('${categoria.id || ''}')">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-acao btn-excluir" title="Excluir"
                        onclick="excluirItem('categorias', '${categoria.id || ''}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
            <td>${categoria.nome || ''}</td>
            <td>${categoria.descricao || ''}</td>
        </tr>`
    })
    
    conteudo += '</tbody></table>'
    html.innerHTML = conteudo
}



