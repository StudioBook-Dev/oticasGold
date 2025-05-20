

// // Adicionar campo oculto para ID se estiver editando
// const campoId = cupom ? `<input type="hidden" id="cupomId" name="cupomId" value="${cupom.id}">` : '';

// // Determinar qual tipo de valor está selecionado
// const tipoAbsolutoChecked = !cupom || cupom.tipo !== 'percentual' ? 'checked' : '';
// const tipoPercentualChecked = cupom && cupom.tipo === 'percentual' ? 'checked' : ''

async function abrirModalSecundarioCupons(id) {
    const cupom = await getCupomById(id)
    abrirModalSecundario({
        titulo: 'Adicionar Novo Cupom',
        conteudo:`
        <div class="form-container">
            <form id="formCupom" onsubmit="event.preventDefault(); 
                constructPutCupom();">
                <input type="hidden" id="cupomId" name="cupomId" value="${cupom.id}">
                <div class="form-group">
                    <label for="nomeCupom">Nome</label>
                    <input type="text" id="nomeCupom" name="nomeCupom" class="form-control" required 
                    value="${cupom.nome}">
                </div>
                
                <div class="form-group">
                    <label for="valorCupom">Valor</label>
                    <input type="number" id="valorCupom" name="valorCupom" step="0.01" class="form-control" required 
                    value="${cupom.valor}">
                </div>
                
                <div class="form-group">
                    <label>Tipo de Desconto</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" 
                            value="absoluto" ${cupom.tipo === 'absoluto' ? 'checked' : ''}> Absoluto (R$)
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" 
                            value="percentual" ${cupom.tipo === 'percentual' ? 'checked' : ''}> Percentual (%)
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    `})
}
    

// Função para salvar os dados do formulário
function constructPutCupom() {
    const id = document.getElementById('cupomId')?.value || '';
    const nome = document.getElementById('nomeCupom').value;
    const valor = parseFloat(document.getElementById('valorCupom').value);
    const tipoElements = document.getElementsByName('tipoCupom');
    const tipo = tipoElements[0].checked ? 'absoluto' : 'percentual';

    const cupom = {
        id: id,
        nome: nome,
        valor: valor,
        tipo: tipo
    };

    putCupom(cupom);
} 