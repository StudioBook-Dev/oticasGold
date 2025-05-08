// Script para alternar entre temas claro e escuro

// Função para alternar o tema
function alternarTema() {
    // Alterna a classe 'dark-theme' no body
    document.body.classList.toggle('dark-theme');
    
    // Altera o ícone do botão (lua/sol)
    const icon = document.querySelector('.theme-toggle i');
    if (icon.classList.contains('fa-moon')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Salva a preferência do usuário no localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
}

// Verifica a preferência do tema ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há preferência salva no localStorage
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
        document.body.classList.add('dark-theme');
        document.querySelector('.theme-toggle i').classList.remove('fa-moon');
        document.querySelector('.theme-toggle i').classList.add('fa-sun');
    }
});




