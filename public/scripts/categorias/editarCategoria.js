

async function editarCategoria(id) {
    const categoria = await getCategoriaById(id)
    abrirModalSecundario({
        titulo: `Editar Categoria ${categoria.nome} #${categoria.id}`,
        conteudo: `
        <div class="form-container">
            <form id="formCategoria" onsubmit="event.preventDefault(); 
                constructPutCategoria();">
                <input type="hidden" id="id" name="id" value="${categoria.id}">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required 
                    value="${categoria.nome}">
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3"
                    value="">${categoria.descricao}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    ` })
}


function constructPutCategoria() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nome').value
    const descricao = document.getElementById('descricao').value
    const categoria = { 
        id, 
        nome, 
        descricao 
    }
    putCategoria(categoria)
}
