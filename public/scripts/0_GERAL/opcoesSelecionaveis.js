

async function opcoesSelecionaveis(dados) { 
    console.log(dados)
    let conteudo = '';
    // Adicionar novas opções
    dados.forEach(dado => {
        conteudo += `<option> ${dado.nome} </option> `
    });
    return conteudo;
}




