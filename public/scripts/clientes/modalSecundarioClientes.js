

function abrirModalSecundarioClientes() {
    abrirModalSecundario({
        titulo: 'Adicionar Novo Cliente',
        conteudo: `
        <div class="form-container">
            <form id="formCliente" onsubmit="event.preventDefault(); 
                constructPostCliente();">
                <div class="form-group">
                    <label for="nomeCliente">Nome</label>
                    <input type="text" id="nomeCliente" name="nomeCliente" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="telefoneCliente">Telefone</label>
                    <input type="tel" id="telefoneCliente" name="telefoneCliente" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="emailCliente">Email</label>
                    <input type="email" id="emailCliente" name="emailCliente" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="dataNascimentoCliente">Data de Nascimento</label>
                    <input type="date" id="dataNascimentoCliente" name="dataNascimentoCliente" class="form-control" required>
                </div>
                               
                <div class="form-group">
                    <label for="enderecoCompleto">Endereço Completo</label>
                    <textarea id="enderecoCompleto" name="enderecoCompleto" class="form-control" rows="2"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="estadoCliente">Estado</label>
                        <input type="text" id="estadoCliente" name="estadoCliente" class="form-control">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="cidadeCliente">Cidade</label>
                        <input type="text" id="cidadeCliente" name="cidadeCliente" class="form-control">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group form-group-half">
                        <label for="ruaCliente">Rua</label>
                        <input type="text" id="ruaCliente" name="ruaCliente" class="form-control">
                    </div>
                    
                    <div class="form-group form-group-half">
                        <label for="casaCliente">Número</label>
                        <input type="text" id="casaCliente" name="casaCliente" class="form-control">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="cepCliente">CEP</label>
                    <input type="text" id="cepCliente" name="cepCliente" class="form-control">
                </div>
                
                <div class="form-group">
                    <label for="receitaArquivo">Receita (Anexar arquivo)</label>
                    <input type="file" id="receitaArquivo" name="receitaArquivo" class="form-control" 
                           accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp" 
                           title="Formatos aceitos: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, BMP">
                    <small class="form-text text-muted">Formatos aceitos: PDF, DOC, DOCX e imagens (JPG, PNG, GIF, BMP)</small>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    ` })
}


// Função para construir um novo cliente
function constructPostCliente() {
    const id = gerarId()
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
    postCliente(cliente)
    constructReceita(id)
} 