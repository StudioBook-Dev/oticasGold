
async function editarProduto(id) {
    const produto = await getProdutoById(id);
    console.log(produto)
    const categorias = await getCategorias();
    abrirModalSecundario({
        titulo: `Editar Produto ${produto.nome} #${produto.id}`,
        conteudo: `
         <div class="form-container">
            <form id="formProduto" onsubmit="event.preventDefault(); 
                constructPutProduto();">
                
                <input type="hidden" id="id" value="${produto.id}">
                <input type="hidden" id="estoque" value="${produto.estoque}">
                <input type="hidden" id="dataCriacao" value="${produto.dataCriacao}">
                
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required 
                    value="${produto.nome}">
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3">${produto?.descricao}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="preco">Preço (R$)</label>
                    <input type="number" id="preco" name="preco" class="form-control" step="0.01" required 
                    value="${produto.preco}">
                </div>
                
                <div class="form-group">
                    <label for="codigoInterno">Código Interno</label>
                    <input type="text" id="codigoInterno" name="codigoInterno" class="form-control" 
                    value="${produto.codigoInterno}">
                </div>
                
                <div class="form-group">
                    <label for="codigoExterno">Código Externo</label>
                    <input type="text" id="codigoExterno" name="codigoExterno" class="form-control" 
                    value="${produto.codigoExterno}">
                </div>
                
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select name="categoria" class="form-control" id="categoria" required>
                        <option> ${produto.categoria} </option>
                        ${ await opcoesSelecionaveis(categorias) }
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    `
    });
}


// Função para salvar o produto do formulário
function constructPutProduto() {
    const id = document.getElementById('id').value
    const nome = document.getElementById('nome').value
    const descricao = document.getElementById('descricao').value
    const codigoInterno = document.getElementById('codigoInterno').value
    const codigoExterno = document.getElementById('codigoExterno').value
    const preco = document.getElementById('preco').value
    const estoque = document.getElementById('estoque').value
    const categoria = document.getElementById('categoria').value
    const dataCriacao = document.getElementById('dataCriacao').value

    const produto = {
        id,
        nome,
        descricao,
        codigoInterno,
        codigoExterno,
        preco,
        estoque,
        categoria,
        dataCriacao
    };

    putProduto(produto)
}




