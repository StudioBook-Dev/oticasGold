

// Função para inicializar o dashboard financeiro
async function inicializarDashboardFinanceiro() {
    const conteudoDashboard = document.getElementById('dashboard');

    const dadosFinanceiros = await calculaDadosFinanceiros(); 

    // Criar estrutura do dashboard financeiro com filtros
    conteudoDashboard.innerHTML = `
        <div class="dashboard-financeiro" 
            style="display: flex; gap: 1em; width: 100%; margin-left: -1em;">

            <div class="transacoes-recentes" 
                style="width: 17%; min-width: 300px; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 15px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #666666;">
                    Transações Recentes
                </h3>
                <div style="overflow-y: auto; max-height: 600px; width: 100%;">
                    <div id="lista-transacoes" style="margin-right: 10px;">
                        <!-- Os dados serão inseridos pelo JavaScript -->
                    </div>
                </div>
            </div>  

            <div class="graficos" style="width: 83%; flex-grow: 1;">
                <div class="indicadores-financeiros">
                    <div class="card-indicador" id="receitas-totais">
                        <h3 style="font-size: 14px; margin-bottom: 8px;">Receitas Totais</h3>
                        <p class="valor" style="font-size: 22px; margin: 5px 0;">R$ ${dadosFinanceiros.receitasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p class="variacao positiva" style="font-size: 12px;">+${dadosFinanceiros.variacaoReceitas.toFixed(2)}% <i class="fas fa-arrow-up"></i></p>
                    </div>
                    <div class="card-indicador" id="despesas-totais">
                        <h3 style="font-size: 14px; margin-bottom: 8px;">Despesas Totais</h3>
                        <p class="valor" style="font-size: 22px; margin: 5px 0;">R$ ${dadosFinanceiros.despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p class="variacao negativa" style="font-size: 12px;">-${dadosFinanceiros.variacaoDespesas.toFixed(2)}% <i class="fas fa-arrow-down"></i></p>
                    </div>
                    <div class="card-indicador" id="lucro-liquido">
                        <h3 style="font-size: 14px; margin-bottom: 8px;">Lucro Líquido</h3>
                        <p class="valor" style="font-size: 22px; margin: 5px 0;">R$ ${dadosFinanceiros.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        <p class="variacao positiva" style="font-size: 12px;">+${dadosFinanceiros.variacaoLucro.toFixed(2)}% <i class="fas fa-arrow-up"></i></p>
                    </div>
                </div>
                <div class="graficos-container" 
                    style="display: flex; gap: 2em; width: 100%; margin: 0px; padding-bottom: 0.5em;">
                    <div class="grafico-card" style="max-width: 50%;">
                        <h3>Receitas vs Despesas</h3>
                        <div class="grafico">
                            <canvas id="grafico-receitas-despesas"></canvas>
                        </div>
                    </div>
                    <div class="grafico-card" style="max-width: 50%;">
                        <h3>Fluxo de Caixa</h3>
                        <div class="grafico">
                            <canvas id="grafico-fluxo-caixa"></canvas>
                        </div>
                    </div>
                </div>
                <br>
                <div class="graficos-container" 
                style="display: flex; gap: 2em; width: 100%; margin: 0px; padding-top: 0.5em;">
                    <div class="grafico-card" style="width: 100%;">
                        <h3>Detalhamento de Receitas</h3>
                        <div class="grafico">
                            <canvas id="grafico-detalhe-receitas"></canvas>
                        </div>
                    </div>
                    <div class="grafico-card" style="width: 100%;">
                        <h3>Detalhamento de Despesas</h3>
                        <div class="grafico">
                            <canvas id="grafico-detalhe-despesas"></canvas>
                        </div>
                    </div>
                </div>
            </div> 

        </div>`;

    // Carregar os dados financeiros
    carregarDadosFinanceiros();
    // Ajustar tamanho dos gráficos
    ajustarTamanhoGraficos();
}

// Função para carregar os dados financeiros
function carregarDadosFinanceiros() {
    // Preencher a tabela de transações recentes
    preencherTabelaTransacoes();
    // Inicializar os gráficos
    inicializarGraficos();
}



// Função para inicializar os gráficos
function inicializarGraficos() {
    // Verificar se a biblioteca Chart.js está carregada
    if (typeof Chart === 'undefined') {
        // Se não estiver carregada, adicionar o script Chart.js
        carregarChartJS();
    } else {
        // Se já estiver carregada, criar os gráficos
        criarGraficos();
    }
}

// Função para carregar a biblioteca Chart.js
function carregarChartJS() {
    // Criar o script usando string HTML
    const scriptHtml = `<script src="https://cdn.jsdelivr.net/npm/chart.js" onload="criarGraficos()"></script>`;
    // Adicionar o script ao head
    document.head.insertAdjacentHTML('beforeend', scriptHtml);
}


