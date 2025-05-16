// Funções para exportar e imprimir os relatórios do dashboard financeiro

// Função para buscar dados financeiros
async function buscarDadosFinanceiros() {
    try {
        const response = await fetch('/api/financeiro/transacoes');
        if (!response.ok) {
            throw new Error('Erro ao buscar dados financeiros');
        }
        const transacoes = await response.json();
        return transacoes;
    } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        return [];
    }
}

// Função para calcular resumo financeiro
function calcularResumoFinanceiro(transacoes) {
    let receitasTotais = 0;
    let despesasTotais = 0;

    transacoes.forEach(transacao => {
        if (transacao.tipo === 'receita') {
            receitasTotais += parseFloat(transacao.valor);
        } else if (transacao.tipo === 'despesa') {
            despesasTotais += parseFloat(transacao.valor);
        }
    });

    const lucroLiquido = receitasTotais - despesasTotais;
    const variacaoReceitas = receitasTotais > 0 ? 100 : 0;
    const variacaoDespesas = receitasTotais > 0 ? (despesasTotais / receitasTotais) * 100 : 0;
    const variacaoLucro = receitasTotais > 0 ? (lucroLiquido / receitasTotais) * 100 : 0;

    return {
        receitasTotais,
        despesasTotais,
        lucroLiquido,
        variacaoReceitas,
        variacaoDespesas,
        variacaoLucro
    };
}

