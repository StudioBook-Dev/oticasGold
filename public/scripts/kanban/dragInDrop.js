// Função para iniciar o arrasto
const dragStart = (event) => {
    // Verifica se o card está na coluna finalizado
    const card = event.target;
    const colunaAtual = card.closest('.kanban-coluna');

    if (colunaAtual && colunaAtual.getAttribute('data-status') === 'finalizado') {
        event.preventDefault();
        return;
    }

    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    // Adiciona classe visual durante o arrasto
    event.target.classList.add('arrastando');
};

// Função para permitir o drop
const allowDrop = (event) => {
    event.preventDefault();
};

// Função quando termina o arrasto
const dragEnd = (event) => {
    event.target.classList.remove('arrastando');
};

// Função para lidar com o drop
const drop = (event) => {
    event.preventDefault();

    // Prevenir drop se o alvo não for uma coluna
    if (!event.target.classList.contains('conteudo-coluna') &&
        !event.target.classList.contains('coluna-kanban')) {
        return;
    }

    // Obtém o ID do pedido
    const pedidoId = event.dataTransfer.getData("text/plain");
    const cardPedido = document.querySelector(`.card-pedido[data-id="${pedidoId}"]`);

    if (!cardPedido) return;

    // Identifica a coluna de destino
    let colunaDestino;
    if (event.target.classList.contains('conteudo-coluna')) {
        colunaDestino = event.target;
    } else if (event.target.classList.contains('coluna-kanban')) {
        colunaDestino = event.target.querySelector('.conteudo-coluna');
    } else {
        // Busca o ancestral mais próximo que seja uma coluna
        colunaDestino = event.target.closest('.conteudo-coluna');
    }

    if (!colunaDestino) return;

    // Identifica o status da coluna de destino
    const idColunaDestino = colunaDestino.parentElement.id;
    const novoStatus = idColunaDestino.replace('coluna-', '');

    // Adiciona o card à coluna de destino
    colunaDestino.appendChild(cardPedido);

    // Atualiza o status do pedido no localStorage e no CSV
    atualizarStatusPedido(pedidoId, novoStatus);
};

// Função para atualizar o status do pedido diretamente na API
async function atualizarStatusPedido(pedidoId, novoStatus) {
    try {
        // Fazer a requisição para a API
        const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar status do pedido: ${response.status}`);
        }

        const data = await response.json();
        // console.log(`Status do pedido ${pedidoId} atualizado para ${novoStatus}`);

        // Atualizar o contador de pedidos em cada coluna
        atualizarContadoresColunas();

    } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
        alert('Erro ao atualizar o status do pedido. Por favor, tente novamente.');

        // Recarregar a visualização do Kanban para refletir o estado atual
        atualizarKanbanPedidos();
    }
}

// Função para atualizar os contadores de pedidos em cada coluna
function atualizarContadoresColunas() {
    const colunas = document.querySelectorAll('.kanban-coluna');

    colunas.forEach(coluna => {
        const cards = coluna.querySelectorAll('.card-pedido');
        const contador = coluna.querySelector('.kanban-coluna-contagem');

        if (contador) {
            contador.textContent = cards.length;
        }
    });
}

// Função para inicializar o drag and drop
const inicializarDragAndDrop = () => {
    // Obter todos os cards de pedidos
    const cardsPedidos = document.querySelectorAll('.card-pedido');

    // Adicionar os event listeners de drag para cada card
    cardsPedidos.forEach(card => {
        // Verifica se o card está na coluna finalizado
        const colunaAtual = card.closest('.kanban-coluna');
        if (colunaAtual && colunaAtual.getAttribute('data-status') === 'finalizado') {
            card.setAttribute('draggable', 'false');
            return;
        }

        card.setAttribute('draggable', 'true');

        card.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('dragging');
        });
    });

    // Obter todas as colunas de destino
    const colunasDestino = document.querySelectorAll('.kanban-coluna-cards');

    // Adicionar os event listeners de drop para cada coluna
    colunasDestino.forEach(coluna => {
        coluna.addEventListener('dragover', function (e) {
            e.preventDefault();
            coluna.classList.add('drag-over');
        });

        coluna.addEventListener('dragleave', function () {
            coluna.classList.remove('drag-over');
        });

        coluna.addEventListener('drop', function (e) {
            e.preventDefault();
            coluna.classList.remove('drag-over');

            // Obter o ID do pedido e o status da coluna
            const pedidoId = e.dataTransfer.getData('text/plain');
            const novoStatus = coluna.closest('.kanban-coluna').getAttribute('data-status');

            // Encontrar o card do pedido
            const cardPedido = document.querySelector(`.card-pedido[data-id="${pedidoId}"]`);

            if (cardPedido) {
                // Mover o card para a nova coluna (visualmente)
                coluna.appendChild(cardPedido);

                // Atualizar o status do pedido na API
                atualizarStatusPedido(pedidoId, novoStatus);
            }
        });
    });
};

// Observa mudanças no DOM para inicializar drag and drop quando o kanban for carregado
const observador = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            // Verifica se os cards de pedido foram adicionados
            if (document.querySelector('.card-pedido')) {
                inicializarDragAndDrop();
            }
        }
    });
});

// Inicia a observação quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const conteudoKanban = document.querySelector('.conteudo-kanban');
    if (conteudoKanban) {
        observador.observe(conteudoKanban, { childList: true, subtree: true });

        // Também inicializa para cards que já estejam presentes
        inicializarDragAndDrop();
    }
});
