

// function adicionarAoCarrinho() {
//     const itensPedido = []
//     // Encontrar o produto selecionado
//     const produtoSelecionado = document.querySelector('input[name="produto"]:checked');
//     if (!produtoSelecionado) {
//         alert('Por favor, selecione um produto primeiro.');
//         return;
//     }
    
//     // Obter o ID do produto e a quantidade
//     const produtoId = produtoSelecionado.id.replace('input-produto-', '');
//     const contador = document.querySelector(`#produto-${produtoId} .contador-valor`);
//     const quantidade = parseInt(contador.textContent);
//     if (quantidade === 0) {
//         alert('Por favor, selecione uma quantidade maior que zero.');
//         return;
//     }

//     // Obter informações do produto
//     const nome = document.querySelector(`#produto-${produtoId} .coluna-nome`).textContent;
//     const preco = document.querySelector(`#produto-${produtoId} .coluna-preco`).textContent;
//     // Criar objeto do item
//     const item = {
//         id: produtoId,
//         nome: nome,
//         quantidade: quantidade,
//         preco: preco
//     };
//     // Adicionar ao carrinho
//     itensPedido.push(item);
    
//     // Atualizar a exibição do carrinho
//     // Se houver um cupom aplicado, exibir com o cupom
//     if (window.cupomAplicado) {
//         document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
//     } else {
//         document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
//     }
    
//     // Limpar a seleção e o contador
//     produtoSelecionado.checked = false;
//     contador.textContent = '1';
//     // Exibir no console
//     // console.log('Produtos no carrinho:', itensPedido);
// }