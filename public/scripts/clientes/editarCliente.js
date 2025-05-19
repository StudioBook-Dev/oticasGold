

// Função para editar um cliente existente
async function editarCliente(id) {
    const cliente = await getClienteById(id)
    console.log(cliente)
    abrirModalSecundario({
        titulo: `Editar Cliente ${cliente.nome} #${cliente.id}`,
        conteudo: `
        <div class="form-container">
            <form id="formCliente" onsubmit="event.preventDefault(); 
                constructPutCliente();">
                <input type="hidden" id="id" name="id" value="${cliente.id}">
                <div class="form-group">
                    <label for="nomeCliente">Nome</label>
                    <input type="text" id="nomeCliente" name="nomeCliente" class="form-control" required
                    value="${cliente.nome}">
                </div>
                
                <div class="form-group">
                    <label for="telefoneCliente">Telefone</label>
                    <input type="tel" id="telefoneCliente" name="telefoneCliente" class="form-control"
                    value="${cliente.telefone}">
                </div>
                
                <div class="form-group">
                    <label for="emailCliente">Email</label>
                    <input type="email" id="emailCliente" name="emailCliente" class="form-control" 
                    value="${cliente.email}">
                </div>
                
                <div class="form-group">
                    <label for="dataNascimentoCliente">Data de Nascimento</label>
                    <input type="date" id="dataNascimentoCliente" name="dataNascimentoCliente" class="form-control" required
                    value="${cliente.datanascimento}">
                </div>
                               
                <div class="form-group">
                    <label for="enderecoCompleto">Endereço Completo</label>
                    <textarea id="enderecoCompleto" name="enderecoCompleto" class="form-control" rows="2"
                    value=""> ${cliente.enderecoCompleto} </textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="estadoCliente">Estado</label>
                        <input type="text" id="estadoCliente" name="estadoCliente" class="form-control"
                        value="${cliente.estado}">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="cidadeCliente">Cidade</label>
                        <input type="text" id="cidadeCliente" name="cidadeCliente" class="form-control"
                        value="${cliente.cidade}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="ruaCliente">Rua</label>
                        <input type="text" id="ruaCliente" name="ruaCliente" class="form-control"
                        value="${cliente.rua}">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="casaCliente">Número</label>
                        <input type="text" id="casaCliente" name="casaCliente" class="form-control"
                        value="${cliente.casa}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cepCliente">CEP</label>
                    <input type="text" id="cepCliente" name="cepCliente" class="form-control"
                    value="${cliente.cep}">
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    ` })
}


function constructPutCliente() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nomeCliente').value
    const telefone = document.getElementById('telefoneCliente').value
    const email = document.getElementById('emailCliente').value
    const datanascimento = document.getElementById('dataNascimentoCliente').value
    // Campos de endereço
    const enderecoCompleto = document.getElementById('enderecoCompleto').value
    const estado = document.getElementById('estadoCliente').value
    const cidade = document.getElementById('cidadeCliente').value
    const rua = document.getElementById('ruaCliente').value
    const casa = document.getElementById('casaCliente').value
    const cep = document.getElementById('cepCliente').value

    const cliente = {
        id,
        nome,
        telefone,
        email,
        datanascimento,
        enderecoCompleto,
        estado,
        cidade,
        rua,
        casa,
        cep
    }
    putCliente(cliente)
}

