

function excluirItem(tipo, id) {
    // Confirmar exclusão com o usuário
    const confirmar = confirm(`Deseja realmente excluir este item?`);

    if (!confirmar) {
        return;
    }

    // Verificar se o ID foi fornecido
    if (!id) {
        alert('Erro: ID não fornecido para exclusão');
        // console.error('Tentativa de excluir item sem ID:', tipo);
        return;
    }

    // console.log(`Excluindo ${tipo} com ID: ${id}`);

    // Fazer a requisição para o servidor para excluir o item
    fetch(`/api/${tipo}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao excluir item: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Exibir mensagem de sucesso
            alert('Item excluído com sucesso!');
            
            // Recarregar a lista dependendo do tipo
            switch (tipo) {
                case 'produtos':
                    abrirModalProdutos(); // Recarrega a lista de produtos
                    break;
                case 'categorias':
                    // Recarregar a lista de categorias
                    abrirModalCategorias();
                    break;
                case 'clientes':
                    // Recarregar a lista de clientes
                    abrirModalClientes();
                    break;
                case 'cupons':
                    // Recarregar a lista de cupons
                    abrirModalCupons();
                    break;
                case 'pedidos':
                    // Recarregar o kanban
                    carregarPedidos();
                    break;
                default:
                    // console.log('Tipo não identificado para recarregamento');
            }
        })
        .catch(error => {
            // console.error('Erro ao excluir:', error);
            alert('Erro ao excluir o item. Por favor, tente novamente.');
        });
}

// Função para mostrar notificações de forma simples (fallback)
function mostrarNotificacao(mensagem, tipo) {
    if (tipo === 'erro') {
        alert('❌ ' + mensagem);
    } else {
        alert('✅ ' + mensagem);
    }
}




