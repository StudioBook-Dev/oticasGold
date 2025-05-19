

function abrirModalClientes() {
    fecharModalSecundario();
    abrirModalPrincipal({
        titulo: 'Clientes',
        conteudo: '<div id="lista-clientes">Carregando clientes...</div>',
        adicionar: `
        <button class="modal-adicionar" 
            onclick="abrirModalSecundarioClientes()">
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
        </button> `
    });
    gerarTabelaClientes()
}


// Função para gerar o HTML dos clientes
async function gerarTabelaClientes() {
    const clientes = await getClientes()
    const html = document.getElementById('lista-clientes')

    if (!clientes || clientes.length === 0) {
        return '<p>Nenhum cliente encontrado.</p>';
    }

    let conteudo = `
    <table class="tabela-modal">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Data de Nascimento</th>
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    clientes.forEach(cliente => {
        conteudo += `
        <tr>
            <td>
                <div class="acoes-container">
                    <button class="btn-acao btn-editar" title="Editar" 
                onclick="editarCliente('${cliente.id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn-acao btn-excluir" title="Excluir"
                onclick="excluirItem('clientes', '${cliente.id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>
        <td>${cliente.nome || ''}</td>
        <td>${cliente.telefone || ''}</td>
        <td class="wrap-text">${cliente.email || ''}</td>
        <td class="align-center">${cliente.datanascimento || ''}</td>
        </tr>`;
    });

    conteudo += '</tbody></table>';
    html.innerHTML = conteudo;
}

