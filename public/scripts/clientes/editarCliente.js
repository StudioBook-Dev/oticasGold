// Função para editar um cliente existente
function editarCliente(id) {
    // Adicionar console.log para verificação
    console.log('Tentando editar cliente com ID:', id);
    
    getClientes()
        .then(clientes => {
            console.log('Clientes retornados da API:', clientes);
            
            const clienteParaEditar = clientes.find(cliente => String(cliente.id) === String(id));
            
            if (clienteParaEditar) {
                console.log('Cliente encontrado para edição:', clienteParaEditar);
                abrirModalSecundarioClientes(clienteParaEditar);
            } else {
                console.error('Cliente não encontrado com o ID:', id);
                alert('Não foi possível encontrar o cliente para edição.');
            }
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
        });
}

// Função para salvar um cliente editado - Não usada, mantida apenas para compatibilidade
async function salvarClienteEditado() {
    // Esta função não é mais usada, pois agora usamos salvarClienteNaPlanilha
    console.warn('Função obsoleta salvarClienteEditado chamada. Use salvarClienteNaPlanilha.');
    
    try {
        const id = document.getElementById('clienteId').value;
        // Redirecionar para a nova função
        salvarClienteNaPlanilha({id: id});
    } catch (error) {
        console.error('Erro ao redirecionar para salvar cliente:', error);
    }
}

// Função para converter array de clientes para formato CSV
async function convertClientesToCSV(clientes) {
    // Cabeçalho do CSV
    let csvContent = 'id,nome,telefone,endereco,dataNascimento,email\n';
    
    // Adicionar cada cliente como uma linha do CSV
    clientes.forEach(cliente => {
        const { id, nome, telefone, endereco, dataNascimento, email } = cliente;
        csvContent += `${id},${nome || ''},${telefone || ''},${endereco || ''},${dataNascimento || ''},${email || ''}\n`;
    });
    
    return csvContent;
} 