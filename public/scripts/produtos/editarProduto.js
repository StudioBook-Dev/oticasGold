
async function editarProduto(id) {

    const produto = await getProduto(id);

    abrirModalSecundario({
        titulo: `Editando ${produto.nome}`,
        conteudo: `
         <div class="form-container">
            <form id="formProduto" onsubmit="event.preventDefault(); 
                enviaNovoProdutoPara_Atualizar(${id});">
                <input type="hidden" id="dataCriacao" name="id" value="${produto.dataCriacao}">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required value="${produto?.nome}">
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3">${produto?.descricao}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="preco">Preço (R$)</label>
                    <input type="number" id="preco" name="preco" class="form-control" step="0.01" required value="${produto?.preco}">
                </div>
                
                <div class="form-group">
                    <label for="codigoInterno">Código Interno</label>
                    <input type="text" id="codigoInterno" name="codigoInterno" class="form-control" value="${produto?.codigoInterno}">
                </div>
                
                <div class="form-group">
                    <label for="codigoExterno">Código Externo</label>
                    <input type="text" id="codigoExterno" name="codigoExterno" class="form-control" value="${produto?.codigoExterno}">
                </div>

                <div class="form-group">
                    <label for="estoque">Estoque</label>
                    <input type="number" id="estoque" name="estoque" class="form-control" min="0" required value="${produto?.estoque}">
                </div>
                
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select id="categoria" name="categoria" class="form-control" required>
                        <option value="${produto?.categoria || 'Selecione uma categoria'}">
                            ${produto?.categoria || 'Selecione uma categoria'}
                        </option>
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
    adicionarCategoriasNoSelect(produto);
}


// Função para salvar o produto do formulário
function enviaNovoProdutoPara_Atualizar(id) {
    const produto = {
        id: id,
        nome: getInputValue('nome'),
        descricao: getInputValue('descricao'),
        codigoInterno: getInputValue('codigoInterno'),
        codigoExterno: getInputValue('codigoExterno'),
        preco: getInputValue('preco'),
        estoque: getInputValue('estoque'),
        categoria: getInputValue('categoria'),
        dataCriacao: getInputValue('dataCriacao')
    };
    putProduto(produto)
    fecharModalSecundario()
    abrirModalProdutos()
    hubAtualizarEstoque_Automatico(produto, 'edição de produto')
}




