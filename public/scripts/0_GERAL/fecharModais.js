


function fecharModalPrincipal() {
    const modalPrincipal = document.querySelector('.modalPrincipal');
    if (modalPrincipal) {
        // Animar a saída
        modalPrincipal.classList.remove('ativo');
        // Restaurar o scroll
        document.body.style.overflow = 'auto'
        // Remover após a animação
        setTimeout(() => {
            modalPrincipal.remove();
        }, 300);
        // Remover o event listener da tecla Esc
        document.removeEventListener('keydown', fecharModalPrincipalComEsc);
    }
}


// Função para fechar o modal principal com a tecla Esc
function fecharModalPrincipalComEsc(event) {
    if (event.key === 'Escape') {
        // Verificar se existe um modal secundário aberto
        const modalSecundario = document.querySelector('.modal-secundario-overlay');
        if (modalSecundario) {
            // Se houver um modal secundário, não fecha o principal
            return;
        }
        fecharModalPrincipal();
    }
}


function fecharModalSecundario() {
    const overlay = document.querySelector('.modal-secundario-overlay');
    if (overlay) {
        // Remover a classe ativo para animar a saída
        overlay.classList.remove('ativo');
        
        // Remover o overlay após a animação
        setTimeout(() => {
            overlay.remove();
        }, 300);
        
        // Remover o event listener da tecla Esc
        document.removeEventListener('keydown', fecharModalSecundarioComEsc);
    }
}


// Função para fechar o modal secundário com a tecla Esc
function fecharModalSecundarioComEsc(event) {
    if (event.key === 'Escape') {
        fecharModalSecundario();
    }
}