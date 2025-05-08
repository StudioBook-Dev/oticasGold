

function abrirModalSecundario(parametro) {
    // Criar o elemento do overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-secundario-overlay';

    // Criar o HTML do modal
    const modalHTML = `
        <div class="modal-secundario">
            <div class="modal-secundario-cabecalho">
                <h2 class="modal-secundario-titulo">${parametro.titulo || 'Modal Secundário'}</h2>
                <button class="modal-secundario-fechar" onclick="fecharModalSecundario()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-secundario-corpo">
                ${parametro.conteudo || ''}
            </div>
        </div>
    `;

    // Adicionar o HTML ao overlay
    overlay.innerHTML = modalHTML;

    // Adicionar o overlay ao body
    document.body.appendChild(overlay);

    // Adicionar evento de fechar ao clicar fora do modal
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            fecharModalSecundario();
        }
    });

    // Adicionar classe para animar a entrada
    setTimeout(() => {
        overlay.classList.add('ativo');
    }, 10);
    
    // Adicionar event listener para a tecla Esc
    document.addEventListener('keydown', fecharModalSecundarioComEsc);
}






