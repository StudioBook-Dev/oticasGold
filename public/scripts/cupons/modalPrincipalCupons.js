function abrirModalCupons() {
    // Abrir o modal primeiro com mensagem de carregamento
    abrirModalPrincipal({
        titulo: 'Cupons',
        conteudo: '<div id="lista-cupons">Carregando cupons...</div>',
        adicionar: true
    });

    // Obter os cupons
    getCupons()
        .then(cupons => {
            // Gerar HTML dos cupons
            const htmlCupons = gerarTabelaCupons(cupons);
            // Atualizar o conteúdo do modal
            document.getElementById('lista-cupons').innerHTML = htmlCupons;
        })
        .catch(error => {
            console.error('Erro ao carregar cupons:', error);
            document.getElementById('lista-cupons').innerHTML = 'Erro ao carregar cupons.';
        });
}

// Função para gerar o HTML dos cupons
function gerarTabelaCupons(cupons) {
    if (!cupons || cupons.length === 0) {
        return '<p>Nenhum cupom encontrado.</p>';
    }

    // Criar o botão de adicionar
    let html = ``;

    // Criar a tabela
    html += '<table class="tabela-modal" id="tabelaCupons">';
    html += '<thead><tr>';
    html += '<th>Ações</th>';
    html += '<th>Nome</th>';
    html += '<th>Valor</th>';
    html += '<th>Tipo</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    // Exibir cada cupom
    cupons.forEach(cupom => {
        const id = cupom.id || '';
        const nome = cupom.nome || '';
        let valor = cupom.valor || 0;
        const tipo = cupom.tipo || '';
        
        // Formatar o valor corretamente
        if (tipo === 'percentual') {
            valor = `${valor}%`;
        } else {
            valor = `R$ ${valor.toFixed(2).replace('.', ',')}`;
        }

        html += `<tr>`;
        html += `<td>
            <div class="acoes-container">
                <button class="btn-acao btn-editar" title="Editar" 
                onclick="editarCupom('${id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn-acao btn-excluir" title="Excluir"
                onclick="excluirItem('cupons', '${id}')">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>`;
        html += `<td>${nome}</td>`;
        html += `<td>${valor}</td>`;
        html += `<td>${tipo === 'percentual' ? 'Percentual' : 'Absoluto'}</td>`;
        html += `</tr>`;
    });

    html += '</tbody></table>';
    return html;
}

// Função para filtrar cupons
function filtrarCupons() {
    const input = document.getElementById('searchCupom');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('tabelaCupons');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let encontrado = false;
        
        for (let j = 0; j < td.length - 1; j++) {
            const txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                encontrado = true;
                break;
            }
        }
        
        tr[i].style.display = encontrado ? '' : 'none';
    }
} 