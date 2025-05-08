

// Função para abrir o modal de cliente
function abrirCliente() {
    const conteudoHTML = `
        <form id="form-cliente" class="form-modal-secundario">
            <div class="barra-busca">
                <div class="campo-busca">
                    <label for="busca-cliente"></label>
                    <div class="input-com-botoes">
                        <input type="text" id="busca-cliente" name="busca-cliente" placeholder="Digite o nome do cliente" oninput="buscarClientes()">
                    </div>
                </div>
                <div class="acoes-modal acoes-modal-clientes">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="fecharModalSecundario()">Cancelar</button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarClienteSelecionado()">Selecionar</button>
                </div>
            </div>
            <div class="tabela-container">
                <table id="tabela-clientes" class="tabela-selecionar-cliente">
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody id="corpo-tabela-clientes">
                        <tr>
                            <td colspan="3" class="mensagem-busca">Carregando clientes...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    `;
    
    abrirModalSecundario({
        titulo: 'Selecionar Cliente',
        conteudo: conteudoHTML
    });

    // Carregar clientes após abrir o modal
    carregarClientes();
}

// Função para carregar clientes e preencher a tabela
function carregarClientes() {
    getClientes()
        .then(clientes => {
            const tabelaBody = document.getElementById('corpo-tabela-clientes');
            
            if (!tabelaBody) {
                console.error('Elemento corpo-tabela-clientes não encontrado');
                return;
            }
            
            if (!clientes || clientes.length === 0) {
                tabelaBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="sem-resultados">Nenhum cliente cadastrado</td>
                    </tr>`;
                return;
            }

            let html = '';
            clientes.forEach(cliente => {
                html += `
                    <tr>
                        <td>
                            <input type="radio" name="cliente" value="${cliente.id}" id="cliente-${cliente.id}">
                        </td>
                        <td>${cliente.nome || ''}</td>
                        <td>${cliente.telefone || cliente.email || ''}</td>
                    </tr>`;
            });
            
            tabelaBody.innerHTML = html;
        })
        .catch(error => {
            console.error('Erro ao carregar clientes:', error);
            const tabelaBody = document.getElementById('corpo-tabela-clientes');
            if (tabelaBody) {
                tabelaBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="sem-resultados">Erro ao carregar clientes</td>
                    </tr>`;
            }
        });
}

// Função para buscar clientes conforme o usuário digita
function buscarClientes() {
    const input = document.getElementById('busca-cliente');
    const filtro = input.value.toUpperCase();
    const tabela = document.getElementById('tabela-clientes');
    const linhas = tabela.getElementsByTagName('tr');
    let encontrados = 0;

    // Pular a linha do cabeçalho (índice 0)
    for (let i = 1; i < linhas.length; i++) {
        const celulas = linhas[i].getElementsByTagName('td');
        
        // Se for uma linha de mensagem (tem colspan), pular
        if (celulas.length <= 1) continue;
        
        let exibir = false;
        // Verificar o nome do cliente (índice 1)
        const texto = celulas[1].textContent || celulas[1].innerText;
        if (texto.toUpperCase().indexOf(filtro) > -1) {
            exibir = true;
            encontrados++;
        }
        
        linhas[i].style.display = exibir ? '' : 'none';
    }
    
    // Se não encontrou nenhum, mostrar mensagem
    if (encontrados === 0) {
        const tbody = document.getElementById('corpo-tabela-clientes');
        const todasLinhas = tbody.getElementsByTagName('tr');
        
        // Verificar se já tem uma mensagem de "nenhum resultado"
        let temMensagem = false;
        for (let i = 0; i < todasLinhas.length; i++) {
            if (todasLinhas[i].classList.contains('linha-sem-resultados')) {
                temMensagem = true;
                todasLinhas[i].style.display = '';
                break;
            }
        }
        
        // Se não tem, adicionar
        if (!temMensagem) {
            const mensagem = document.createElement('tr');
            mensagem.classList.add('linha-sem-resultados');
            mensagem.innerHTML = `<td colspan="3" class="sem-resultados">Nenhum cliente encontrado</td>`;
            tbody.appendChild(mensagem);
        }
    } else {
        // Esconder mensagem de "nenhum resultado" se existir
        const linhasMensagem = document.querySelectorAll('.linha-sem-resultados');
        linhasMensagem.forEach(linha => {
            linha.style.display = 'none';
        });
    }
}

// Função para aplicar o cliente selecionado ao pedido
function aplicarClienteSelecionado() {
    const clienteSelecionado = document.querySelector('input[name="cliente"]:checked');
    
    if (!clienteSelecionado) {
        alert('Selecione um cliente primeiro.');
        return;
    }
    
    const clienteId = clienteSelecionado.value;
    const clienteNome = clienteSelecionado.closest('tr').getElementsByTagName('td')[1].innerText;
    
    // Criar objeto com informações do cliente
    const infoCliente = {
        id: clienteId,
        nome: clienteNome
    };
    
    // Armazenar o cliente globalmente para ser usado ao finalizar o pedido
    window.clienteSelecionado = infoCliente;
    
    console.log(`Cliente selecionado: ${infoCliente.nome} (ID: ${infoCliente.id})`);
    
    // Fechar o modal
    fecharModalSecundario();
}