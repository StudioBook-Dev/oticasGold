

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
    postProduto(produto)
    fecharModalSecundario()
    abrirModalProdutos()
    hubAtualizarEstoque_Automatico(produto, 'criação de produto')
}




