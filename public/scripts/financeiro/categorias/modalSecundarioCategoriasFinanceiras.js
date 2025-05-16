

function abrirModalSecundarioFinanceiro() {
    abrirModalSecundario({
        titulo: 'Lançamento de Transações Financeiras',
        conteudo: `
            <div class="opcoes-financeiro" onsubmit="event.preventDefault(); criarCategoriaFinanceira();">
                <form id="formCategoriaFinanceira">
                    <div class="form-group">
                        <label for="nomeCategoriaFinanceira">Nome</label>
                        <input type="text" id="nomeCategoriaFinanceira" class="form-control form-control-full" required>
                    </div>
                    <div class="form-group">
                        <label for="descricaoCategoriaFinanceira">Descrição</label>
                        <textarea id="descricaoCategoriaFinanceira" class="form-control form-control-full"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <div class="tipo-container">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="tipoCategoriaFinanceira" id="tipoDespesa" value="despesa" checked>
                                <label class="form-check-label" for="tipoDespesa">Despesa</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="tipoCategoriaFinanceira" id="tipoReceita" value="receita">
                                <label class="form-check-label" for="tipoReceita">Receita</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="corCategoriaFinanceira">Cor</label>
                        <input type="color" id="corCategoriaFinanceira" class="form-control color-picker" value="#3498db">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-salvar">Salvar</button>
                        <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                    </div>
                </form>
            </div>
        `
    });  
}

function criarCategoriaFinanceira() {
    const nome = document.getElementById('nomeCategoriaFinanceira').value;
    const descricao = document.getElementById('descricaoCategoriaFinanceira').value;
    const tipo = document.querySelector('input[name="tipoCategoriaFinanceira"]:checked').value;
    const cor = document.getElementById('corCategoriaFinanceira').value;

    let categoria = {
        id: gerarId(),
        nome: nome,
        tipo: tipo,
        descricao: descricao,
        icone: '',
        cor: cor,
        saldo: 0
    }

    console.log(categoria);
    postCategoriaFinanceira(categoria);
    fecharModalSecundario();
    abrirModalFinanceiro();
}




