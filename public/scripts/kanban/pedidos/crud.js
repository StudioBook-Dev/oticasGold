

// Função para buscar todos os pedidos da API
async function getPedidos() {
    try {
        const response = await fetch('/api/pedidos');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar pedidos: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        return [];
    }
}


// Função para buscar um pedido pelo ID
async function getPedidoById(id) {
    try {
        const response = await fetch(`/api/pedidos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pedido: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        return null;
    }
}


// Função para excluir um pedido pelo ID
function deletePedido(id) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        fetch(`/api/pedidos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Pedido excluído com sucesso!');
            abrirKanban()
        })
        .catch(error => {
            console.error('Erro ao excluir pedido:', error);
            alert('Erro ao excluir pedido.');
        });
    }
}


// Função para salvar uma nova categoria
function postPedido(pedido) {
    console.log(pedido)
    fetch('/api/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert('Pedido salvo com sucesso!');
        abrirKanban()
    })
    .catch(error => {
        console.error('Erro ao salvar pedido:', error);
        alert('Erro ao salvar pedido.');
    });
}


// Função para salvar a edição da categoria
function putPedido(pedido) {
    fetch(`/api/pedidos/${pedido.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pedido)
    })
    .then(response => response.json())
    .then(data => {
        alert('Pedido atualizado com sucesso!');
        abrirKanban()
    })
    .catch(error => {
        console.error('Erro ao atualizar pedido:', error);
        alert('Erro ao atualizar pedido.');
    });
}




