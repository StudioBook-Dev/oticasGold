
// dataFormatada
function dataFormatada() {
    const dataAtual = new Date();
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
    const ano = String(dataAtual.getFullYear());
    const hora = String(dataAtual.getHours()).padStart(2, '0');
    const minuto = String(dataAtual.getMinutes()).padStart(2, '0');
    const segundo = String(dataAtual.getSeconds()).padStart(2, '0');
    const data = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
    const id = ano + mes + dia + hora + minuto + segundo
    return {
        id,
        data,
        dia,
        mes,
        ano,
        hora,
        minuto,
        segundo,
    }
}

function gerarId() {
    const objreturn = dataFormatada().id
    return objreturn
}













