

// Função para abrir o modal de cupom
function modalCuponsParaPedido() {
    abrirModalSecundario({
        titulo: 'Selecionar Cupom',
        conteudo: `
            <form id="form-cupom" class="form-modal-secundario" >
                <div class="acoes-modal acoes-modal-cupons">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarCupomSelecionado()">
                        Cancelar
                    </button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarCupomSelecionado()"> 
                        Confirmar
                    </button>
                </div>
                <br><br>
                <div id="tabela-cupons"> </div>
            </form>`
    });
    gerarTabelaCuponsParaPedido();
}


// Função para carregar cupons e preencher a tabela
async function gerarTabelaCuponsParaPedido() {
    const cupons = await getCupons()
    const html = document.getElementById('tabela-cupons')

    if (!cupons || cupons.length === 0) {
        return '<p>Nenhum cupom encontrado.</p>';
    }

    let conteudo = `
    <table class="tabela-modal">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tipo</th>
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    cupons.forEach(cupom => {
        conteudo += `
            <tr>
                <td>
                    <input type="radio" name="cupom" value="${cupom.id}" id="cupom-${cupom.id}">
                </td>
                <td>${cupom.nome}</td>  
                <td>${cupom.valor}</td>
                <td>${cupom.tipo}</td>
            </tr>`;
    });

    conteudo += '</tbody></table>'
    html.innerHTML = conteudo
}


function aplicarCupomSelecionado() {
    const cupomSelecionado = document.querySelector('input[name="cupom"]:checked');
    if (!cupomSelecionado) {
        alert('Selecione um cupom para aplicar.');
        return;
    }
    const cupomId = cupomSelecionado.value;
    const cupomNome = cupomSelecionado.closest('tr').getElementsByTagName('td')[1].innerText;
    const cupomValor = cupomSelecionado.closest('tr').getElementsByTagName('td')[2].innerText;
    const cupomTipo = cupomSelecionado.closest('tr').getElementsByTagName('td')[3].innerText;
    
    const cupom = {
        id: cupomId,
        nome: cupomNome,
        valor: cupomValor,
        tipo: cupomTipo
    }
    localStorage.setItem("cupom", JSON.stringify(cupom));
    statusIconeNoModalPrincipalPedido('cupom', true)
    fecharModalSecundario();
    constructHtmlCarrinho()
}


function cancelarCupomSelecionado() {
    localStorage.removeItem("cupom");
    statusIconeNoModalPrincipalPedido('cupom', false)
    fecharModalSecundario();
    constructHtmlCarrinho()
}



