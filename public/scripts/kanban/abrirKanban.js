

function abrirKanban() {
    setTelaAtualLocalStorage('kanban');
    const kanban = document.querySelector('.kanban');
    const dashboard = document.querySelector('.dashboard');
    kanban.classList.remove('desativado');
    dashboard.classList.add('desativado');
    carregarPedidos();
}

// Função para carregar pedidos do servidor e atualizar o kanban
function carregarPedidos() {
    // Exibir estado de carregamento
    const kanbanContainer = document.getElementById('kanban');
    kanbanContainer.innerHTML = '<div class="loading-kanban">Carregando pedidos...</div>';
    
    // Buscar pedidos do servidor via API
    getPedidos()
        .then(pedidos => {
            // console.log('Pedidos carregados com sucesso!');
            // Atualizar a interface do Kanban
            atualizarKanbanPedidos();
        })
        .catch(error => {
            console.error('Erro ao carregar pedidos:', error);
            kanbanContainer.innerHTML = '<div class="error-kanban">Erro ao carregar pedidos. Tente novamente mais tarde.</div>';
        });
}

// Função para atualizar o Kanban com os pedidos da API
function atualizarKanbanPedidos() {
    // Buscar pedidos usando a API
    getPedidos().then(pedidos => {
        // Limpar o container do Kanban
        const kanbanContainer = document.getElementById('kanban');
        kanbanContainer.innerHTML = '';
        
        // Categorias de status para o Kanban
        const categorias = [
            { id: 'fila', titulo: 'Fila', icone: 'fa-clock' },
            { id: 'preparando', titulo: 'Preparando', icone: 'fa-cog' },
            { id: 'retirada', titulo: 'Pronto para retirada', icone: 'fa-box' },
            { id: 'entrega', titulo: 'Saiu para entrega', icone: 'fa-truck' },
            { id: 'finalizado', titulo: 'Finalizado', icone: 'fa-check-circle' },
            { id: 'cancelado', titulo: 'Cancelado', icone: 'fa-times-circle' }
        ];
        
        // Criar o container principal do kanban
        kanbanContainer.innerHTML = `
            <div class="kanban-wrap">
                <div class="kanban-container">
                    ${categorias.map(categoria => criarColunaKanbanHTML(categoria, pedidos)).join('')}
                </div>
            </div>
        `;
        
        // Após renderizar o Kanban, o drag and drop será inicializado pelo observador no arquivo dragInDrop.js
    });
}

// Função para criar o HTML de uma coluna do Kanban
function criarColunaKanbanHTML(categoria, pedidos) {
    // Filtrar pedidos pelo status
    const pedidosColuna = pedidos.filter(pedido => pedido.status === categoria.id) || [];
    
    return `
        <div class="kanban-coluna" data-status="${categoria.id}">
            <div class="kanban-coluna-header">
                <span class="kanban-coluna-titulo">
                    <i class="fas ${categoria.icone}"></i>
                    ${categoria.titulo}
                </span>
                <span class="kanban-coluna-contagem">${pedidosColuna.length}</span>
            </div>
            <div class="kanban-coluna-cards" id="kanban-cards-${categoria.id}">
                ${
                    pedidosColuna.length > 0 ? 
                    pedidosColuna.map(pedido => criarCardPedidoHTML(pedido)).join('') : ''
                }
            </div>
        </div>
    `;
}

function criarCardPedidoHTML(pedido) {
    // Obter informações dos produtos
    let produtosInfo = '';
    if (pedido.produtos) {
        try {
            // Converter string para objeto se necessário
            const produtos = typeof pedido.produtos === 'string' ? JSON.parse(pedido.produtos) : pedido.produtos;
            
            if (Array.isArray(produtos) && produtos.length > 0) {
                produtosInfo = produtos.map(produto => 
                    `${produto.quantidade}x ${produto.nome} <br>`
                ).join(' ');
            }
        } catch (e) {
            console.error('Erro ao processar produtos:', e);
            produtosInfo = 'Erro ao carregar produtos';
        }
    }
    
    // Criar o HTML do card
    return `
        <div class="card-pedido" data-id="${pedido.id}">
            <div class="numero-pedido">#${pedido.id}</div>
            <div class="produto-pedido">${produtosInfo}</div>
            <div class="valor-pedido">R$ ${pedido.total}</div>
            <div class="data-pedido">${pedido.dataCriacao}</div>
        </div>
    `;
}


