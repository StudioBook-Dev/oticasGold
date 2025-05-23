

async function opcoesSelecionaveis(dados) { 
    let conteudo = '';
    // Adicionar novas opções
    dados.forEach(dado => {
        conteudo += `<option> ${dado.nome} </option> `
    });
    return conteudo;
}




