async function salvarCupomNaPlanilha(editar = false) {

    const cupom = {
        id: editar && editar.id ? editar.id : null, // O backend vai gerar um ID se for null
        nome: document.getElementById('nomeCupom').value,
        valor: document.getElementById('valorCupom').value,
        tipo: document.querySelector('input[name="tipoCupom"]:checked').value
    };

    // Validar campos obrigatórios
    if (!cupom.nome.trim()) {
        alert('O nome do cupom é obrigatório.');
        return false;
    }

    if (!cupom.valor || isNaN(parseFloat(cupom.valor))) {
        alert('O valor do cupom deve ser um número válido.');
        return false;
    }

    document.getElementById('formCupom').innerHTML = '<div class="loading">Salvando cupom...</div>';

    try {
        let response;
        
        if (editar && editar.id) {
            // Atualizar cupom existente usando API SQLite
            response = await fetch(`/api/cupons/${cupom.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cupom)
            });
        } else {
            // Criar novo cupom usando API SQLite
            response = await fetch('/api/cupons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cupom)
            });
        }
        
        if (!response.ok) {
            throw new Error(`Erro ao ${editar ? 'atualizar' : 'salvar'} o cupom`);
        }
        
        const data = await response.json();
        
        alert(`Cupom ${editar ? 'atualizado' : 'salvo'} com sucesso!`);
        fecharModalSecundario();
        abrirModalCupons();
        
    } catch (error) {
        console.error(`Erro ao ${editar ? 'atualizar' : 'salvar'} cupom:`, error);
        alert(`Erro ao ${editar ? 'atualizar' : 'salvar'} o cupom. Por favor, tente novamente.`);
        abrirModalSecundarioCupom(editar ? cupom : null);
    }
} 