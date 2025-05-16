

function abrirModalClientes() {
    // Fechar qualquer modal secundário aberto
    fecharModalSecundario();

    // Abrir o modal primeiro com mensagem de carregamento
    abrirModalPrincipal({
        titulo: 'Clientes',
        conteudo: '<div id="lista-clientes">Carregando clientes...</div>',
        adicionar: true
    });

    // Obter os clientes
    getClientes()
        .then(clientes => {
            // Gerar HTML dos clientes
            const htmlClientes = gerarTabelaClientes(clientes);
            // Atualizar o conteúdo do modal
            document.getElementById('lista-clientes').innerHTML = htmlClientes;
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
            document.getElementById('lista-clientes').innerHTML = 'Erro ao carregar clientes.';
        });
}

// Função para gerar o HTML dos clientes
function gerarTabelaClientes(clientes) {
    if (!clientes || clientes.length === 0) {
        return '<p>Nenhum cliente encontrado.</p>';
    }

    // Criar o botão de adicionar
    let html = ``;

    // Criar a tabela
    html += '<table class="tabela-modal sticky-header" id="tabelaClientes">';
    html += '<thead><tr>';
    html += '<th class="col-10">Ações</th>';
    html += '<th class="col-25">Nome</th>';
    html += '<th class="col-20">Telefone</th>';
    html += '<th class="col-25">Email</th>';
    html += '<th class="col-20">Data de Nascimento</th>';
    html += '</tr></thead>';
    html += '<tbody class="modal-conteudo">';

    // Exibir cada cliente
    clientes.forEach(cliente => {
        const id = cliente.id || '';
        const nome = cliente.nome || '';
        const telefone = cliente.telefone || '';
        const email = cliente.email || '';
        const dataNascimento = cliente.datanascimento || '';

        html += `<tr>`;
        html += `<td>
            <div class="acoes-container">
                <button class="btn-acao btn-editar" title="Editar" 
                onclick="editarCliente('${id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn-acao btn-excluir" title="Excluir"
                onclick="excluirItem('clientes', '${id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>`;
        html += `<td>${nome}</td>`;
        html += `<td>${telefone}</td>`;
        html += `<td class="wrap-text">${email}</td>`;
        html += `<td class="align-center">${dataNascimento}</td>`;
        html += `</tr>`;
    });

    html += '</tbody></table>';
    return html;
}

