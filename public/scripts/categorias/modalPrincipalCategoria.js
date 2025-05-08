

function abrirModalCategorias() {
    // Abrir o modal primeiro com mensagem de carregamento
    abrirModalPrincipal({
        titulo: 'Categorias',
        conteudo: '<div id="lista-categorias">Carregando categorias...</div>',
        adicionar: true
    });

    // Obter as categorias
    getCategorias()
        .then(categorias => {
            // Gerar HTML das categorias
            const htmlCategorias = gerarTabelaCategorias(categorias);
            // Atualizar o conteúdo do modal
            document.getElementById('lista-categorias').innerHTML = htmlCategorias;
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
            document.getElementById('lista-categorias').innerHTML = 'Erro ao carregar categorias.';
        });
}


// Função para gerar o HTML das categorias
function gerarTabelaCategorias(categorias) {
    if (!categorias || categorias.length === 0) {
        return '<p>Nenhuma categoria encontrada.</p>';
    }
    // Criar a tabela
    let html = `
    <table class="tabela-modal">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    // Exibir cada categoria
    categorias.forEach(categoria => {
        const id = categoria.id || '';
        const nome = categoria.nome || '';
        const descricao = categoria.descricao || '';
        html += `
        <tr>
            <td>
                <div class="acoes-container">
                    <button class="btn-acao btn-editar" title="Editar" 
                        onclick="editarCategoria('${id}')">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-acao btn-excluir" title="Excluir"
                        onclick="excluirItem('categorias', '${id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
            <td>${nome}</td>
            <td>${descricao}</td>
        </tr>`
    })
    html += '</tbody></table>'
    return html
}


// Função para editar categoria
function editarCategoria(id) {
    // Buscar categoria pelo ID
    getCategorias().then(categorias => {
        const categoria = categorias.find(cat => cat.id == id);
        if (categoria) {
            abrirModalSecundarioCategorias(categoria);
        } else {
            alert('Categoria não encontrada.');
        }
    });
}
