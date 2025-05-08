function editarCategoria(id) {
    getCategorias()
        .then(categorias => {
            categorias.forEach(categoria => {
                if (String(categoria.id) === String(id)) {
                    abrirModalSecundarioCategorias(categoria);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar categorias:', error);
        });
} 