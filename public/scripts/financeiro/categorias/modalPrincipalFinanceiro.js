

function abrirModalFinanceiro() { 
    abrirModalPrincipal({
        titulo: 'Financeiro',
        conteudo: `
            <div id="modalTransacoesFinanceiras">
            </div>
        `,
        adicionar: true
    });
    gerarTabelaCategoriasFinanceiras();
}


// Função para listar as categorias financeiras em uma tabela
async function gerarTabelaCategoriasFinanceiras() {
    let conteudo = '';
    const categorias = await getCategoriasFinanceiras();
    const html = document.getElementById('modalTransacoesFinanceiras');
    if (categorias.length === 0) {
        conteudo = '<b>Nenhuma categoria encontrada</b>';
    } else {
        const style = styleTabelaCategoriasFinanceiras();
        conteudo = `
        <style>
            ${style}
        </style>
        <div class="lista-categorias-financeiras">
            <table class="tabela-categorias">
                <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Cor</th>
                            <th>Saldo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyCategoriasFinanceiras">
                        ${categorias.length === 0 ? 
                            '<tr><td colspan="6" class="text-center">Nenhuma categoria encontrada</td></tr>' : 
                            categorias.map(categoria => `
                                <tr>
                                    <td>${categoria.nome}</td>
                                    <td>${categoria.tipo}</td>
                                    <td>${categoria.descricao || '-'}</td>
                                    <td>
                                        <div class="amostra-cor" style="background-color: ${categoria.cor}"></div>
                                    </td>
                                    <td>R$ ${Number(categoria.saldo).toFixed(2)}</td>
                                    <td class="acoes">
                                        <button class="btn-editar" onclick="editarCategoriaFinanceira('${categoria.id}')">Editar</button>
                                        <button class="btn-excluir" onclick="deleteCategoriaFinanceira('${categoria.id}')">Excluir</button>
                                    </td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
            </table>
        </div>`;
    }
    html.innerHTML = conteudo;
}


function styleTabelaCategoriasFinanceiras() {
    return `
        .lista-categorias-financeiras {
            width: 100%;
            overflow-x: auto;
        }
        .tabela-categorias {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .tabela-categorias th, .tabela-categorias td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .tabela-categorias th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        .tabela-categorias tbody tr:hover {
            background-color: #f8f9fa;
        }
        .amostra-cor {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid #ddd;
        }
        .acoes {
            display: flex;
            gap: 5px;
        }
        .btn-editar, .btn-excluir, .btn-nova-categoria {
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            border: none;
            font-weight: 500;
        }
        .btn-editar {
            background-color: #3498db;
            color: white;
        }
        .btn-excluir {
            background-color: #e74c3c;
            color: white;
        }
        .btn-nova-categoria {
            background-color: #2ecc71;
            color: white;
            margin-top: 15px;
            padding: 8px 16px;
        }
        .acoes-lista {
            display: flex;
            justify-content: flex-end;
            margin-top: 15px;
        }
        .text-center {
            text-align: center;
        }
    `;
}



