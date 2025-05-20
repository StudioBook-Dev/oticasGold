
async function abrirModalSecundarioProdutos() {
    const categorias = await getCategorias();
    abrirModalSecundario({
        titulo: 'Adicionar Novo Produto',
        conteudo: `
        <div class="form-container">
            <form id="formProduto" onsubmit="event.preventDefault(); 
                constructPostProduto();">
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required value="">
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="preco">Preço (R$)</label>
                    <input type="number" id="preco" name="preco" class="form-control" step="0.01" required value="">
                </div>
                
                <div class="form-group">
                    <label for="codigoInterno">Código Interno</label>
                    <input type="text" id="codigoInterno" name="codigoInterno" class="form-control" value="">
                </div>
                
                <div class="form-group">
                    <label for="codigoExterno">Código Externo</label>
                    <input type="text" id="codigoExterno" name="codigoExterno" class="form-control" value="">
                </div>

                <div class="form-group">
                    <label for="estoque">Estoque</label>
                    <input type="number" id="estoque" name="estoque" class="form-control" min="0" value="0">
                </div>
                
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select name="categoria" class="form-control" id="categoria" required>
                        <option>Selecione uma categoria</option>
                        ${ await opcoesSelecionaveis(categorias) }
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>`
    });
}


// Função para salvar o produto do formulário
function constructPostProduto() {
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;
    const codigoInterno = document.getElementById('codigoInterno').value;
    const codigoExterno = document.getElementById('codigoExterno').value;
    const preco = document.getElementById('preco').value;
    const estoque = document.getElementById('estoque').value;
    const categoria = document.getElementById('categoria').value;
    const dataCriacao = dataFormatada().data

    const produto = {
        id: gerarId(),
        nome,
        descricao,
        codigoInterno,
        codigoExterno,
        preco,
        estoque,
        categoria,
        dataCriacao
    };
    
    postProduto(produto)
    
    constructPostMovimentacao(id, 'criação de produto')
}












