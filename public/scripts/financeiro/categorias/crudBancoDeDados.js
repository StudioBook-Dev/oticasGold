

// Função para buscar as categorias financeiras da API
async function Ler_CategoriasFinanceiras() {
    try {
        const response = await fetch('/api/financeiro/categorias');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias financeiras: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
            return data;
        } else if (data && typeof data === 'object') {
            // Se a resposta não for um array, mas for um objeto, pode ser uma resposta de erro ou estrutura diferente
            console.log('Resposta não é um array:', data);
            return data;
        } else {
            // Se não for nem array nem objeto, retorna array vazio
            console.log('Resposta inválida, retornando array vazio');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar categorias financeiras:', error);
        return [];
    }
}

function excluirCategoriaFinanceira(id) {
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

function salvarCategoriaFinanceiraNoBancoDeDados(categoria) {
    fetch('/api/financeiro/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoria)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Categoria salva com sucesso:', data);
        alert('Categoria financeira salva com sucesso!');
        // Aqui você pode adicionar código para atualizar a interface
    })
    .catch(error => {
        console.error('Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria financeira.');
    });
}

// Função para salvar a edição da categoria
function atualizarCategoriaFinanceira() {
    const id = document.getElementById('idCategoriaFinanceira').value;
    const nome = document.getElementById('nomeEditarCategoriaFinanceira').value;
    const descricao = document.getElementById('descricaoEditarCategoriaFinanceira').value;
    const tipo = document.querySelector('input[name="tipoEditarCategoriaFinanceira"]:checked').value;
    const cor = document.getElementById('corEditarCategoriaFinanceira').value;

    fetch(`/api/financeiro/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nome,
            tipo: tipo,
            descricao: descricao,
            cor: cor
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('Categoria atualizada com sucesso!');
        fecharModalSecundario();
        gerarTabelaCategoriasFinanceiras(); // Atualizar a tabela
    })
    .catch(error => {
        console.error('Erro ao atualizar categoria:', error);
        alert('Erro ao atualizar categoria.');
    });
}

