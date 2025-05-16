

// Função para buscar todas as categorias produtos da API
async function getProdutos() {
    try {
        const response = await fetch('/api/produtos');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
}


// Função para buscar um produto pelo ID
async function getProdutoById(id) {
    try {
        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produto: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return null;
    }
}


// Função para excluir uma categoria pelo ID
function deleteCategoria(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
            fetch(`/api/produtos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Categoria excluída com sucesso!');
            gerarTabelaCategorias(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir produto:', error);
            alert('Erro ao excluir produto.');
        });
    }
}


// Função para salvar um novo produto
function postProduto(produto) {
    fetch('/api/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto salvo com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto.');
    });
}


// Função para salvar a edição do produto
function putProduto(produto) {
    fetch(`/api/produtos/${produto.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(data => {
        alert('Produto atualizado com sucesso!');
        fecharModalSecundario();
        gerarTabelaProdutos(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto.');
    });
}



