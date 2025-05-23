

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




