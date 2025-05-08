/**
 * Exemplo de uso das funções do editarCarrinho.js e editarPedido.js
 * com a nova abordagem de passar dados via objeto
 */

// Exemplo 1: Adicionando produtos ao carrinho
function exemploAdicionarProduto() {
    // Estrutura de dados centralizada
    const dados = {
        produtosCarrinho: [],
        valorFrete: 10.00,
        valorDesconto: 5.00,
        pedidoOriginal: { id: 123, status: 'Em andamento' },
        modoEdicaoPedido: true
    };
    
    // Chamar a função passando o objeto dados
    const dadosAtualizados = adicionarAoCarrinhoEditando(dados);
    
    // Os dados retornados contêm o estado atualizado
    console.log('Produtos no carrinho após adição:', dadosAtualizados.produtosCarrinho);
    
    // Atualizar a referência global para handlers de eventos
    window.currentDados = dadosAtualizados;
}

// Exemplo 2: Remover item do carrinho
function exemploRemoverItem(index) {
    // Obter os dados atuais
    const dados = window.currentDados || {
        produtosCarrinho: [],
        valorFrete: 0,
        valorDesconto: 0
    };
    
    // Chamar a função passando o objeto dados
    const dadosAtualizados = removerItemDoCarrinho(index, dados);
    
    // Atualizar a referência global para handlers de eventos
    window.currentDados = dadosAtualizados;
}

// Exemplo 3: Sobrescrever função de adicionar ao carrinho
function exemploSobrescreverFuncao() {
    // Obter ou criar os dados
    const dados = window.currentDados || {
        produtosCarrinho: [],
        valorFrete: 0,
        valorDesconto: 0,
        modoEdicaoPedido: true
    };
    
    // Configurações adicionais
    const config = {
        funcaoSobrescrita: false // forçar sobrescrita mesmo se já foi feita
    };
    
    // Chamar a função passando o objeto dados e configuração
    const dadosAtualizados = sobrescreverFuncaoAdicionarAoCarrinho(dados, config);
    
    // A função retorna os dados atualizados com informações adicionais
    console.log('Função sobrescrita:', dadosAtualizados.funcaoSobrescrita);
    
    // Atualizar a referência global para handlers de eventos
    window.currentDados = dadosAtualizados;
}

// Exemplo 4: Reconfigurar botões do carrinho
function exemploReconfigurarBotoes() {
    // Obter os dados atuais
    const dados = window.currentDados;
    
    if (!dados) {
        console.error('Dados não disponíveis para reconfigurar botões');
        return;
    }
    
    // Chamar a função passando o objeto dados
    const dadosAtualizados = reconfigurarBotoesCarrinho(dados);
    
    // Atualizar a referência global para handlers de eventos
    window.currentDados = dadosAtualizados;
}

// Exemplo 5: Editar um pedido existente
async function exemploEditarPedido(idPedido) {
    // A função editarPedido foi refatorada para usar objeto de dados
    // e não mais variáveis globais window
    await editarPedido(idPedido);
    
    // Após a execução, window.currentDados contém todos os dados do pedido
    console.log('Dados do pedido em edição:', window.currentDados);
}

/**
 * Notas importantes sobre a refatoração:
 * 
 * 1. As funções agora recebem um objeto 'dados' e retornam a versão atualizada desse objeto
 * 2. A variável global window.currentDados é mantida para compatibilidade com handlers de eventos
 * 3. Todas as funções devem atualizar window.currentDados após a execução
 * 4. Os handlers de eventos inline (onClick) agora passam window.currentDados como parâmetro
 */ 