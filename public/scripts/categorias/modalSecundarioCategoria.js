function abrirModalSecundarioCategorias(categoria) {
    const html = htmlModalSecundarioCategorias(categoria);
    abrirModalSecundario({
        titulo: categoria ? 'Editar Categoria' : 'Adicionar Nova Categoria',
        conteudo: html
    });
}


function htmlModalSecundarioCategorias(categoria) {
    // Função auxiliar para tratar valores undefined ou nulos
    const getValorSeguro = (valor) => {
        if (valor === undefined || valor === null || valor === 'undefined') {
            return '';
        }
        return valor;
    };

    // Adicionar campo oculto para ID se estiver editando
    const campoId = categoria ? `<input type="hidden" id="id" name="id" value="${categoria.id}">` : '';

    const html = `
        <div class="form-container">
            <form id="formCategoria" onsubmit="event.preventDefault(); salvarCategoriaDoFormulario();">
                ${campoId}
                <div class="form-group">
                    <label for="nome">Nome</label>
                    <input type="text" id="nome" name="nome" class="form-control" required value="${getValorSeguro(categoria?.nome)}">
                </div>
                
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea id="descricao" name="descricao" class="form-control" rows="3">${getValorSeguro(categoria?.descricao)}</textarea>
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
function salvarCategoriaDoFormulario() {
    const id = document.getElementById('id')?.value || '';
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    // Validar campos obrigatórios
    if (!nome.trim()) {
        alert('O nome da categoria é obrigatório.');
        return;
    }

    const categoria = {
        id: id || null, // Passa null para SQLite gerar ID automaticamente para novas categorias
        nome: nome,
        descricao: descricao
    };

    // Salvar categoria usando a API SQLite
    salvarCategoriaNaPlanilha(id ? categoria : false);
}
