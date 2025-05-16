

// Mapeamento de números de mês para nomes em português
const meses = {
    0: 'janeiro', 1: 'fevereiro', 2: 'marco', 3: 'abril', 4: 'maio',
    5: 'junho', 6: 'julho', 7: 'agosto', 8: 'setembro', 9: 'outubro',
    10: 'novembro', 11: 'dezembro'
};


async function calculaDadosFinanceiros() {
    let receitasTotais = 0;
    let despesasTotais = 0;
    const transacoes = await Ler_TransacoesFinanceiras();
    transacoes.forEach(transacao => {
        if (transacao.tipo === 'receita') {
            receitasTotais += transacao.valor;
        } if (transacao.tipo === 'despesa') {
            despesasTotais += transacao.valor;
        }
    });
    lucroLiquido = receitasTotais - despesasTotais;
    variacaoLucro = (lucroLiquido / receitasTotais) * 100;
    variacaoReceitas = (receitasTotais / receitasTotais) * 100;
    variacaoDespesas = (despesasTotais / receitasTotais) * 100;
    const dadosFinanceiros = {
        receitasTotais: receitasTotais,
        despesasTotais: despesasTotais,
        lucroLiquido: lucroLiquido,
        variacaoLucro: variacaoLucro,
        variacaoReceitas: variacaoReceitas,
        variacaoDespesas: variacaoDespesas
    }
    return dadosFinanceiros;
}


async function desempenhoMensal() {
    const transacoes = await Ler_TransacoesFinanceiras();
    const dados = {
        receitas: {
            janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0,
            agosto: 0, setembro: 0, outubro: 0, novembro: 0,  dezembro: 0
        },
        despesas: {
            janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0, 
            agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0
        },
        lucros: {
            janeiro: 0, fevereiro: 0, marco: 0, abril: 0, maio: 0, junho: 0, julho: 0, 
            agosto: 0, setembro: 0, outubro: 0, novembro: 0, dezembro: 0
        }
    };
    // Processa cada transação
    transacoes.forEach(transacao => {
        // Obtém o mês da data da transação
        const data = new Date(transacao.dataCriacao);
        const mes = meses[data.getMonth()];
        // Adiciona o valor ao mês correspondente, baseado no tipo
        if (transacao.tipo === 'receita') {
            dados.receitas[mes] += transacao.valor;
        } else if (transacao.tipo === 'despesa') {
            dados.despesas[mes] += transacao.valor;
        }
        dados.lucros[mes] = dados.receitas[mes] - dados.despesas[mes];
    });

    return dados;
}


async function lucroMesAtual() {
    const mesAtualNumero = parseInt(dataFormatada().mes)
    const mesAtualNome   = meses[mesAtualNumero]
    const dados = await desempenhoMensal()
    const lucroDoMesAtual = dados.lucros[mesAtualNome]
    return lucroDoMesAtual
}


async function dadosDetalheReceitas() {
    const transacoes = await Ler_TransacoesFinanceiras();

    // Filtra receitas e agrupa por categoria em um único passo
    const categorias = {};
    let totalReceitas = 0;

    transacoes.forEach(t => {
        if (t.tipo === 'receita') {
            const nome = t.categoria || 'Sem Categoria';
            categorias[nome] = (categorias[nome] || 0) + t.valor;
            totalReceitas += t.valor;
        }
    });

    // Converte para array, calcula percentuais e ordena
    return Object.entries(categorias)
        .map(([categoria, valor]) => ({
            categoria,
            valor,
            percentual: Math.round((valor / totalReceitas) * 100)
        }))
        .sort((a, b) => b.valor - a.valor);
}


async function dadosDetalheDespesas() {
    const transacoes = await Ler_TransacoesFinanceiras();

    // Filtra receitas e agrupa por categoria em um único passo
    const categorias = {};
    let totalDespesas = 0;

    transacoes.forEach(t => {
        if (t.tipo === 'despesa') {
            const nome = t.categoria || 'Sem Categoria';
            categorias[nome] = (categorias[nome] || 0) + t.valor;
            totalDespesas += t.valor;
        }
    });

    // Converte para array, calcula percentuais e ordena
    return Object.entries(categorias)
        .map(([categoria, valor]) => ({
            categoria,
            valor,
            percentual: Math.round((valor / totalDespesas) * 100)
        }))
        .sort((a, b) => b.valor - a.valor);
}



