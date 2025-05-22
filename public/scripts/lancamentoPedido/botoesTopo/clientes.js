

// Função para abrir o modal de cliente
function modalClientesParaPedido() {
    abrirModalSecundario({
        titulo: 'Selecionar Cliente',
        conteudo: `
            <form id="form-cliente" class="form-modal-secundario" >
                <div class="acoes-modal acoes-modal-clientes">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarClienteSelecionado()">
                        Cancelar
                    </button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarClienteSelecionado()"> 
                        Confirmar
                    </button>
                </div>
                <br>
                <div class="tabela-container">
                    <table id="tabela-clientes">
                    </table>
                </div>
            </form>`
    });
    gerarTabelaClientesParaPedido();
}


// Função para carregar clientes e preencher a tabela
async function gerarTabelaClientesParaPedido() {
    let conteudo = '';
    const clientes = await getClientes()
    const html = document.getElementById('tabela-clientes')
    if (!clientes || clientes.length === 0) {
        conteudo = '<p>Nenhum cliente encontrado.</p>';
    }
    clientes.forEach(cliente => {
        conteudo += `
            <tr>
                <td>
                    <input type="radio" name="cliente" value="${cliente.id}" id="cliente-${cliente.id}">
                </td>
                <td>${cliente.nome || ''}</td>
                <td>${cliente.telefone || ''}</td>
            </tr>`;
    });
    html.innerHTML = conteudo
}


// Função para aplicar o cliente selecionado ao pedido
function aplicarClienteSelecionado() {
    const clienteSelecionado = document.querySelector('input[name="cliente"]:checked');
    if (!clienteSelecionado) {
        alert('Selecione um cliente primeiro.');
        return;
    }
    const clienteId = clienteSelecionado.value;
    const clienteNome = clienteSelecionado.closest('tr').getElementsByTagName('td')[1].innerText;
    const clienteTelefone = clienteSelecionado.closest('tr').getElementsByTagName('td')[2].innerText;

    const cliente = {
        id: clienteId,
        nome: clienteNome,
        telefone: clienteTelefone
    };

    localStorage.setItem("cliente", JSON.stringify(cliente));
    statusIconeNoModalPrincipalPedido('cliente', true)
    fecharModalSecundario();
}


function cancelarClienteSelecionado() {
    localStorage.removeItem("cliente");
    statusIconeNoModalPrincipalPedido('cliente', false)
    fecharModalSecundario();
}
