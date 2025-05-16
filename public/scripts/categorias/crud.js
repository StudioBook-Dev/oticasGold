

// Função para buscar todas as categorias produtos da API
async function getCategorias() {
    try {
        const response = await fetch('/api/categorias');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return [];
    }
}


// Função para buscar uma categoria pelo ID
async function getCategoriaById(id) {
    try {
        const response = await fetch(`/api/categorias/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar categoria: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        return null;
    }
}


// Função para excluir uma categoria pelo ID
function deleteCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        fetch(`/api/categorias/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Categoria excluída com sucesso!');
            gerarTabelaCategorias(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria.');
        });
    }
}


// Função para salvar uma nova categoria
function postCategoria(categoria) {
    fetch('/api/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria)
    })
    .then(response => response.json())
    .then(data => {
        alert('Categoria salva com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria.');
    });
}


// Função para salvar a edição da categoria
function putCategoria(categoria) {
    fetch(`/api/categorias/${categoria.id}`, {
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
        gerarTabelaCategorias(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar categoria:', error);
        alert('Erro ao atualizar categoria.');
    });
}

