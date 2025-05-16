async function excluirTodosItens(tabela) {
    try {
        const response = await fetch(`/api/excluir-todos/${tabela}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            // console.error('Erro na resposta:', data);
            throw new Error(data.mensagem || `Erro ao excluir itens da tabela ${tabela}`);
        }

        alert(data.mensagem || `Itens da tabela ${tabela} excluídos com sucesso`);
        fecharModalSecundario();
        window.location.reload();
    } catch (error) {
        // console.error('Erro detalhado:', error);
        alert('Erro ao excluir itens: ' + error.message);
    }
}

