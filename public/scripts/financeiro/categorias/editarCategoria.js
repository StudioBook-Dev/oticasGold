

// Funções para editar e excluir categorias
async function editarCategoriaFinanceira(id) {
    const categoria = await getCategoriaFinanceiraById(id);
    abrirModalSecundario({
        titulo: 'Editar Categoria Financeira',
        conteudo: `
        <div class="opcoes-financeiro">
            <form id="formEditarCategoriaFinanceira" onsubmit="event.preventDefault(); 
                constructPutCategoriaFinanceira();">
                <input type="hidden" id="idCategoriaFinanceira" value="${categoria.id}">
                <div class="form-group">
                    <label for="nomeEditarCategoriaFinanceira">Nome</label>
                    <input type="text" id="nomeEditarCategoriaFinanceira" class="form-control form-control-full" 
                    value="${categoria.nome}" required>
                </div>
                <div class="form-group">
                    <label for="descricaoEditarCategoriaFinanceira">Descrição</label>
                    <textarea id="descricaoEditarCategoriaFinanceira" class="form-control form-control-full">
                    ${categoria.descricao}</textarea>
                </div>
                <div class="form-group">
                    <label>Tipo</label>
                    <div class="tipo-container">
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="tipoEditarCategoriaFinanceira" id="tipoEditarDespesa" 
                            value="despesa" ${categoria.tipo === 'despesa' ? 'checked' : ''}>
                            <label class="form-check-label" for="tipoEditarDespesa">Despesa</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="tipoEditarCategoriaFinanceira" id="tipoEditarReceita" 
                            value="receita" ${categoria.tipo === 'receita' ? 'checked' : ''}>
                            <label class="form-check-label" for="tipoEditarReceita">Receita</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="corEditarCategoriaFinanceira">Cor</label>
                    <input type="color" id="corEditarCategoriaFinanceira" class="form-control color-picker" 
                    value="${categoria.cor}">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div> `
    });
}


function constructPutCategoriaFinanceira() {
    const id = document.getElementById('idCategoriaFinanceira').value;
    const nome = document.getElementById('nomeEditarCategoriaFinanceira').value;
    const descricao = document.getElementById('descricaoEditarCategoriaFinanceira').value;
    const tipo = document.querySelector('input[name="tipoEditarCategoriaFinanceira"]:checked').value;
    const cor = document.getElementById('corEditarCategoriaFinanceira').value;

    const categoria = {
        id: id,
        nome: nome,
        tipo: tipo,
        descricao: descricao,
        cor: cor
    }

    putCategoriaFinanceira(categoria);
}

