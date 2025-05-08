

async function getCategorias() {
    // console.log("Iniciando carregamento de categorias...");

    // Verificar se já temos categorias no localStorage
    const categoriasCache = localStorage.getItem('categorias');
    if (categoriasCache) {
        const categorias = JSON.parse(categoriasCache);
        // console.log(`Retornando ${categorias.length} categorias do cache`);
        return categorias;
    }

    try {
        // Usar a API SQLite para buscar categorias
        const response = await fetch('/api/categorias');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar categorias: ${response.status}`);
        }
        
        const categorias = await response.json();
        
        // Salvar no localStorage
        // console.log(categorias);
        
        return categorias;
        
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        return [];
    }
}


