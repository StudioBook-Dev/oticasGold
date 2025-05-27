

function getItensPedidoInLocalStorage() {
    const cupom = JSON.parse(localStorage.getItem('cupom'))
    const frete = JSON.parse(localStorage.getItem('frete'))
    const cliente = JSON.parse(localStorage.getItem('cliente'))
    const desconto = JSON.parse(localStorage.getItem('desconto'))
    const observacao = JSON.parse(localStorage.getItem('observacao'))
    const itensPedido = JSON.parse(localStorage.getItem('itensPedido'))
    const data = {
        itensPedido: itensPedido || [],
        cupom: cupom || 0,
        frete: frete || 0,
        desconto: desconto || 0,
        cliente: cliente || [],
        observacao: observacao || ''
    }
    return data
}


function setItensPedidoInLocalStorage(item) {
    const itensPedido = JSON.parse(localStorage.getItem('itensPedido')) || []
    // Procura se já existe um item com o mesmo ID
    const itemExistente = itensPedido.find(itemExistente => itemExistente.id === item.id)
    if (itemExistente) {
        // Se o item já existe, aumenta a quantidade
        itemExistente.quantidade += item.quantidade || 1
    } else {
        // Se o item não existe, adiciona o novo item
        itensPedido.push(item)
    }
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






