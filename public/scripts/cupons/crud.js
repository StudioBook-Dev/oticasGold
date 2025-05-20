

// Função para buscar todos os cupons da API
async function getCupons() {
    try {
        const response = await fetch('/api/cupons');        
        if (!response.ok) {
            throw new Error(`Erro ao buscar cupons: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar cupons:', error);
        return [];
    }
}


// Função para buscar um cupom pelo ID
async function getCupomById(id) {
    try {
        const response = await fetch(`/api/cupons/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar cupom: ${response.status} ${response.statusText}`);
        }   
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar cupom:', error);
        return null;
    }
}


// Função para excluir um cupom pelo ID
function deleteCupom(id) {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
        fetch(`/api/cupons/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Cupom excluído com sucesso!');
            gerarTabelaCupons(); // Atualizar a tabela
        })
        .catch(error => {
            console.error('Erro ao excluir cupom:', error);
            alert('Erro ao excluir cupom.');
        });
    }
}


// Função para salvar um novo cupom
function postCupom(cupom) {
    fetch('/api/cupons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cupom)
    })
    .then(response => response.json())
    .then(data => {
        alert('Cupom salvo com sucesso!');
        fecharModalSecundario();
        gerarTabelaCupons();
    })
    .catch(error => {
        console.error('Erro ao salvar cupom:', error);
        alert('Erro ao salvar cupom.');
    });
}


// Função para salvar a edição do cupom
function putCupom(cupom) {
    fetch(`/api/cupons/${cupom.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cupom)
    })
    .then(response => response.json())
    .then(data => {
        alert('Cupom atualizado com sucesso!');
        fecharModalSecundario();
        gerarTabelaCupons(); 
    })
    .catch(error => {
        console.error('Erro ao atualizar cupom:', error);
        alert('Erro ao atualizar cupom.');
    });
}

