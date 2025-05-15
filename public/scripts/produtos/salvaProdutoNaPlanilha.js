

// Função para salvar o produto do formulário
function enviaNovoProdutoPara_Salvar() {
    const produto = {
        id: gerarId(),
        nome: getInputValue('nome'),
        descricao: getInputValue('descricao'),
        codigoInterno: getInputValue('codigoInterno'),
        codigoExterno: getInputValue('codigoExterno'),
        preco: getInputValue('preco'),
        estoque: getInputValue('estoque'),
        categoria: getInputValue('categoria'),
        dataCriacao: dataFormatada().data
    };
    console.log(produto)
    salvarProdutoNovo_noBancoDeDados(produto)
    fecharModalSecundario()
    abrirModalProdutos()
    hubAtualizarEstoque_Automatico(produto, 'criação de produto')
}





async function salvarProdutoNovo_noBancoDeDados(produto) {
    try {
        let response;
        response = await fetch('/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(produto)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Erro ao salvar produto: ${response.status}`);
        }
        // Mostrar notificação de sucesso
        mostrarNotificacao('Produto salvo com sucesso!', 'sucesso');
        return true;
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        mostrarNotificacao(error.message || 'Erro ao salvar o produto.', 'erro');
        return false;
    }
}
