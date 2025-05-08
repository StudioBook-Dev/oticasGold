// Função para buscar clientes
async function getClientes() {
    // console.log("Iniciando carregamento de clientes...");
    
    try {
        // Buscar clientes da API SQLite
        const response = await fetch('/api/clientes');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar clientes: ${response.status}`);
        }
        
        const clientes = await response.json();
        
        // console.log(`Total de clientes carregados: ${clientes.length}`);
        return clientes;
        
    } catch (error) {
        console.error("Erro ao carregar clientes:", error);
        return [];
    }
}

/**
 * Busca um cliente específico pelo ID
 * @param {number|string} id - ID do cliente a ser buscado
 * @returns {Object|null} Cliente encontrado ou null se não encontrar
 */
async function getCliente(id) {
    try {
        // Verifica se o ID é válido
        if (!id) {
            console.error("ID do cliente não fornecido");
            return null;
        }
        
        // Opção 1: Buscar diretamente da API (mais eficiente quando há muitos clientes)
        try {
            const response = await fetch(`/api/clientes/${id}`);
            
            if (response.ok) {
                return await response.json();
            }
        } catch (apiError) {
            console.warn("Não foi possível buscar cliente direto da API:", apiError);
            // Continua para a opção 2 em caso de falha
        }
        
        // Opção 2: Buscar de todos os clientes e filtrar (fallback)
        const clientes = await getClientes();
        
        // Converte IDs para string para garantir comparação correta
        const clienteEncontrado = clientes.find(cliente => 
            cliente.id.toString() === id.toString());
            
        if (clienteEncontrado) {
            return clienteEncontrado;
        } else {
            console.warn(`Cliente com ID ${id} não encontrado`);
            return null;
        }
        
    } catch (error) {
        console.error(`Erro ao buscar cliente com ID ${id}:`, error);
        return null;
    }
}



// Função para filtrar clientes
function filtrarClientes() {
    const input = document.getElementById('searchCliente');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('tabelaClientes');
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let encontrado = false;
        
        for (let j = 0; j < td.length - 1; j++) {
            const txtValue = td[j].textContent || td[j].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                encontrado = true;
                break;
            }
        }
        
        tr[i].style.display = encontrado ? '' : 'none';
    }
} 