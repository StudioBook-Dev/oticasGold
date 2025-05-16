

// Função para buscar todas as categorias financeiras da API
async function getCategoriasFinanceiras() {
    try {
        const response = await fetch('/api/financeiro/categorias');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias financeiras: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar categorias financeiras:', error);
        return [];
    }
}


// Função para buscar uma categoria financeira pelo ID
async function getCategoriaFinanceiraById(id) {
    try {
        const response = await fetch(`/api/financeiro/categorias/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar categoria financeira: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar categoria financeira:', error);
        return null;
    }
}


// Função para excluir uma categoria financeira pelo ID
function deleteCategoriaFinanceira(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        fetch(`/api/financeiro/categorias/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Categoria excluída com sucesso!');
            gerarTabelaCategoriasFinanceiras(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria.');
        });
    }
}


// Função para salvar uma nova categoria financeira
function postCategoriaFinanceira(categoria) {
    fetch('/api/financeiro/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria)
    })
    .then(response => response.json())
    .then(data => {
        alert('Categoria financeira salva com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria financeira.');
    });
}


// Função para salvar a edição da categoria
function putCategoriaFinanceira(categoria) {
    fetch(`/api/financeiro/categorias/${categoria.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria)
    })
    .then(response => response.json())
    .then(data => {
        alert('Categoria atualizada com sucesso!');
        fecharModalSecundario();
        gerarTabelaCategoriasFinanceiras(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar categoria:', error);
        alert('Erro ao atualizar categoria.');
    });
}

