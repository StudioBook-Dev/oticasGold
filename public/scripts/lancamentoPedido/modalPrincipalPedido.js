

// Array para armazenar os produtos do carrinho
// let produtosCarrinho = [];

function abrirModalPrincipalPedidos() {
    fecharModalSecundario()
    abrirModalPrincipal({
        titulo: 'Lançamento de Pedido',
        conteudo: `
            <div class="container-duas-colunas">
                <div class="coluna-produtos" id="lista-produtos">
                    carregando produtos...
                </div>
                <button class="btn-carrinho-colunas" onclick="adicionarAoCarrinho()" 
                    title="Adicionar produto ao carrinho">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <div class="coluna carrinho" id="carrinho-produtos">
                    carregando carrinho...
                </div>
            </div> `,
        adicionar: `
            <div class="container-botoes-topo" style="display: flex; justify-content: space-between; align-items: center; max-width: 50%; gap: 1rem;">             
                <button class="botao-icone-lancamento" title="Adicionar cupom" onclick="abrirCupom()">
                    <i class="fas fa-ticket-alt"></i>
                </button>
                <button class="botao-icone-lancamento" title="Adicionar frete" onclick="abrirFrete()">
                    <i class="fas fa-truck"></i>
                </button>
                <button class="botao-icone-lancamento" title="Adicionar observação" onclick="abrirObservacao()">
                    <i class="fas fa-comment-alt"></i>
                </button>
                <button class="botao-icone-lancamento" title="Selecionar cliente" onclick="abrirCliente()">
                    <i class="fas fa-user"></i>
                </button>
                <button class="botao-icone-lancamento" title="Adicionar desconto" onclick="abrirDesconto()">
                    <i class="fas fa-cash-register"></i>
                </button>
            </div>
            `
    });
    gerarTabelaDeProdutosParaPedido();
}


async function gerarTabelaDeProdutosParaPedido() {
    const html = document.getElementById('lista-produtos');
    const produtos = await getProdutos();
    let conteudo = `
    <table class="tabela-modal tabela-modal-vendas">
        <thead><tr>
        <th class="coluna-acoes"></th>
        <th class="coluna-nome"></th>
        <th class="coluna-preco"></th>
        <th class="coluna-contadores"></th>
        </tr></thead>
        <tbody class="modal-conteudo">`
    produtos.forEach((produto) => {
        conteudo += `
            <tr id="produto-${produto.id}">
            <td class="coluna-acoes">
                <div class="acoes-container">
                    <input type="radio" name="produto" id="input-produto-${produto.id}">
                </div>
            </td>
            <td class="coluna-nome">${produto.nome}</td>
            <td class="coluna-preco">${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="coluna-contadores">
                <div class="contador-container">
                    <button class="btn-contador" 
                        onclick="decrementarContador(${produto.id})" 
                        title="Diminuir quantidade">
                        -
                    </button>
                    <input type="number" class="contador-valor" min="1" 
                    max="${produto.estoque}" value="1">
                    <button class="btn-contador" 
                        onclick="incrementarContador(${produto.id})"
                        title="Aumentar quantidade">
                        +
                    </button>
                </div>
            </td> `
    });
    conteudo += '</tbody></table>';

    html.innerHTML = conteudo;
}







