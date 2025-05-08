// Definindo os itens do menu
const itensMenu = [
    { nome: 'Produtos', icone: 'fas fa-box', onClick: 'abrirModalProdutos()' },
    { nome: 'Categorias', icone: 'fas fa-tags', onClick: 'abrirModalCategorias()' },
    { nome: 'Clientes', icone: 'fas fa-users', onClick: 'abrirModalClientes()' },
    { nome: 'Cupons', icone: 'fas fa-ticket-alt', onClick: 'abrirModalCupons()' },
    { nome: 'Estoque', icone: 'fas fa-warehouse', onClick: 'abrirModalEstoque()' },
    { nome: 'Financeiro', icone: 'fas fa-chart-line', onClick: 'abrirModalFinanceiro()' },
    { nome: 'Configurações', icone: 'fas fa-cog', onClick: 'abrirModalConfiguracoes()' },
];

function abrirMenuLateral() {
    const menuLateral = document.querySelector('.menuLateral');

    if (menuLateral) {
        let html = `
            <div class="menu-header">
                <button class="fechar-menu" onclick="fecharMenuLateral()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="menu-conteudo">
        `;
        html += itensMenu.map(item => `
            <a href="#" onclick="${item.onClick}" class="menu-item">
                <i class="${item.icone}"></i>
                ${item.nome}
            </a>
        `).join('');

        html += '</div>'; // Fecha a div menu-conteudo

        menuLateral.innerHTML = html;
        menuLateral.classList.add('menu-aberto');

        // Adiciona o overlay para fechamento do menu
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.id = 'menuOverlay';
        overlay.onclick = fecharMenuLateral;
        document.body.appendChild(overlay);

        // Ativa o overlay após um pequeno delay
        setTimeout(() => {
            overlay.classList.add('ativo');
        }, 10);
    }
}


function fecharMenuLateral() {
    const menuLateral = document.querySelector('.menuLateral');
    const overlay = document.getElementById('menuOverlay');

    if (menuLateral) {
        menuLateral.classList.remove('menu-aberto');
    }

    if (overlay) {
        overlay.classList.remove('ativo');

        // Remove o overlay após a animação
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}




