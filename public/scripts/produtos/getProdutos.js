
// Função principal para carregar produtos da API
async function getProdutos() {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status} ${response.statusText}`);
        }
        const produtos = await response.json();
        
        if (produtos && Array.isArray(produtos)) {
            // Processar produtos
            const produtosProcessados = produtos.map(produto => {
                // Garantir que campos numéricos estejam em formato adequado
                return {
                    ...produto,
                    preco: parseFloat(produto.preco) || 0,
                    estoque: parseFloat(produto.estoque) || 0,
                };
            });
            return produtosProcessados;
        } else {
            console.error("Resposta inválida da API");
            return [];
        }
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);       
        return [];
    }
}


// Função principal para carregar produtos da API
async function getProduto(id) {
    try {
        const response = await fetch(`/api/produtos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status} ${response.statusText}`);
        }
        const produto = await response.json();
        return produto;
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);       
        return [];
    }
}






