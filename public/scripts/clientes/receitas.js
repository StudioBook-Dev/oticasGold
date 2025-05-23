

function constructReceita(id) {
    // Capturar arquivo de receita
    const arquivo = document.getElementById('receitaArquivo').files[0];
    // Verificar se um arquivo foi selecionado
    if (!arquivo) {
        console.log('Nenhum arquivo de receita foi selecionado');
        return;
    }
    // Manter a extensão original do arquivo
    const extensaoOriginal = arquivo.name.substring(arquivo.name.lastIndexOf('.'));
    const novoNome = `${id}${extensaoOriginal}`;
    // Criar FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('novoNome', novoNome);
    formData.append('clienteId', id);
    // Enviar arquivo para o servidor
    fetch('/api/upload-receita', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Erro ao fazer upload da receita');
        })
        .then(data => {
            console.log('Receita salva com sucesso:', data);
            alert('Cliente e receita salvos com sucesso!');
            fecharModalSecundario();
        })
        .catch(error => {
            console.error('Erro ao salvar receita:', error);
            alert('Cliente salvo, mas houve erro ao salvar a receita. Tente novamente.');
        });
}


function verificarReceita(id) {
    // Buscar elemento onde mostrar o resultado
    const containerReceita = document.getElementById('receita-info');
    if (!containerReceita) {
        console.error('Container receita-info não encontrado');
        return;
    }
    // Mostrar loading
    containerReceita.innerHTML = '<small class="text-muted">Verificando receita...</small>';
    // Fazer requisição para verificar se existe receita
    fetch(`/api/verificar-receita/${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.existe) {
                // Receita encontrada - mostrar opção de visualizar
                containerReceita.innerHTML = `
                    <div class="receita-encontrada" style="margin-top: 5px;">
                        <small class="text-success">✓ Receita encontrada: ${data.arquivo.nome}</small>
                        <br>
                        <button type="button" class="btn-visualizar-receita" 
                                onclick="visualizarReceita('${id}', '${data.arquivo.nome}')"
                                style="margin-top: 3px; padding: 3px 8px; font-size: 12px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            👁️ Visualizar Receita
                        </button>
                        <button type="button" class="btn-baixar-receita" 
                                onclick="baixarReceita('${id}', '${data.arquivo.nome}')"
                                style="margin-left: 5px; margin-top: 3px; padding: 3px 8px; font-size: 12px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            📥 Baixar
                        </button>
                    </div>
                `;
            } else {
                // Nenhuma receita encontrada
                containerReceita.innerHTML = `
                    <small class="text-muted">Nenhuma receita anexada</small>
                `;
            }
        })
        .catch(error => {
            console.error('Erro ao verificar receita:', error);
            containerReceita.innerHTML = `
                <small class="text-danger">Erro ao verificar receita</small>
            `;
        });
}


// Função para visualizar receita em nova aba
function visualizarReceita(clienteId, nomeArquivo) {
    const url = `/api/receita/${clienteId}`;
    window.open(url, '_blank');
}


// Função para baixar receita
function baixarReceita(clienteId, nomeArquivo) {
    const url = `/api/receita/${clienteId}`;
    // Criar link temporário para download
    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.target = '_blank';
    // Simular clique no link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



