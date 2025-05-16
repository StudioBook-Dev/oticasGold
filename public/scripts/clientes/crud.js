

// Função para buscar todos os clientes da API
async function getClientes() {
    try {
        const response = await fetch('/api/clientes');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar clientes: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }
}


// Função para buscar um cliente pelo ID
async function getClienteById(id) {
    try {
        const response = await fetch(`/api/clientes/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar cliente: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        return null;
    }
}


// Função para excluir um cliente pelo ID
function deleteCliente(id) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        fetch(`/api/clientes/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Cliente excluído com sucesso!');
            gerarTabelaClientes(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir cliente.');
        });
    }
}


// Função para salvar um novo cliente
function postCliente(cliente) {
    fetch('/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => {
        alert('Cliente salvo com sucesso!');
    })
    .catch(error => {
        console.error('Erro ao salvar cliente:', error);
        alert('Erro ao salvar cliente.');
    });
}


// Função para salvar a edição do cliente
function putCliente(cliente) {
    fetch(`/api/clientes/${cliente.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente)
    })
    .then(response => response.json())
    .then(data => {
        alert('Cliente atualizado com sucesso!');
        fecharModalSecundario();
        gerarTabelaClientes(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    });
}

