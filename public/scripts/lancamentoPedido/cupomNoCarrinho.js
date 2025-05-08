// Arquivo cupomNoCarrinho.js - Gerencia funcionalidades de cupom no carrinho de compras

/**
 * Verifica se há um cupom aplicado ao carrinho atualmente
 * @returns {boolean} True se há um cupom aplicado, false caso contrário
 */
function temCupomAplicado() {
    return window.cupomAplicado ? true : false;
}

/**
 * Remove o cupom aplicado ao carrinho
 */
function removerCupomAplicado() {
    if (window.cupomAplicado) {
        console.log(`Cupom "${window.cupomAplicado.nome}" removido do carrinho`);
        window.cupomAplicado = null;
        
        // Atualizar a exibição do carrinho
        document.querySelector('.coluna.carrinho').innerHTML = 
            window.valorDesconto > 0 ? htmlCarrinhoComDesconto() : htmlCarrinho();
    }
}

/**
 * Calcula o valor do desconto do cupom aplicado ao carrinho
 * @param {number} subtotal - O subtotal do carrinho
 * @returns {number} O valor do desconto do cupom
 */
function calcularDescontoCupom(subtotal) {
    if (!window.cupomAplicado) return 0;
    
    let valorDesconto = 0;
    
    if (window.cupomAplicado.tipo === 'percentual') {
        valorDesconto = subtotal * (parseFloat(window.cupomAplicado.valor) / 100);
    } else {
        valorDesconto = parseFloat(window.cupomAplicado.valor);
    }
    
    return valorDesconto;
}

/**
 * Calcula o desconto total (manual + cupom)
 * @param {number} subtotal - O subtotal do carrinho
 * @returns {number} O valor do desconto total
 */
function calcularDescontoTotal(subtotal) {
    const descontoManual = window.valorDesconto || 0;
    const descontoCupom = calcularDescontoCupom(subtotal);
    
    return descontoManual + descontoCupom;
}

/**
 * Verifica se um cupom pode ser aplicado ao carrinho atual
 * @param {object} cupom - O cupom a ser verificado
 * @param {number} subtotal - O subtotal do carrinho
 * @returns {object} Um objeto com propriedades valido e mensagem
 */
function validarCupom(cupom, subtotal) {
    if (!cupom) {
        return { valido: false, mensagem: 'Cupom inválido' };
    }
    
    // Verificar se o cupom já está aplicado
    if (window.cupomAplicado && window.cupomAplicado.id === cupom.id) {
        return { valido: false, mensagem: 'Este cupom já está aplicado' };
    }
    
    // Verificar se o subtotal é suficiente para o cupom
    if (cupom.valorMinimo && subtotal < parseFloat(cupom.valorMinimo)) {
        return { 
            valido: false, 
            mensagem: `Valor mínimo não atingido (R$ ${parseFloat(cupom.valorMinimo).toFixed(2).replace('.', ',')})` 
        };
    }
    
    return { valido: true, mensagem: 'Cupom válido' };
}

/**
 * Atualiza a exibição do carrinho após adicionar ou remover um cupom
 */
function atualizarExibicaoCarrinhoAposCupom() {
    if (window.cupomAplicado) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
    } else if (window.valorDesconto > 0) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComDesconto();
    } else {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
    }
} 