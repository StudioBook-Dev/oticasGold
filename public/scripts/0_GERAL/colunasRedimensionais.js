// Função para inicializar colunas redimensionáveis em todas as tabelas
function inicializarColunasRedimensionais() {
    // Adiciona os estilos necessários
    const style = document.createElement('style');
    style.textContent = `
        .tabela-redimensionavel {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
            border: none;
        }
        .tabela-redimensionavel th,
        .tabela-redimensionavel td {
            border: none;
            border-bottom: 1px solid rgba(128, 128, 128, 0.2);
            padding: 8px;
            position: relative;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: width 0.1s ease;
        }
        .tabela-redimensionavel th,
        .tabela-redimensionavel tr:first-child td {
            font-weight: bold;
            border-bottom: 1px solid rgba(128, 128, 128, 0.3);
            user-select: none;
            position: relative;
        }
        .resizer {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            cursor: col-resize;
            z-index: 10;
            touch-action: none;
        }
        .resizer:hover {
            background: rgba(128, 128, 128, 0.2);
        }
        .resizer.active {
            background: rgba(128, 128, 128, 0.3);
        }
        .tabela-redimensionavel th.resizing,
        .tabela-redimensionavel td.resizing {
            opacity: 0.8;
            border-right: 1px solid rgba(128, 128, 128, 0.5);
        }
        .tabela-redimensionavel tbody tr:hover {
            background-color: rgba(128, 128, 128, 0.05);
        }
        .tabela-redimensionavel tbody tr:nth-child(even) {
            background-color: rgba(128, 128, 128, 0.03);
        }
        /* Tooltip para mostrar ajuda de redimensionamento */
        .coluna-resize-tooltip {
            position: fixed;
            background: rgba(70, 70, 70, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            z-index: 9999;
            display: none;
        }
    `;
    document.head.appendChild(style);

    // Cria tooltip para instruções
    const tooltip = document.createElement('div');
    tooltip.className = 'coluna-resize-tooltip';
    document.body.appendChild(tooltip);

    // Prefix para storage para evitar conflitos
    const STORAGE_PREFIX = 'tableColumnWidth_';

    // Função para gerar ID único para cada tabela
    function gerarIdTabela(tabela) {
        if (!tabela.id) {
            tabela.id = 'tabela_' + Math.random().toString(36).substr(2, 9);
        }
        return tabela.id;
    }

    // Função para salvar larguras no localStorage
    function salvarLarguras(tabela) {
        try {
            const tabelaId = gerarIdTabela(tabela);
            const headerRow = obterHeaderRow(tabela);
            if (!headerRow) return;

            const cells = headerRow.cells;
            const larguras = {};

            for (let i = 0; i < cells.length; i++) {
                if (cells[i].style.width) {
                    larguras[i] = cells[i].style.width;
                }
            }

            localStorage.setItem(STORAGE_PREFIX + tabelaId, JSON.stringify(larguras));
        } catch (e) {
            console.warn('Erro ao salvar larguras das colunas:', e);
        }
    }

    // Função para restaurar larguras do localStorage
    function restaurarLarguras(tabela) {
        try {
            const tabelaId = gerarIdTabela(tabela);
            const largurasSalvas = localStorage.getItem(STORAGE_PREFIX + tabelaId);

            if (largurasSalvas) {
                const larguras = JSON.parse(largurasSalvas);
                const headerRow = obterHeaderRow(tabela);
                if (!headerRow) return;

                const cells = headerRow.cells;

                Object.entries(larguras).forEach(([index, largura]) => {
                    const idx = parseInt(index);
                    if (cells[idx]) {
                        cells[idx].style.width = largura;

                        // Atualiza também todas as células desta coluna
                        atualizarTodasCelulasColuna(tabela, idx, largura);
                    }
                });
            }
        } catch (e) {
            console.warn('Erro ao restaurar larguras das colunas:', e);
        }
    }

    // Função para obter a linha de cabeçalho (th ou primeira linha)
    function obterHeaderRow(tabela) {
        // Primeiro procura por th
        const thead = tabela.querySelector('thead');
        if (thead && thead.rows.length > 0) {
            return thead.rows[0];
        }

        // Se não encontrar, usa a primeira linha da tabela
        if (tabela.rows.length > 0) {
            return tabela.rows[0];
        }

        return null;
    }

    // Função para atualizar todas as células de uma coluna
    function atualizarTodasCelulasColuna(tabela, colIndex, largura) {
        // Pula a primeira linha se for cabeçalho
        const startIndex = (tabela.querySelector('thead')) ? 0 : 1;

        for (let i = startIndex; i < tabela.rows.length; i++) {
            const row = tabela.rows[i];
            if (row.cells[colIndex]) {
                row.cells[colIndex].style.width = largura;
            }
        }
    }

    // Função para calcular a largura ideal baseada no conteúdo
    function calcularLarguraIdeal(tabela, colIndex) {
        let maxWidth = 50; // largura mínima

        // Itera por todas as linhas
        for (let i = 0; i < tabela.rows.length; i++) {
            const row = tabela.rows[i];
            if (row.cells[colIndex]) {
                const cell = row.cells[colIndex];

                // Clona a célula para medir seu conteúdo sem afetar o layout
                const clone = cell.cloneNode(true);
                clone.style.width = 'auto';
                clone.style.position = 'absolute';
                clone.style.visibility = 'hidden';
                clone.style.whiteSpace = 'nowrap';
                document.body.appendChild(clone);

                const width = clone.getBoundingClientRect().width + 20; // adiciona um pouco de padding
                maxWidth = Math.max(maxWidth, width);

                document.body.removeChild(clone);
            }
        }

        return maxWidth + 'px';
    }

    // Função para verificar se a tabela tem uma estrutura válida
    function tabelaTemEstruturaValida(tabela) {
        return tabela.rows && tabela.rows.length > 0 && tabela.rows[0].cells && tabela.rows[0].cells.length > 0;
    }

    // Função para configurar uma tabela específica
    function configurarTabela(tabela) {
        // Ignora tabelas sem linhas ou células
        if (!tabelaTemEstruturaValida(tabela)) {
            console.warn('Tabela sem estrutura válida foi ignorada:', tabela);
            return;
        }

        if (!tabela.classList.contains('tabela-redimensionavel')) {
            tabela.classList.add('tabela-redimensionavel');
        }

        // Gera ID para a tabela se não tiver
        gerarIdTabela(tabela);

        // Obtém a linha de cabeçalho (th ou primeira linha)
        const headerRow = obterHeaderRow(tabela);
        if (!headerRow) return;

        const headerCells = headerRow.cells;

        // Configura cada célula de cabeçalho
        for (let colIndex = 0; colIndex < headerCells.length; colIndex++) {
            const headerCell = headerCells[colIndex];

            // Remove resizer existente se houver
            const resizerExistente = headerCell.querySelector('.resizer');
            if (resizerExistente) {
                resizerExistente.remove();
            }

            const resizer = document.createElement('div');
            resizer.className = 'resizer';
            headerCell.appendChild(resizer);

            let startX, startWidth;

            // Função para mostrar tooltip
            function mostrarTooltip(e) {
                tooltip.style.display = 'block';
                tooltip.style.left = (e.clientX + 10) + 'px';
                tooltip.style.top = (e.clientY + 10) + 'px';
            }

            // Função para esconder tooltip
            function esconderTooltip() {
                tooltip.style.display = 'none';
            }

            // Função para iniciar o redimensionamento
            function iniciarRedimensionamento(e) {
                e.preventDefault();
                startX = e.clientX || (e.touches && e.touches[0].clientX);
                startWidth = headerCell.offsetWidth;
                headerCell.classList.add('resizing');
                resizer.classList.add('active');

                document.addEventListener('mousemove', moverRedimensionamento);
                document.addEventListener('touchmove', moverRedimensionamento, { passive: false });
                document.addEventListener('mouseup', finalizarRedimensionamento);
                document.addEventListener('touchend', finalizarRedimensionamento);

                esconderTooltip();
            }

            // Função para mover durante o redimensionamento
            function moverRedimensionamento(e) {
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                if (!clientX) return;

                e.preventDefault();
                const width = startWidth + (clientX - startX);
                if (width > 50) { // Largura mínima de 50px
                    headerCell.style.width = `${width}px`;

                    // Atualiza também todas as células desta coluna
                    atualizarTodasCelulasColuna(tabela, colIndex, `${width}px`);
                }
            }

            // Função para finalizar o redimensionamento
            function finalizarRedimensionamento() {
                headerCell.classList.remove('resizing');
                resizer.classList.remove('active');

                document.removeEventListener('mousemove', moverRedimensionamento);
                document.removeEventListener('touchmove', moverRedimensionamento);
                document.removeEventListener('mouseup', finalizarRedimensionamento);
                document.removeEventListener('touchend', finalizarRedimensionamento);

                // Salva as larguras após o redimensionamento
                salvarLarguras(tabela);
            }

            // Adiciona evento para duplo clique - auto-ajuste ao conteúdo
            headerCell.addEventListener('dblclick', () => {
                const larguraIdeal = calcularLarguraIdeal(tabela, colIndex);
                headerCell.style.width = larguraIdeal;

                // Atualiza também todas as células desta coluna
                atualizarTodasCelulasColuna(tabela, colIndex, larguraIdeal);

                // Salva as larguras após o auto-ajuste
                salvarLarguras(tabela);
            });

            // Mostra tooltip ao passar o mouse
            resizer.addEventListener('mouseenter', mostrarTooltip);
            resizer.addEventListener('mouseleave', esconderTooltip);

            // Adiciona eventos de mouse e toque
            resizer.addEventListener('mousedown', iniciarRedimensionamento);
            resizer.addEventListener('touchstart', iniciarRedimensionamento, { passive: false });
        }

        // Restaura larguras salvas anteriormente
        restaurarLarguras(tabela);
    }

    // Função para processar todas as tabelas existentes
    function processarTodasTabelas() {
        const tabelas = document.querySelectorAll('table:not(.tabela-redimensionavel)');
        if (tabelas.length > 0) {
            console.log(`Encontradas ${tabelas.length} tabelas para configurar`);
            tabelas.forEach(configurarTabela);
        }
    }

    // Configura todas as tabelas existentes
    processarTodasTabelas();

    // Observa novas tabelas adicionadas ao DOM
    const observer = new MutationObserver((mutations) => {
        let novasTabelasEncontradas = false;

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    // Se é uma tabela diretamente
                    if (node.nodeName === 'TABLE') {
                        configurarTabela(node);
                        novasTabelasEncontradas = true;
                    }
                    // Se contém tabelas
                    else if (node.querySelectorAll) {
                        const tabelas = node.querySelectorAll('table:not(.tabela-redimensionavel)');
                        if (tabelas.length > 0) {
                            tabelas.forEach(configurarTabela);
                            novasTabelasEncontradas = true;
                        }
                    }
                });

                // Verifica modificações em tabelas existentes (adição de linhas ou células)
                if (mutation.target.nodeName === 'TABLE' ||
                    mutation.target.nodeName === 'TBODY' ||
                    mutation.target.nodeName === 'THEAD') {
                    const tabela = mutation.target.closest('table');
                    if (tabela && !tabela.dataset.observandoMutacoes) {
                        tabela.dataset.observandoMutacoes = 'true';
                        configurarTabela(tabela);
                        novasTabelasEncontradas = true;
                    }
                }
            }
        });

        // Executa uma verificação adicional após um pequeno delay para casos de tabelas carregadas dinamicamente
        if (novasTabelasEncontradas) {
            setTimeout(processarTodasTabelas, 500);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Limpa observador quando a página é fechada
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

    // Adiciona função para reinicializar em caso de problemas
    window.reinicializarColunasRedimensionais = function () {
        // Remove a classe de todas as tabelas para permitir reinicialização
        document.querySelectorAll('.tabela-redimensionavel').forEach(tabela => {
            tabela.classList.remove('tabela-redimensionavel');
            delete tabela.dataset.observandoMutacoes;
        });
        // Reinicializa todas
        processarTodasTabelas();
        return `Reinicialização concluída. ${document.querySelectorAll('table').length} tabelas encontradas.`;
    };
}

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarColunasRedimensionais);
} else {
    // Se o DOM já estiver carregado
    inicializarColunasRedimensionais();
}

// Exporta a função para uso manual se necessário
window.inicializarColunasRedimensionais = inicializarColunasRedimensionais;