// Função para exportar dados para CSV
function exportarCSV(dados, nomeArquivo) {
    // Verificar se há dados para exportar
    if (!dados || dados.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }

    // Obter as chaves (cabeçalhos) do primeiro objeto
    const cabecalhos = Object.keys(dados[0]);

    // Criar a linha de cabeçalho
    let csv = cabecalhos.join(',') + '\n';

    // Adicionar os dados
    dados.forEach(item => {
        const valores = cabecalhos.map(cabecalho => {
            // Garantir que valores com vírgulas sejam encapsulados em aspas
            const valor = item[cabecalho] !== undefined ? item[cabecalho].toString() : '';
            return valor.includes(',') ? `"${valor}"` : valor;
        });
        csv += valores.join(',') + '\n';
    });

    // Criar um objeto Blob com o conteúdo CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Criar um link para download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', nomeArquivo || 'relatorio.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Função para exportar transações
async function exportarTransacoes() {
    try {
        const transacoes = await buscarDadosFinanceiros();
        if (transacoes.length === 0) {
            alert('Não há transações para exportar.');
            return;
        }

        // Formatar as transações para exportação
        const transacoesFormatadas = transacoes.map(transacao => ({
            Data: new Date(transacao.dataCriacao).toLocaleDateString('pt-BR'),
            Descrição: transacao.descricao,
            Tipo: transacao.tipo === 'receita' ? 'Receita' : 'Despesa',
            Categoria: transacao.categoria,
            Valor: `R$ ${parseFloat(transacao.valor).toFixed(2)}`,
            Formas_Pagamento: JSON.stringify(transacao.pagamento)
        }));

        exportarCSV(transacoesFormatadas, 'transacoes_financeiras.csv');
    } catch (error) {
        console.error('Erro ao exportar transações:', error);
        alert('Erro ao exportar transações. Por favor, tente novamente.');
    }
}

// Função para imprimir o dashboard
async function imprimirDashboard() {
    try {
        const transacoes = await buscarDadosFinanceiros();
        const resumo = calcularResumoFinanceiro(transacoes);

        // Criar uma nova janela
        const janelaImpressao = window.open('', '_blank');

        // Obter os gráficos como imagens
        const graficos = document.querySelectorAll('.grafico canvas');
        const imagensGraficos = Array.from(graficos).map(canvas => canvas.toDataURL('image/png'));

        // Criar o conteúdo HTML para impressão
        let conteudo = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Relatório Financeiro</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .data-impressao {
                        text-align: right;
                        margin-bottom: 20px;
                        font-size: 12px;
                    }
                    .indicadores {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .indicador {
                        width: 23%;
                        border: 1px solid #ddd;
                        padding: 15px;
                        border-radius: 5px;
                    }
                    .indicador h3 {
                        margin-top: 0;
                        font-size: 14px;
                        color: #666;
                    }
                    .indicador .valor {
                        font-size: 20px;
                        font-weight: bold;
                        margin: 10px 0 5px;
                    }
                    .indicador .variacao {
                        font-size: 12px;
                    }
                    .positiva {
                        color: green;
                    }
                    .negativa {
                        color: red;
                    }
                    .graficos {
                        margin-bottom: 30px;
                    }
                    .grafico {
                        margin-bottom: 20px;
                    }
                    .grafico h3 {
                        margin-bottom: 10px;
                    }
                    .grafico img {
                        max-width: 100%;
                        height: auto;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .valor-positivo {
                        color: green;
                    }
                    .valor-negativo {
                        color: red;
                    }
                    @media print {
                        body {
                            margin: 0;
                            padding: 20px;
                        }
                    }
                </style>
            </head>
            <body>
                <h1>Relatório Financeiro</h1>
                <div class="data-impressao">Gerado em: ${new Date().toLocaleString('pt-BR')}</div>
                
                <div class="indicadores">
                    <div class="indicador">
                        <h3>Receitas Totais</h3>
                        <div class="valor">R$ ${resumo.receitasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div class="variacao positiva">+${resumo.variacaoReceitas.toFixed(2)}%</div>
                    </div>
                    <div class="indicador">
                        <h3>Despesas Totais</h3>
                        <div class="valor">R$ ${resumo.despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div class="variacao negativa">+${resumo.variacaoDespesas.toFixed(2)}%</div>
                    </div>
                    <div class="indicador">
                        <h3>Lucro Líquido</h3>
                        <div class="valor">R$ ${resumo.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                        <div class="variacao ${resumo.variacaoLucro >= 0 ? 'positiva' : 'negativa'}">${resumo.variacaoLucro.toFixed(2)}%</div>
                    </div>
                </div>
                
                <div class="graficos">
        `;

        // Adicionar as imagens dos gráficos
        imagensGraficos.forEach((src, index) => {
            const titulos = ['Receitas vs Despesas', 'Fluxo de Caixa', 'Detalhamento de Receitas', 'Detalhamento de Despesas'];
            conteudo += `
                <div class="grafico">
                    <h3>${titulos[index]}</h3>
                    <img src="${src}" alt="${titulos[index]}">
                </div>
            `;
        });

        // Adicionar a tabela de transações
        conteudo += `
                </div>
                
                <h3>Transações Recentes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Descrição</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Adicionar as linhas da tabela
        transacoes.slice(0, 10).forEach(transacao => {
            const valorClass = transacao.tipo === 'receita' ? 'valor-positivo' : 'valor-negativo';
            const valorFormatado = `R$ ${parseFloat(transacao.valor).toFixed(2)}`;

            conteudo += `
                <tr>
                    <td>${new Date(transacao.dataCriacao).toLocaleDateString('pt-BR')}</td>
                    <td>${transacao.descricao}</td>
                    <td>${transacao.categoria}</td>
                    <td class="${valorClass}">${valorFormatado}</td>
                    <td>${transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}</td>
                </tr>
            `;
        });

        // Finalizar o HTML
        conteudo += `
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Escrever o conteúdo na nova janela
        janelaImpressao.document.write(conteudo);
        janelaImpressao.document.close();

        // Aguardar o carregamento completo antes de imprimir
        janelaImpressao.onload = function () {
            janelaImpressao.print();
        };
    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório. Por favor, tente novamente.');
    }
}

// Exportar funções para uso global
window.exportarTransacoes = exportarTransacoes;
window.imprimirDashboard = imprimirDashboard; 