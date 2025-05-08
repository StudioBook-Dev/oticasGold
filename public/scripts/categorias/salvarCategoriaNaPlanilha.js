/**
 * Função para salvar categoria na planilha
 * Manipula tanto a criação quanto a atualização de categorias
 */
async function salvarCategoriaNaPlanilha(editar = false) {

    const categoria = {
        id: editar && editar.id ? editar.id : null, // O SQLite gera IDs automaticamente
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value
    };

    // Validar campos obrigatórios
    if (!categoria.nome.trim()) {
        alert('O nome da categoria é obrigatório.');
        return false;
    }

    document.getElementById('formCategoria').innerHTML = '<div class="loading">Salvando categoria...</div>';

    try {
        let response;
        
        if (editar && editar.id) {
            // Atualizar categoria existente usando a API SQLite
            response = await fetch(`/api/categorias/${categoria.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });
        } else {
            // Criar nova categoria usando a API SQLite
            response = await fetch('/api/categorias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            });
        }

        if (!response.ok) {
            throw new Error(`Erro ao ${editar ? 'atualizar' : 'salvar'} a categoria`);
        }

        const data = await response.json();
        
        alert(`Categoria ${editar ? 'atualizada' : 'salva'} com sucesso!`);
        fecharModalSecundario();
        abrirModalCategorias();
        
    } catch (error) {
        console.error(`Erro ao ${editar ? 'atualizar' : 'salvar'} categoria:`, error);
        alert(`Erro ao ${editar ? 'atualizar' : 'salvar'} a categoria. Por favor, tente novamente.`);
        abrirModalSecundarioCategorias(editar);
    }
}
