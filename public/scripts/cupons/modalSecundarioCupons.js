function abrirModalSecundarioCupons(cupom) {
    const html = htmlModalSecundarioCupom(cupom);
    abrirModalSecundario({
        titulo: cupom ? 'Editar Cupom' : 'Adicionar Novo Cupom',
        conteudo: html
    });
}

function htmlModalSecundarioCupom(cupom) {
    // Função auxiliar para tratar valores undefined ou nulos
    const getValorSeguro = (valor) => {
        if (valor === undefined || valor === null || valor === 'undefined') {
            return '';
        }
        return valor;
    };

    // Adicionar campo oculto para ID se estiver editando
    const campoId = cupom ? `<input type="hidden" id="cupomId" name="cupomId" value="${cupom.id}">` : '';
    
    // Determinar qual tipo de valor está selecionado
    const tipoAbsolutoChecked = !cupom || cupom.tipo !== 'percentual' ? 'checked' : '';
    const tipoPercentualChecked = cupom && cupom.tipo === 'percentual' ? 'checked' : '';

    const html = `
        <div class="form-container">
            <form id="formCupom" onsubmit="event.preventDefault(); salvarCupomDoFormulario();">
                ${campoId}
                <div class="form-group">
                    <label for="nomeCupom">Nome</label>
                    <input type="text" id="nomeCupom" name="nomeCupom" class="form-control" required value="${getValorSeguro(cupom?.nome)}">
                </div>
                
                <div class="form-group">
                    <label for="valorCupom">Valor</label>
                    <input type="number" id="valorCupom" name="valorCupom" step="0.01" class="form-control" required value="${getValorSeguro(cupom?.valor)}">
                </div>
                
                <div class="form-group">
                    <label>Tipo de Desconto</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" value="absoluto" ${tipoAbsolutoChecked}>
                            Absoluto (R$)
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="tipoCupom" value="percentual" ${tipoPercentualChecked}>
                            Percentual (%)
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Salvar</button>
                    <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </form>
        </div>
    `;

    return html;
}

// Função para salvar os dados do formulário
function salvarCupomDoFormulario() {
    const id = document.getElementById('cupomId')?.value || '';
    const nome = document.getElementById('nomeCupom').value;
    const valor = document.getElementById('valorCupom').value;
    const tipoElements = document.getElementsByName('tipoCupom');
    let tipo = 'absoluto'; // Valor padrão

    // Obter o tipo selecionado
    for (let i = 0; i < tipoElements.length; i++) {
        if (tipoElements[i].checked) {
            tipo = tipoElements[i].value;
            break;
        }
    }

    // Validar campos obrigatórios
    if (!nome.trim()) {
        alert('O nome do cupom é obrigatório.');
        return;
    }

    if (!valor || isNaN(parseFloat(valor))) {
        alert('O valor do cupom deve ser um número válido.');
        return;
    }

    const cupom = {
        id: id,
        nome: nome,
        valor: parseFloat(valor),
        tipo: tipo
    };

    // Salvar cupom na planilha
    salvarCupomNaPlanilha(cupom.id ? cupom : null);
} 