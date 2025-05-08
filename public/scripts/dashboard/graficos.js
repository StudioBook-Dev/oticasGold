

// Função para criar os gráficos
function criarGraficos() {
    criarGraficoReceitasDespesas();
    criarGraficoFluxoCaixa();
    criarGraficoDetalheReceitas();
    criarGraficoDetalheDespesas();
}


// Função para criar o gráfico de Receitas vs Despesas
async function criarGraficoReceitasDespesas() {
    const ctx = document.getElementById('grafico-receitas-despesas').getContext('2d');
    // Dados para o gráfico de Receitas vs Despesas
    const dados = await desempenhoMensal();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dados.receitas),
            datasets: [
                {
                    label: 'Receitas',
                    data: Object.values(dados.receitas),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Despesas',
                    data: Object.values(dados.despesas),
                    backgroundColor: 'rgba(243, 58, 58, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Função para criar o gráfico de Fluxo de Caixa
async function criarGraficoFluxoCaixa() {
    const ctx = document.getElementById('grafico-fluxo-caixa').getContext('2d');

    // Dados para o gráfico de Fluxo de Caixa
    const dados = await desempenhoMensal();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dados.meses,
            datasets: [{
                label: 'Fluxo de Caixa',
                data: dados.lucros,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Função para criar o gráfico de Detalhamento de Receitas
async function criarGraficoDetalheReceitas() {
    const ctx = document.getElementById('grafico-detalhe-receitas').getContext('2d');
    // Dados para o gráfico de Detalhamento de Receitas
    const dados = await dadosDetalheReceitas();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map(item => item.categoria),
            datasets: [{
                data: dados.map(item => item.valor),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = dados[context.dataIndex].percentual;
                            return `${label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Função para criar o gráfico de Detalhamento de Despesas
async function criarGraficoDetalheDespesas() {
    const ctx = document.getElementById('grafico-detalhe-despesas').getContext('2d');
    // Dados para o gráfico de Detalhamento de Despesas
    const dados = await dadosDetalheDespesas();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: dados.map(item => item.categoria),
            datasets: [{
                data: dados.map(item => item.valor),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const percentage = dados[context.dataIndex].percentual;
                            return `${label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Adicionar uma função para ajustar tamanho dos gráficos para responsividade
function ajustarTamanhoGraficos() {
    const graficos = document.querySelectorAll('.grafico');

    // Configurar altura fixa para gráficos
    graficos.forEach(grafico => {
        grafico.style.height = '300px';
    });
}