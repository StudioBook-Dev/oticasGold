// Função para abrir o modal de frete
function abrirModalFrete() {
    // Obter o valor do frete atual (se existir)
    const freteAtual = window.valorFrete || 0;
    const freteFormatado = freteAtual.toFixed(2).replace('.', ',');
    
    const conteudoHTML = `
        <form id="form-frete" class="form-modal-secundario form-frete">
            <div class="acoes-modal acoes-modal-rodape">
                <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="fecharModalSecundario()">Cancelar</button>
                <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="salvarFrete()">Salvar</button>
            </div>
            <br>
            <div class="campo-formulario">
                <label for="valor-frete"></label>
                <input type="text" id="valor-frete" name="valor-frete" value="${freteFormatado}" 
                       placeholder="0,00" autocomplete="off">
            </div>
        </form>
    `;
    
    abrirModalSecundario({
        titulo: 'Adicionar Frete',
        conteudo: conteudoHTML
    });
}



// Função para atualizar a exibição do carrinho com o frete
function atualizarExibicaoCarrinhoComFrete() {
    // Se tiver um cupom aplicado, usar a função específica
    if (window.cupomAplicado) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
    } else {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
    }
}



// Função para salvar o frete ao pedido
function salvarFrete() {
    const inputFrete = document.getElementById('valor-frete');
    
    if (!inputFrete) {
        console.error('Elemento de input do frete não encontrado');
        return;
    }
    
    let valorFrete = inputFrete.value.replace(',', '.');
    valorFrete = parseFloat(valorFrete);
    
    if (isNaN(valorFrete) || valorFrete < 0) {
        alert('Por favor, informe um valor de frete válido.');
        return;
    }
    
    // Armazenar o valor do frete globalmente
    window.valorFrete = valorFrete;
    
    // Atualizar a exibição do carrinho
    atualizarExibicaoCarrinhoComFrete();
    
    // Fechar o modal
    fecharModalSecundario();
    
    console.log(`Frete adicionado: R$ ${valorFrete.toFixed(2)}`);
}

// Função para atualizar a exibição do carrinho com o frete
function atualizarExibicaoCarrinhoComFrete() {
    // Se tiver um cupom aplicado, usar a função específica
    if (window.cupomAplicado) {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(window.cupomAplicado);
    } else {
        document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinho();
    }
}

// Substituir a função de abrir frete no arquivo botoesIcones.js
function abrirFrete() {
    abrirModalFrete();
}
