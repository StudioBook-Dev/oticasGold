

function criarColunaKanbanHTML(status) {
    // Formata o título da coluna
    const titulo = status.charAt(0).toUpperCase() + status.slice(1);
    
    // Inicializa variável com o HTML da coluna
    let htmlColuna = `
        <div class="coluna-kanban" id="coluna-${status}">
            <div class="titulo-coluna">${titulo}</div>
            <hr class="divisoria-coluna">
            <div class="conteudo-coluna">`;
    
    // Busca pedidos do localStorage
    const pedidos = getPedidosLocalStorage();
    console.log(`Criando coluna ${status}. Total de pedidos: ${pedidos ? pedidos.length : 0}`);
    
    // Debug: mostrar todos os pedidos
    if (pedidos && pedidos.length > 0) {
        console.log('Todos os pedidos disponíveis:');
        pedidos.forEach(p => {
            console.log(`ID: ${p.id}, Status: ${p.status}`);
        });
    }
    
    // Adiciona cards para cada pedido
    let pedidosNaColuna = 0;
    if (pedidos && pedidos.length > 0) {
        pedidos.forEach(pedido => {
            // Garantir que o status seja uma string e normalizar para comparação
            // Remover espaços, converter para minúsculas e trim para garantir consistência
            const pedidoStatus = (String(pedido.status || 'fila')).trim().toLowerCase();
            const statusColuna = status.trim().toLowerCase();
            
            if (pedidoStatus === statusColuna) {
                htmlColuna += criarCardPedidoHTML(pedido);
                pedidosNaColuna++;
            }
        });
    }    
    console.log(`Total de pedidos na coluna ${status}: ${pedidosNaColuna}`);
    // Se não houver pedidos nesta coluna
    if (pedidosNaColuna === 0) {
        htmlColuna += '<div class="sem-pedidos">Nenhum pedido nesta coluna</div>';
    }
    
    // Fecha as tags da coluna
    htmlColuna += `
        </div>
    </div>`;
    
    return htmlColuna;
}

