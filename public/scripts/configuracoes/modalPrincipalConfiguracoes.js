

function abrirModalConfiguracoes() {
    abrirModalPrincipal({
        titulo: 'Configurações',
        conteudo: `
        <div class="body-configuracoes" style="display: flex;">
            <div class="botoes-configuracoes">
                    <button class="botao-config" onclick="abrirModalExcluir('cupons')">Excluir Cupons</button>
                    <button class="botao-config" onclick="abrirModalExcluir('categorias')">Excluir Categorias</button>
                    <button class="botao-config" onclick="abrirModalExcluir('estoque')">Excluir Estoque</button>
                    <button class="botao-config" onclick="abrirModalExcluir('produtos')">Excluir Produtos</button>
                    <button class="botao-config" onclick="abrirModalExcluir('pedidos')">Excluir Pedidos</button>
                    <button class="botao-config" onclick="abrirModalExcluir('clientes')">Excluir Clientes</button>
                    <button class="botao-config" onclick="abrirModalExcluir('transacoesFinanceiras')">Excluir Transações Financeiras</button>
                </div>
        </div>`,
        adicionar: false
    });
}

function abrirModalExcluir(tabela) {
    const parametro = {
        titulo: `Excluir Base de dados ${tabela}`,
        conteudo: `
            <div class="modal-excluir-conteudo">
                <p>Tem certeza que deseja excluir todos os itens da tabela ${tabela}?</p>
                <div class="botoes-modal-excluir">
                    <button class="botao-confirmar" onclick="excluirTodosItens('${tabela}')">Confirmar</button>
                    <button class="botao-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </div>
        `
    };
    abrirModalSecundario(parametro);
}



