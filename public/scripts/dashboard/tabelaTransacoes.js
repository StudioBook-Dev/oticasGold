

// Função para preencher a tabela de transações recentes
async function preencherTabelaTransacoes() {
    const container = document.getElementById('lista-transacoes');
    const transacoes = await Ler_TransacoesFinanceiras();

    if (!transacoes || transacoes.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Nenhuma transação encontrada</div>';
        return;
    }

    // Agrupar transações por data
    const transacoesPorData = agruparTransacoesPorData(transacoes);

    let conteudo = '';

    // Para cada data, criar um grupo de transações
    Object.keys(transacoesPorData).forEach(data => {
        // Adicionar cabeçalho da data
        conteudo += `
            <div style="margin: 15px 0 10px 0; padding-top: 5px; border-top: ${data === Object.keys(transacoesPorData)[0] ? 'none' : '1px solid #eee'};">
                <span style="font-size: 13px; color: #555; font-weight: 500;">${formatarDataHeader(data)}</span>
            </div>
        `;

        // Adicionar transações do dia
        transacoesPorData[data].forEach(transacao => {
            const isPositivo = transacao.tipo === 'receita';
            const valorFormatado = Math.abs(transacao.valor).toFixed(2).replace('.', ',');
            const prefixo = isPositivo ? '+' : '-';
            const icone = obterIconeTransacao(transacao.categoria);
            const horario = extrairHorario(transacao.dataCriacao);

            conteudo += `
                <div style="display: flex; padding: 10px 0; border-bottom: 1px 
                    solid #f0f0f0; align-items: center; cursor: pointer;" 
                    onclick="detalhesDaTransacao('${transacao.id}')">
                    <div style="margin-right: 12px; width: 32px; height: 32px; background-color: ${isPositivo ? '#d3f4e1' : '#fee9e7'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="${icone}" style="font-size: 12px; color: ${isPositivo ? '#06c858' : '#e74c3c'};"></i>
                    </div>
                    <div style="flex-grow: 1;">
                        <div style="font-weight: 500; color: #333; margin-bottom: 2px; font-size: 13px;">
                            ${transacao.categoria || 'Sem categoria'}
                        </div>
                        <div style="font-size: 10px; color: #8a8383;">
                            ${transacao.descricao || 'Sem descrição'}
                            </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 500; color: ${isPositivo ? '#2ecc71' : '#e74c3c'}; font-size: 13px; white-space: nowrap;">${prefixo} R$ ${valorFormatado}</div>
                        <div style="font-size: 9px; color: #999; margin-top: 2px;">${horario}</div>
                    </div>
                </div>
            `;
        });
    });

    // Inserir o HTML no container
    container.innerHTML = conteudo;
}


// Função para agrupar transações por data
function agruparTransacoesPorData(transacoes) {
    const grupos = {};

    transacoes.forEach(transacao => {
        // Extrair apenas a data (sem a hora)
        const dataCriacao = transacao.dataCriacao || '';
        const dataApenas = dataCriacao.split(' ')[0];

        // Se não houver data, usar "Sem data"
        const chave = dataApenas || 'Sem data';

        // Inicializar o array se não existir
        if (!grupos[chave]) {
            grupos[chave] = [];
        }

        // Adicionar transação ao grupo correto
        grupos[chave].push(transacao);
    });

    // Ordenar as chaves em ordem decrescente (das mais recentes para as mais antigas)
    const chavesOrdenadas = Object.keys(grupos).sort().reverse();

    // Criar um novo objeto com as chaves na ordem correta
    const gruposOrdenados = {};
    chavesOrdenadas.forEach(chave => {
        gruposOrdenados[chave] = grupos[chave];
    });

    return gruposOrdenados;
}


// Função para formatar o cabeçalho da data
function formatarDataHeader(dataString) {
    if (dataString === 'Sem data') return dataString;

    // Verificar se é hoje
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split('T')[0]; // YYYY-MM-DD

    if (dataString === dataFormatada) {
        return 'Hoje';
    }

    // Verificar se é ontem
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const ontemFormatado = ontem.toISOString().split('T')[0]; // YYYY-MM-DD

    if (dataString === ontemFormatado) {
        return 'Ontem';
    }

    // Para outras datas, formatar como dia/mês
    try {
        const partes = dataString.split('-');
        if (partes.length === 3) {
            const dia = parseInt(partes[2], 10);
            const mes = parseInt(partes[1], 10) - 1; // JavaScript usa 0-11 para meses

            // Array com nomes dos meses em português
            const nomesMeses = [
                'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
                'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
            ];

            return `${dia} de ${nomesMeses[mes]}`;
        }
    } catch (e) {
        console.error('Erro ao formatar data:', e);
    }

    return dataString;
}


// Função para extrair apenas o horário de uma string de data/hora
function extrairHorario(dataHora) {
    if (!dataHora) return '';

    const partes = dataHora.split(' ');
    if (partes.length >= 2) {
        // Tentar formatar para HH:MM
        const horarioCompleto = partes[1];
        const horarioPartes = horarioCompleto.split(':');
        if (horarioPartes.length >= 2) {
            return `${horarioPartes[0]}:${horarioPartes[1]}`;
        }
        return horarioCompleto;
    }

    return '';
}


// Função para obter o ícone baseado na categoria da transação
function obterIconeTransacao(categoria) {
    if (!categoria) return 'fas fa-money-bill-wave';

    switch (categoria.toLowerCase()) {
        case 'venda':
        case 'vendas':
            return 'fas fa-shopping-cart';
        case 'pagamento':
        case 'pagamentos':
            return 'fas fa-credit-card';
        case 'transferência':
        case 'transferencia':
            return 'fas fa-exchange-alt';
        case 'reserva':
            return 'fas fa-piggy-bank';
        case 'pix':
            return 'fas fa-bolt';
        case 'resgate':
            return 'fas fa-wallet';
        default:
            return 'fas fa-money-bill-wave';
    }
}