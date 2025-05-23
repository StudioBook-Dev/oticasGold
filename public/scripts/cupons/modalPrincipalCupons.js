

function abrirModalCupons() {
    // Abrir o modal primeiro com mensagem de carregamento
    abrirModalPrincipal({
        titulo: 'Cupons',
        conteudo: '<div id="lista-cupons">Carregando cupons...</div>',
        adicionar: `
        <button class="modal-adicionar" 
            onclick="abrirModalSecundarioCupons()">
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
        </button> `
    });
    gerarTabelaCupons()
}


async function gerarTabelaCupons() {
    const cupons = await getCupons()
    const html = document.getElementById('lista-cupons')

    if (!cupons || cupons.length === 0) {
        return '<p>Nenhum cupom encontrado.</p>';
    }

    let conteudo = `
    <table class="tabela-modal" id="tabelaCupons">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tipo</th>
        </tr>
    </thead>
    <tbody>`
    cupons.forEach(cupom => {
        let valor = 0
        if (cupom.tipo === 'percentual') {
            valor = `${cupom.valor}%`;
        } else {
            valor = `R$ ${cupom.valor.toFixed(2).replace('.', ',')}`;
        }
        conteudo += `
        <tr>
            <td>
                <div class="acoes-container">
                    <button class="btn-acao btn-editar" title="Editar" 
                    onclick="editarCupom('${cupom.id}')">
                    <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn-acao btn-excluir" title="Excluir"
                    onclick="excluirItem('cupons', '${cupom.id}')">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
            <td>${cupom.nome}</td>
            <td>${valor}</td>
            <td>${cupom.tipo === 'percentual' ? 'Percentual' : 'Absoluto'}</td>
        </tr>`
    });

    conteudo += '</tbody></table>'
    html.innerHTML = conteudo
}
