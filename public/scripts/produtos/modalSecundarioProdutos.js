
async function abrirModalSecundarioProdutos() {
    abrirModalSecundario({
        titulo: 'Adicionar Novo Produto',
        conteudo: `
        <div class="form-container">
            <form id="formProduto" onsubmit="event.preventDefault(); enviaNovoProdutoPara_Salvar();">
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
                    <input type="number" id="estoque" name="estoque" class="form-control" min="0" required value="">
                </div>
                
                <div class="form-group">
                    <label for="categoria">Categoria</label>
                    <select id="categoria" name="categoria" class="form-control" required>
                        <option value="Selecione uma categoria">
                            Selecione uma categoria
                        </option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>`
    });
    adicionarCategoriasNoSelect();
}

async function adicionarCategoriasNoSelect(produto) {  
    try {
        // Carregar categorias após o modal ser aberto
        const selectCategoria = document.getElementById('categoria');
        const categorias = await getCategorias();
        
        // Limpar opções existentes exceto a primeira
        while (selectCategoria.children.length > 1) {
            selectCategoria.removeChild(selectCategoria.lastChild);
        }
        // Adicionar novas opções
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.nome;
            option.textContent = categoria.nome;
            
            if (produto && produto.categoria === categoria.nome) {
                option.selected = true;
            }
            selectCategoria.appendChild(option);
        });
        // Selecionar categoria do produto se estiver editando
        if (produto && produto.categoria) {
            const options = selectCategoria.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === produto.categoria) {
                    selectCategoria.selectedIndex = i;
                    break;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}









