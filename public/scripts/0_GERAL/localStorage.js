


function setTelaAtualLocalStorage(tela) {
    localStorage.setItem('telaAtual', tela);
    if (tela === 'dashboard') {
        document.getElementById(`btn-kanban`).classList.remove('active-text-button');
        document.getElementById(`btn-dashboard`).classList.add('active-text-button');
    } else if (tela === 'kanban') {
        document.getElementById(`btn-kanban`).classList.add('active-text-button');
        document.getElementById(`btn-dashboard`).classList.remove('active-text-button');
    }
}

function getTelaAtualLocalStorage() {
    const telaAtual = localStorage.getItem('telaAtual' || []);
    return telaAtual;
}










