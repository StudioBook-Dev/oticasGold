// Função para abrir o modal de observação
function abrirObservacao() {
    // Obter a observação atual (se existir)
    const observacaoAtual = window.observacaoPedido || '';
    
    const conteudoHTML = `
        <form id="form-observacao" class="form-modal-secundario">
            <div class="campo-formulario">
                <label for="observacao">Observação do Pedido:</label>
                <textarea id="observacao" name="observacao" placeholder="Digite uma observação para o pedido" rows="4">${observacaoAtual}</textarea>
            </div>
            <div class="acoes-modal acoes-modal-rodape">
                <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="fecharModalSecundario()">Cancelar</button>
                <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="salvarObservacao()">Salvar</button>
            </div>
        </form>
    `;
    
    abrirModalSecundario({
        titulo: 'Adicionar Observação',
        conteudo: conteudoHTML
    });
}

// Função para salvar observação no objeto global
function salvarObservacao() {
    const observacao = document.getElementById('observacao').value;
    
    // Armazenar a observação globalmente para ser usada ao finalizar o pedido
    window.observacaoPedido = observacao.trim();
    
    if (window.observacaoPedido) {
        console.log("Observação salva:", window.observacaoPedido);
    } else {
        console.log("Observação removida");
        window.observacaoPedido = "";
    }
    
    fecharModalSecundario();
}
