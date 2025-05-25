

// Função para abrir o modal de cliente
function modalClientesParaPedido() {
    abrirModalSecundario({
        titulo: 'Selecionar Cliente',
        conteudo: `
            <form id="form-cliente" class="form-modal-secundario" >
                <div class="acoes-modal">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarClienteSelecionado()">
                        Cancelar
                    </button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarClienteSelecionado()"> 
                        Confirmar
                    </button>
                </div>
                <br>
                <div id="tabela-clientes"> </div>
            </form>`
    });
    gerarTabelaClientesParaPedido();
}


// Função para carregar clientes e preencher a tabela
async function gerarTabelaClientesParaPedido() {
    const clientes = await getClientes()
    const html = document.getElementById('tabela-clientes')
    const clienteSelecionado = getItensPedidoInLocalStorage().cliente

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
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    clientes.forEach(cliente => {
        conteudo += `   
            <tr>
                <td>
                    <input type="radio" name="cliente" 
                    value="${cliente.id}"  id="cliente-${cliente.id}" 
                    ${cliente.id === clienteSelecionado.id ? 'checked' : ''}>
                </td>
                <td>${cliente.nome || ''}</td>
                <td>${cliente.telefone || ''}</td>
            </tr>`;
    });

    conteudo += '</tbody></table>'
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
    }
    localStorage.setItem("cliente", JSON.stringify(cliente));
    statusIconeNoModalPrincipalPedido('cliente', true)
    fecharModalSecundario();
    constructHtmlCarrinho()
}


function cancelarClienteSelecionado() {
    localStorage.removeItem("cliente");
    statusIconeNoModalPrincipalPedido('cliente', false)
    fecharModalSecundario();
    constructHtmlCarrinho()
}
