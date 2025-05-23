

function incrementarContador(id) {
    // Encontra o elemento do contador para o produto com o ID específico
    const tr = document.getElementById(`produto-${id}`);
    if (!tr) {
        console.error(`Linha do produto ${id} não encontrada`);
        return;
    }
    const contadorElement = tr.querySelector('.contador-valor');
    if (!contadorElement) {
        console.error(`Elemento contador para produto ${id} não encontrado`);
        return;
    }
    // Obtém o valor atual e converte para número
    let valorAtual = parseInt(contadorElement.textContent);
    // Obtém o valor máximo (estoque) do atributo max
    const estoqueMaximo = parseInt(contadorElement.getAttribute('max'));
    // Só incrementa se o valor atual for menor que o estoque disponível
    if (valorAtual < estoqueMaximo) {
        // Incrementa o valor
        valorAtual++;
        // Atualiza o texto do contador
        contadorElement.textContent = valorAtual;
    } else {
        // Alerta o usuário que o limite de estoque foi atingido
        alert(`Não é possível adicionar mais unidades. Estoque disponível: ${estoqueMaximo}`);
    }
}


function decrementarContador(id) {
    // Encontra o elemento do contador para o produto com o ID específico
    const tr = document.getElementById(`produto-${id}`);
    if (!tr) {
        console.error(`Linha do produto ${id} não encontrada`);
        return;
    }
    const contadorElement = tr.querySelector('.contador-valor');
    if (!contadorElement) {
        console.error(`Elemento contador para produto ${id} não encontrado`);
        return;
    }
    // Obtém o valor atual e converte para número
    let valorAtual = parseInt(contadorElement.textContent);
    // Decrementa o valor, mas não permite que seja menor que 0
    if (valorAtual >= 1) {
        valorAtual = 1;
    }if (valorAtual > 1){
        valorAtual--;
        // Atualiza o texto do contador
        contadorElement.textContent = valorAtual;
    }
}




