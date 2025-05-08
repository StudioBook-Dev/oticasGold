

// Array para armazenar os produtos do carrinho
let produtosCarrinho = [];

function abrirModalPrincipalPedidos() {
    fecharModalSecundario()
    abrirModalPrincipal({
        titulo: 'Lançamento de Vendas',
        conteudo: '<div id="lista-produtos">Carregando produtos...</div>',
        adicionar: false
    });
    // Obter os produtos e exibi-los no console
    getProdutos()
        .then(produtos => {
            // Exibir informações de cada produto em texto no console
            produtos.forEach((produto, index) => {
                if (!produto.id && !produto.nome) return; // Ignora produtos vazios
            });
            // Gerar HTML dos produtos
            const htmlModal = conteudoModalVendas(produtos);
            // Atualizar o conteúdo do modal
            document.getElementById('lista-produtos').innerHTML = htmlModal;
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
            document.getElementById('lista-produtos').innerHTML = 'Erro ao carregar produtos.';
        });
}



function conteudoModalVendas(produtos) {
    const tabela = gerarTabelaModalPedidos(produtos);
    const carrinhoHTML = htmlCarrinho();

    let html = `
    <div class="container-duas-colunas">
        <div class="coluna-produtos">
            ${tabela}
        </div>
    
        <button class="btn-carrinho-colunas" onclick="adicionarAoCarrinho()">
            <i class="fas fa-shopping-cart"></i>
        </button>
    
        <div class="coluna carrinho">
            ${carrinhoHTML}
        </div>
    </div>
    `
    return html;
}



function gerarTabelaModalPedidos(produtos) {
    // console.log(produtos);

    let tabela = `
        <table class="tabela-modal tabela-modal-vendas">
        <thead><tr>
        <th class="coluna-acoes"></th>
        <th class="coluna-nome"></th>
        <th class="coluna-preco"></th>
        <th class="coluna-contadores"></th>
        </tr></thead>
        <tbody class="modal-conteudo">
    `
    // Verificar cada produto e exibir seus dados
    produtos.forEach((produto, index) => {
        // Garantir que todos os campos existam para evitar erros
        const id = produto.id !== undefined && !isNaN(produto.id) ? produto.id : index + 1;
        const nome = typeof produto.nome === 'string' ? produto.nome : '';
        const descricao = typeof produto.descricao === 'string' ? produto.descricao : '';
        // Garantir que preço seja um número válido
        let preco = 0;
        if (produto.preco !== undefined && !isNaN(parseFloat(produto.preco))) {
            preco = parseFloat(produto.preco);
        }
        // Garantir que estoque seja um número válido
        let estoque = 0;
        if (produto.estoque !== undefined && !isNaN(parseInt(produto.estoque))) {
            estoque = parseInt(produto.estoque);
        }
        // Pular produtos com estoque zero
        if (estoque === 0) {
            return;
        }
        // Formatar valores para exibição
        const precoFormatado = `R$ ${preco.toFixed(2).replace('.', ',')}`;

        tabela += `
            <tr id="produto-${id}">
            <td class="coluna-acoes">
                <div class="acoes-container">
                    <input type="radio" name="produto" id="input-produto-${id}">
                </div>
            </td>
            <td class="coluna-nome">${nome}</td>
            <td class="coluna-preco">${precoFormatado}</td>
            <td class="coluna-contadores">
                <div class="contador-container">
                    <button class="btn-contador" onclick="decrementarContador(${id})" >-</button>
                    <span class="contador-valor" min="1" max="${estoque}">1</span>
                    <button class="btn-contador" onclick="incrementarContador(${id})">+</button>
                </div>
            </td>
        `
    });
    tabela += '</tbody></table>';

    return tabela;
}







