

// Função para criar o HTML do card de pedido
function criarCardPedidoHTML(pedido) {
    // Formatar o valor total para exibição
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(pedido.total);
    
    // Extrair o nome do cliente
    let nomeCliente = 'Cliente';
    if (pedido.cliente) {
        if (typeof pedido.cliente === 'string') {
            try {
                const clienteObj = JSON.parse(pedido.cliente);
                nomeCliente = clienteObj.nome || 'Cliente';
            } catch (e) {
                nomeCliente = pedido.cliente;
            }
        } else {
            nomeCliente = pedido.cliente.nome || 'Cliente';
        }
    }
    
    // Contar itens do pedido
    let quantidadeItens = 0;
    let itensPedido = [];
    
    if (pedido.produtos) {
        if (typeof pedido.produtos === 'string') {
            try {
                itensPedido = JSON.parse(pedido.produtos);
                if (Array.isArray(itensPedido)) {
                    quantidadeItens = itensPedido.length;
                }
            } catch (e) {
                console.error('Erro ao processar produtos do pedido:', e);
                quantidadeItens = 0;
            }
        } else if (Array.isArray(pedido.produtos)) {
            itensPedido = pedido.produtos;
            quantidadeItens = itensPedido.length;
        }
    }
    
    // Formatar a data para exibição
    const dataPedido = pedido.dataCriacao ? new Date(pedido.dataCriacao) : new Date();
    const dataFormatada = dataPedido.toLocaleDateString('pt-BR');
    
    // Gerar o HTML do card
    return `
        <div class="card-pedido" data-id="${pedido.id}" >
            <div class="card-header">
                <span class="numero-pedido">#${pedido.id}</span>
                <span class="data-pedido">${dataFormatada}</span>
            </div>
            <div class="card-cliente">${nomeCliente}</div>
            <div class="card-itens">${quantidadeItens} item(ns)</div>
            <div class="card-valor">${valorFormatado}</div>
            <div class="card-acoes">

                <button class="btn-card visualizar-pedido" 
                    onclick="abrirModalPrincipal_DetalhesDosPedidos('${pedido.id}')">
                    <i class="fas fa-info-circle"></i>
                </button>

                <button class="btn-card pagamento-pedido" 
                    onclick="abriModalPagamentoDoPedido('${pedido.id}')">
                    <i class="fas fa-credit-card"></i>
                </button>

                <button style="display: none;" 
                class="btn-card editar-pedido" onclick="editarPedido('${pedido.id}')">
                    <i class="fas fa-pencil-alt"></i>
                </button>

                <button class="btn-card excluir-pedido" onclick="excluirPedidos('${pedido.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>

        <style>
            .card-pedido {
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .card-pedido:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            
            .card-acoes {
                display: flex;
                justify-content: flex-end;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .btn-card {
                cursor: pointer;
                border: none;
                background: none;
                border-radius: 50%;
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
            }
            
            .visualizar-pedido {
                color: #3498db;
            }
            
            .editar-pedido {
                color: #f39c12;
            }
            
            .excluir-pedido {
                color: #e74c3c;
            }
            
            .btn-card:hover {
                background-color: rgba(0,0,0,0.05);
            }
        </style>
    `;
} 

