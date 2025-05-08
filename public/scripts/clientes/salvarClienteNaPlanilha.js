// Função para salvar um novo cliente
async function salvarClienteNaPlanilha(editar = false) {
    
    const cliente = {
        id: editar && editar.id ? editar.id : null, // O backend vai gerar um ID se for null
        nome: document.getElementById('nomeCliente').value,
        telefone: document.getElementById('telefoneCliente').value,
        email: document.getElementById('emailCliente').value,
        datanascimento: document.getElementById('dataNascimentoCliente').value,
        enderecoCompleto: document.getElementById('enderecoCompleto').value,
        estado: document.getElementById('estadoCliente').value,
        cidade: document.getElementById('cidadeCliente').value,
        rua: document.getElementById('ruaCliente').value,
        casa: document.getElementById('casaCliente').value,
        cep: document.getElementById('cepCliente').value
    };

    // Validar campos obrigatórios
    if (!cliente.nome.trim()) {
        alert('O nome do cliente é obrigatório.');
        return false;
    }

    document.getElementById('formCliente').innerHTML = '<div class="loading">Salvando cliente...</div>';

    try {
        let response;
        
        if (editar && editar.id) {
            // Atualizar cliente existente usando API SQLite
            response = await fetch(`/api/clientes/${cliente.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        } else {
            // Criar novo cliente usando API SQLite
            response = await fetch('/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Erro ao ${editar ? 'atualizar' : 'salvar'} o cliente`);
        }
        
        const data = await response.json();
        
        alert(`Cliente ${editar ? 'atualizado' : 'salvo'} com sucesso!`);
        fecharModalSecundario();
        abrirModalClientes();
        
    } catch (error) {
        console.error(`Erro ao ${editar ? 'atualizar' : 'salvar'} cliente:`, error);
        alert(`Erro ao ${editar ? 'atualizar' : 'salvar'} o cliente. Por favor, tente novamente.`);
        abrirModalSecundarioClientes(editar ? cliente : null);
    }
} 