

function converterParaNumero(valor) {
    // Se já for um número, retorna o próprio valor
    if (typeof valor === 'number') {
        return valor;
    }
    // Se for valor vazio, nulo ou indefinido, retorna zero
    if (!valor) {
        return 0;
    }
    // Tratamento para valores em formato de string
    if (typeof valor === 'string') {
        try {
            // Remove símbolos de moeda (R$), pontos de milhar, espaços, etc
            let valorLimpo = valor.replace(/[^\d,.-]/g, '');
            
            // Converte vírgula decimal para ponto (padrão brasileiro para internacional)
            valorLimpo = valorLimpo.replace(',', '.');
            
            // Converte para número e verifica se é válido
            const numero = parseFloat(valorLimpo);
            
            // Retorna o número ou zero se for inválido (NaN)
            return isNaN(numero) ? 0 : numero;
        } catch (erro) {
            console.error("Erro ao converter valor para número:", erro);
            return 0;
        }
    }
    // Para qualquer outro tipo de dado, retorna zero
    return 0;
}


/**
 * Formata um valor para exibição como moeda brasileira (R$)
 * @param {number|string} valor - Valor a ser formatado
 * @param {string} valorPadrao - Valor padrão caso seja nulo/indefinido
 * @returns {string} Valor formatado como moeda
 */
function formatarValorMonetario(valor, valorPadrao = 'R$ 0') {
    // Se não houver valor, retorna o valor padrão
    if (!valor && valor !== 0) {
        return valorPadrao;
    }
    // Se já for um número, usa o toLocaleString para formatação brasileira
    if (typeof valor === 'number') {
        return valor.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }
    // Se for string ou outro tipo, tenta converter para número primeiro
    try {
        const valorNumerico = converterParaNumero(valor);
        return valorNumerico.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    } catch (erro) {
        // Em caso de erro, retorna o valor original com prefixo R$
        return `R$ ${valor}`;
    }
}

