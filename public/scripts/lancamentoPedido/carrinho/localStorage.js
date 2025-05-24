

function getItensPedidoInLocalStorage() {
    let valorItens = 0
    const cupom = JSON.parse(localStorage.getItem('cupom')) || []
    const frete = JSON.parse(localStorage.getItem('frete')) || 0
    const cliente = JSON.parse(localStorage.getItem('cliente')) || []
    const desconto = JSON.parse(localStorage.getItem('desconto')) || 0
    const observacao = JSON.parse(localStorage.getItem('observacao')) || ''
    const itensPedido = JSON.parse(localStorage.getItem('itensPedido')) || []

    if (itensPedido.length > 0) {
        itensPedido.forEach(item => {
            valorItens += parseFloat(item.preco) * item.quantidade
        })
    }

    const data = {
        itensPedido: {
            valor: valorItens,
            data: itensPedido
        },
        cupom: {
            valor: parseFloat(cupom.valor) || 0,
            data: cupom
        },
        frete: parseFloat(frete) || 0,
        desconto: parseFloat(desconto) || 0,
        cliente,
        observacao
    }

    return data
}


function setItensPedidoInLocalStorage(item) {
    const itensPedido = localStorage.getItem('itensPedido') || []
    itensPedido.push(item)
    localStorage.setItem('itensPedido', JSON.stringify(itensPedido))
}


function resetItensDoPedidoInLocalStorage() {
    localStorage.removeItem("cliente");
    localStorage.removeItem("cupom");
    localStorage.removeItem("frete");
    localStorage.removeItem("desconto");
    localStorage.removeItem("observacao");
    localStorage.removeItem("itensPedido");
}






