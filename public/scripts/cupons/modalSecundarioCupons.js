

function abrirModalSecundarioCupons() {
    abrirModalSecundario({
        titulo: 'Adicionar Novo Cupom',
        conteudo:`
        <div class="form-container">
            <form id="formCupom" onsubmit="event.preventDefault(); 
                constructPostCupom();">
                <div class="form-group">
                    <label for="nomeCupom">Nome</label>
                    <input type="text" id="nomeCupom" name="nomeCupom" class="form-control" required 
                    value="">
                </div>
                
                <div class="form-group">
                    <label for="valorCupom">Valor</label>
                    <input type="number" id="valorCupom" name="valorCupom" step="0.01" class="form-control" required 
                    value="">
                </div>
                
                <div class="form-group">
                    <label>Tipo de Desconto</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" 
                            value="absoluto"> Absoluto (R$)
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" 
                            value="percentual"> Percentual (%)
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
function constructPostCupom() {
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

    postCupom(cupom);
} 