

function abrirModalFinanceiro() { 
    abrirModalPrincipal({
        titulo: 'Financeiro',
        conteudo: `<div id="modalTransacoesFinanceiras"> Carregando Financeiro...</div>`,
        adicionar: `
        <button class="modal-adicionar" 
            onclick="abrirModalSecundarioCategoriasFinanceiras()">
            <i class="fas fa-plus"></i>
            <span>Adicionar</span>
        </button> `
    });
    gerarTabelaCategoriasFinanceiras();
}


// Função para listar as categorias financeiras em uma tabela
async function gerarTabelaCategoriasFinanceiras() {
    const categorias = await getCategoriasFinanceiras();
    const html = document.getElementById('modalTransacoesFinanceiras');

    if (categorias.length === 0) {
        conteudo = '<b>Nenhuma categoria encontrada</b>';
    } 

    conteudo = `
    <table class="tabela-categorias">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Cor</th>
            <th>Saldo</th>
        </tr>
        </thead>
        <tbody class="modal-conteudo">`;
        categorias.forEach(categoria => {
            conteudo += ` 
            <tr>
                <td class="acoes">
                    <button class="btn-editar" 
                        onclick="editarCategoriaFinanceira('${categoria.id}')">Editar</button>
                    <button class="btn-excluir" 
                        onclick="deleteCategoriaFinanceira('${categoria.id}')">Excluir</button>
                </td>
                <td>${categoria.nome}</td>
                <td>${categoria.tipo}</td>
                <td>${categoria.descricao || '-'}</td>
                <td>
                    <div class="amostra-cor" style="background-color: ${categoria.cor}"></div>
                </td>
                <td>R$ ${Number(categoria.saldo).toFixed(2)}</td>
            </tr> `
        });

    conteudo += '</tbody></table>'
    html.innerHTML = conteudo;
}






