

function abrirModalSecundarioCategorias() {
    abrirModalSecundario({
        titulo: 'Adicionar Nova Categoria',
        conteudo: `
        <div class="form-container">
            <form id="formCategoria" onsubmit="event.preventDefault(); 
               constructPostCategoria();">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    ` })
}


// Função para construir uma nova categoria
function constructPostCategoria() {
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = {
        id: gerarId(),
        nome,
        descricao
    };
    postCategoria(categoria)
}
