

async function detalhesDaTransacao(id) {
    const transacao = await getByIdTransacaoFinanceira(id);  
    abrirModalPrincipal({
        titulo: `Detalhes da Transação #${id}`,
        conteudo: '<div id="detalhes-transacao">Carregando detalhes...</div>',
        adicionar: false
    });
    html_visualizarDetalhesTransacao(transacao);
}


function html_visualizarDetalhesTransacao(transacao) {
    const pagamento = JSON.parse(transacao.pagamento)
    let formas = '';
    pagamento.formas.forEach(forma => {
        formas +=` ${forma.forma} - R$${ forma.valor }`
    });
    const html = document.getElementById('detalhes-transacao');
    const conteudo = `
        <h2>Detalhes da Transação</h2>
        <p>ID: ${transacao.id}</p>
        <p>Valor: ${transacao.valor}</p>
        <p>Data: ${transacao.dataCriacao}</p>
        <p>Descrição: ${transacao.descricao || 'N/A'}</p>
        <p>Categoria: ${transacao.categoria}</p>
        <p>Tipo: ${transacao.tipo}</p>
        <div> 
            <h3>Pagamento</h3>
            <p> Juros: ${pagamento.juros}</p>
            <p>formas:</p> 
            ${formas || 'N/A'}
        </div>
    `;
    html.innerHTML = conteudo;
}



