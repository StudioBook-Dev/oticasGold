// Função para abrir o modal de cadastro de cliente
function abrirModalSecundarioClientes(cliente) {
    const html = htmlModalSecundarioCliente(cliente);
    abrirModalSecundario({
        titulo: cliente ? 'Editar Cliente' : 'Adicionar Novo Cliente',
        conteudo: html
    });
}

function htmlModalSecundarioCliente(cliente) {
    // Função auxiliar para tratar valores undefined ou nulos
    const getValorSeguro = (valor) => {
        if (valor === undefined || valor === null || valor === 'undefined') {
            return '';
        }
        return valor;
    };

    // Adicionar campo oculto para ID se estiver editando
    const campoId = cliente ? `<input type="hidden" id="clienteId" name="clienteId" value="${cliente.id}">` : '';

    const html = `
        <div class="form-container">
            <form id="formCliente" onsubmit="event.preventDefault(); salvarClienteDoFormulario();">
                ${campoId}
                <div class="form-group">
                    <label for="nomeCliente">Nome</label>
                    <input type="text" id="nomeCliente" name="nomeCliente" class="form-control" required value="${getValorSeguro(cliente?.nome)}">
                </div>
                
                <div class="form-group">
                    <label for="telefoneCliente">Telefone</label>
                    <input type="tel" id="telefoneCliente" name="telefoneCliente" class="form-control" value="${getValorSeguro(cliente?.telefone)}">
                </div>
                
                <div class="form-group">
                    <label for="emailCliente">Email</label>
                    <input type="email" id="emailCliente" name="emailCliente" class="form-control" value="${getValorSeguro(cliente?.email)}">
                </div>
                
                <div class="form-group">
                    <label for="dataNascimentoCliente">Data de Nascimento</label>
                    <input type="date" id="dataNascimentoCliente" name="dataNascimentoCliente" class="form-control" value="${getValorSeguro(cliente?.datanascimento)}">
                </div>
                               
                <div class="form-group">
                    <label for="enderecoCompleto">Endereço Completo</label>
                    <textarea id="enderecoCompleto" name="enderecoCompleto" class="form-control" rows="2">${getValorSeguro(cliente?.enderecoCompleto)}</textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="estadoCliente">Estado</label>
                        <input type="text" id="estadoCliente" name="estadoCliente" class="form-control" value="${getValorSeguro(cliente?.estado)}">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="cidadeCliente">Cidade</label>
                        <input type="text" id="cidadeCliente" name="cidadeCliente" class="form-control" value="${getValorSeguro(cliente?.cidade)}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="ruaCliente">Rua</label>
                        <input type="text" id="ruaCliente" name="ruaCliente" class="form-control" value="${getValorSeguro(cliente?.rua)}">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="casaCliente">Número</label>
                        <input type="text" id="casaCliente" name="casaCliente" class="form-control" value="${getValorSeguro(cliente?.casa)}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cepCliente">CEP</label>
                    <input type="text" id="cepCliente" name="cepCliente" class="form-control" value="${getValorSeguro(cliente?.cep)}">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    return html;
}

// Função para salvar os dados do formulário
function salvarClienteDoFormulario() {
    const id = document.getElementById('clienteId')?.value || '';
    const nome = document.getElementById('nomeCliente').value;
    const telefone = document.getElementById('telefoneCliente').value;
    const email = document.getElementById('emailCliente').value;
    const dataNascimento = document.getElementById('dataNascimentoCliente').value;
    
    // Campos de endereço
    const enderecoCompleto = document.getElementById('enderecoCompleto').value;
    const estado = document.getElementById('estadoCliente').value;
    const cidade = document.getElementById('cidadeCliente').value;
    const rua = document.getElementById('ruaCliente').value;
    const casa = document.getElementById('casaCliente').value;
    const cep = document.getElementById('cepCliente').value;

    // Validar campos obrigatórios
    if (!nome.trim()) {
        alert('O nome do cliente é obrigatório.');
        return;
    }

    const cliente = {
        id: id,
        nome: nome,
        telefone: telefone,
        email: email,
        datanascimento: dataNascimento,
        enderecoCompleto: enderecoCompleto,
        estado: estado,
        cidade: cidade,
        rua: rua,
        casa: casa,
        cep: cep
    };

    // Salvar cliente na planilha
    salvarClienteNaPlanilha(cliente.id ? cliente : null);
} 