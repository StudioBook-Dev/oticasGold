function abrirModalAnexarReceita() {
    abrirModalSecundario({
        titulo: 'Anexar Receita',
        conteudo: `
            <div class="container-anexar-receita">
                <div class="form-group">
                    <label for="arquivo-receita">Selecione um arquivo (imagem, doc ou pdf)</label>
                    <input type="file" id="arquivo-receita" accept=".jpg,.jpeg,.png,.doc,.docx,.pdf" class="form-control">
                </div>
                <div id="preview-receita" class="mt-3 d-none">
                    <h5>Arquivo selecionado:</h5>
                    <p id="nome-arquivo-receita"></p>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary" onclick="anexarReceita()">Confirmar</button>
                    <button class="btn btn-secondary" onclick="fecharModalSecundario()">Cancelar</button>
                </div>
            </div>
        `,
    });
    // Adicionar evento para mostrar preview do nome do arquivo
    setTimeout(() => {
        const inputArquivo = document.getElementById('arquivo-receita');
        if (inputArquivo) {
            inputArquivo.addEventListener('change', function() {
                const previewDiv = document.getElementById('preview-receita');
                const nomeArquivo = document.getElementById('nome-arquivo-receita');
                
                if (this.files.length > 0) {
                    previewDiv.classList.remove('d-none');
                    nomeArquivo.textContent = this.files[0].name;
                } else {
                    previewDiv.classList.add('d-none');
                }
            });
        }
    }, 300);
}


function anexarReceita() {
    const inputArquivo = document.getElementById('arquivo-receita');
    
    if (!inputArquivo || !inputArquivo.files || inputArquivo.files.length === 0) {
        exibirNotificacao('Selecione um arquivo para anexar a receita', 'erro');
        return;
    }
    
    const arquivo = inputArquivo.files[0];
    const tiposPermitidos = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!tiposPermitidos.includes(arquivo.type)) {
        exibirNotificacao('Formato de arquivo não permitido. Use imagem, PDF ou documento Word.', 'erro');
        return;
    }
    
    // Converter arquivo para base64 para armazenamento
    const leitor = new FileReader();
    leitor.onloadend = function() {
        
        // Criar objeto receita
        const receita = {
            id: gerarId(),
            nome: arquivo.name,
            tipo: arquivo.type,
            tamanho: arquivo.size,
            conteudo: leitor.result,
            dataHora: new Date().toISOString()
        };
        
        // Salvar a receita no localStorage
        salvarReceitaNoLocalStorage(receita);
        
        // Exibir a receita no console
        console.log('Receita anexada:', receita);
        
        // exibirNotificacao('Receita anexada com sucesso!', 'sucesso');
        fecharModalSecundario();
    };
    
    leitor.readAsDataURL(arquivo);
}


function salvarReceitaNoLocalStorage(receita) {
    localStorage.setItem('receitas', JSON.stringify(receita));
}










