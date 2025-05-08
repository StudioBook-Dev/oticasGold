

function abrirModalPrincipal(parametro) {
    // Criar o modal se ele não existir
    let modalPrincipal = document.querySelector('.modalPrincipal');
    if (!modalPrincipal) {
        modalPrincipal = document.createElement('div');
        modalPrincipal.className = 'modalPrincipal';
        document.body.appendChild(modalPrincipal);
    }
    // Impedir o scroll no fundo
    document.body.style.overflow = 'hidden';
    // Conteúdo do modal
    modalPrincipal.innerHTML = `
        <div class="modal-overlay" onclick="fecharModalPrincipal()"></div>
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="modal-titulo">${parametro.titulo || 'Modal Principal'}</h2>
                <button class="modal-fechar" onclick="fecharModalPrincipal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-ferramentas" style="${parametro.adicionar ? 'border-bottom: 1px solid rgba(0, 0, 0, 0.08)' : ''} ">
                ${botaoAdicionar(parametro.titulo, parametro.adicionar) }
            </div>
            <div class="modal-conteudo">
                ${parametro.conteudo || 'Nenhum conteúdo fornecido.'}
            </div>
        </div>
    `;
    
    // Adicionar classe para animar a entrada
    setTimeout(() => {
        modalPrincipal.classList.add('ativo');
    }, 10);

    document.addEventListener('keydown', fecharModalPrincipalComEsc);
}



function botaoAdicionar(titulo, adicionar) {
    if (adicionar === true) {
        return `
            <button class="modal-adicionar btnResponsavelPorAdicionar" 
                onclick="abrirModalSecundario${titulo}()">
                <i class="fas fa-plus"></i>
                <span>Adicionar</span>
            </button>
        `;
    }else {
        return '';
    }
}
















