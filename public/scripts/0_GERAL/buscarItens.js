
/**
 * Sistema de busca para os modais que possuem tabelas
 * Filtra as linhas da tabela com base no texto digitado no campo de busca
 */

document.addEventListener('DOMContentLoaded', function() {
    // Monitora quando o campo de busca recebe foco
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('modal-busca')) {
            configurarBusca(e.target);
        }
    });
    
    // Monitora quando um modal é aberto para configurar a busca
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    let node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains('modalPrincipal')) {
                        let inputBusca = node.querySelector('.modal-busca');
                        if (inputBusca) {
                            setTimeout(function() {
                                configurarBusca(inputBusca);
                            }, 100);
                        }
                    }
                }
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

/**
 * Configura o sistema de busca para um campo de busca específico
 */
function configurarBusca(inputBusca) {
    // Encontra o contêiner do modal
    const modalContainer = inputBusca.closest('.modalPrincipal');
    if (!modalContainer) return;
    
    // Encontra a tabela dentro do modal
    const tabela = modalContainer.querySelector('.modal-conteudo table');
    if (!tabela) return;
    
    // Encontra todas as linhas da tabela (exceto cabeçalho)
    const linhas = tabela.querySelectorAll('tbody tr');
    if (!linhas.length) return;
    
    // Guarda a referência ao tbody para poder reordenar as linhas
    const tbody = tabela.querySelector('tbody');
    if (!tbody) return;
    
    // Função que filtra a tabela em tempo real
    function filtrarTabela() {
        const textoBusca = inputBusca.value.toLowerCase().trim();
        let encontrouResultados = false;
        
        // Array para armazenar as linhas e suas pontuações de relevância
        const linhasRelevantes = [];
        
        // Percorre todas as linhas da tabela para calcular relevância
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i];
            const celulas = linha.querySelectorAll('td');
            let pontuacao = 0;
            let melhorMatch = '';
            
            // Verifica cada célula da linha
            for (let j = 0; j < celulas.length; j++) {
                const textoCelula = celulas[j].textContent.toLowerCase();
                
                // Se o texto da célula contém o texto buscado
                if (textoBusca && textoCelula.includes(textoBusca)) {
                    encontrouResultados = true;
                    
                    // Pontuação mais alta se começar com o texto buscado
                    if (textoCelula.startsWith(textoBusca)) {
                        pontuacao = Math.max(pontuacao, 100); // Prioridade máxima
                        melhorMatch = textoCelula;
                    } else {
                        // Posição do texto na célula (quanto mais cedo, melhor)
                        const posicao = textoCelula.indexOf(textoBusca);
                        const novaPontuacao = 90 - posicao;
                        if (novaPontuacao > pontuacao) {
                            pontuacao = novaPontuacao;
                            melhorMatch = textoCelula;
                        }
                    }
                }
            }
            
            // Se encontrou o texto na linha, adiciona ao array de resultados
            if (pontuacao > 0) {
                linhasRelevantes.push({
                    elemento: linha,
                    pontuacao: pontuacao,
                    texto: melhorMatch
                });
            }
            
            // Oculta todas as linhas inicialmente
            linha.style.display = 'none';
        }
        
        // Ordena as linhas por pontuação (mais relevante primeiro) e depois alfabeticamente
        linhasRelevantes.sort((a, b) => {
            // Se as pontuações são diferentes, ordena por pontuação (mais alta primeiro)
            if (a.pontuacao !== b.pontuacao) {
                return b.pontuacao - a.pontuacao;
            }
            // Se as pontuações são iguais, ordena alfabeticamente
            return a.texto.localeCompare(b.texto);
        });
        
        // Reordena as linhas no DOM e as torna visíveis
        if (textoBusca && linhasRelevantes.length > 0) {
            // Remove todas as linhas do tbody
            const fragmento = document.createDocumentFragment();
            
            // Adiciona as linhas relevantes em ordem no fragmento
            linhasRelevantes.forEach(item => {
                item.elemento.style.display = '';
                fragmento.appendChild(item.elemento);
            });
            
            // Adiciona as linhas não relevantes ao final (mantidas ocultas)
            for (let i = 0; i < linhas.length; i++) {
                const linha = linhas[i];
                if (linha.style.display === 'none') {
                    fragmento.appendChild(linha);
                }
            }
            
            // Substitui o conteúdo do tbody pelo fragmento ordenado
            tbody.innerHTML = '';
            tbody.appendChild(fragmento);
        } else if (!textoBusca) {
            // Se não há texto de busca, mostra todas as linhas na ordem original
            for (let i = 0; i < linhas.length; i++) {
                linhas[i].style.display = '';
            }
        }
        
        // Gerencia a mensagem de nenhum resultado
        const modalConteudo = modalContainer.querySelector('.modal-conteudo');
        let mensagemSemResultados = modalConteudo.querySelector('.sem-resultados');
        
        if (!encontrouResultados && textoBusca !== '') {
            // Cria a mensagem se não existir
            if (!mensagemSemResultados) {
                mensagemSemResultados = document.createElement('div');
                mensagemSemResultados.className = 'sem-resultados';
                mensagemSemResultados.textContent = 'Nenhum resultado encontrado.';
                mensagemSemResultados.style.cssText = 'text-align: center; padding: 20px; color: #666;';
                modalConteudo.appendChild(mensagemSemResultados);
            }
            mensagemSemResultados.style.display = 'block';
        } else if (mensagemSemResultados) {
            mensagemSemResultados.style.display = 'none';
        }
    }
    
    // Remove eventos anteriores (se houver)
    inputBusca.removeEventListener('input', filtrarTabela);
    
    // Adiciona o evento para filtrar em tempo real
    inputBusca.addEventListener('input', filtrarTabela);
    
    // Limpa o campo e foca nele
    inputBusca.value = '';
    inputBusca.focus();
}