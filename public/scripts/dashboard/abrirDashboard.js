
function abrirDashboard(){
    setTelaAtualLocalStorage('dashboard');
    const dashboard = document.querySelector('.dashboard');
    const kanban = document.querySelector('.kanban');
    dashboard.classList.remove('desativado');
    kanban.classList.add('desativado');
    
    // Modificar o título e adicionar os botões de exportação
    const tituloContainer = dashboard.querySelector('h1');
    if (tituloContainer) {
        tituloContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <span>Dashboard</span>
                <div class="botoes-exportacao">
                    <button class="botao-exportar" onclick="exportarTransacoes()">Exportar CSV</button>
                    <button class="botao-imprimir" onclick="imprimirDashboard()">Imprimir Relatório</button>
                </div>
            </div>
        `;
    }
    
    // Inicializar o dashboard financeiro
    inicializarDashboardFinanceiro();
}


