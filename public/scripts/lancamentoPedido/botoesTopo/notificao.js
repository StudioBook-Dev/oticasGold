

function statusIconeNoModalPrincipalPedido(id, incluir = true) {

    const icone = document.querySelector(`.btn-icone-lancamento-${id}`)

    if (icone) {
        const indicadorExistente = icone.querySelector('.status-indicador')
        // Remove qualquer indicador existente
        if (indicadorExistente) {  indicadorExistente.remove()  }
        // Caso cancele o cliente, remove o indicador
        if (incluir === false)  {  indicadorExistente.remove()  }
        // Cria o novo indicador
        if (incluir === true) {
            const indicador = document.createElement('div')
            indicador.className = 'status-indicador'
            indicador.style.cssText = `
                width: 0.8em;
                height: 0.8em;
                background-color: #4CAF50;
                border-radius: 50%;
                position: absolute;
                margin-top: 2em;
                margin-left: 2em;
            `
            icone.appendChild(indicador)
        }
    }
    else{
        console.log('icone não encontrado')
    }
}


