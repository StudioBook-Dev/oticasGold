

function excluirPedidos(id) {
    if (confirm('Deseja realmente excluir este pedido?')) {
        fetch(`/api/pedidos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir o pedido');
            }
            return response.json();
        })
        .then(data => {
            alert('Pedido excluído com sucesso!');
            // Remover o card do pedido da interface
            const cardPedido = document.querySelector(`.card-pedido[data-id="${id}"]`);
            if (cardPedido) {
                cardPedido.remove();
            } else {
                // Se não encontrou o card, recarregar a página
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir o pedido. Por favor, tente novamente.');
        });
    }
}
