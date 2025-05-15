 

 function botaoSalvar(parametros) {
    console.log(parametros)
    const {id , icon, onClick, type} = parametros
    const icone = icones[icon]
    const conteudo = `
        <button 
            id="${id || ''}" 
            class="botao-salvar" 
            type="${type || 'button'}" 
            onclick="${onClick || ''}">
            <i class="${icone || ''}"></i>
            Salvar
        </button>
    `
    return conteudo
 }
 
