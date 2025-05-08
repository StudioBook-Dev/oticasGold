async function editarPedido(idPedido) {
    const pedidos = await getPedidos();
    const pedido = pedidos.find(p => p.id.toString() === idPedido.toString());

    if (pedido) {
        console.log('Editando pedido:', pedido);
        
        // Verificar os produtos do pedido
        console.log('Produtos no pedido original:', pedido.produtos);
        
        // Garantir que os produtos estejam no formato correto
        let produtosFormatados = [];
        if (Array.isArray(pedido.produtos)) {
            produtosFormatados = [...pedido.produtos];
        } else if (typeof pedido.produtos === 'string') {
            try {
                produtosFormatados = JSON.parse(pedido.produtos);
            } catch (e) {
                console.error('Erro ao converter produtos de string para array:', e);
                produtosFormatados = [];
            }
        }
        
        console.log('Produtos formatados:', produtosFormatados);
        
        // Corrigir propriedades dos produtos se necessário
        produtosFormatados = produtosFormatados.map(produto => {
            // Garantir que o preço tenha o formato correto (com R$ se não tiver)
            let precoFormatado = produto.preco || '0,00';
            if (!precoFormatado.includes('R$')) {
                precoFormatado = `R$ ${precoFormatado}`;
            }
            
            // Garantir que todos os produtos tenham as propriedades necessárias
            return {
                id: produto.id,
                nome: produto.nome || 'Produto sem nome',
                quantidade: produto.quantidade || 1,
                preco: precoFormatado
            };
        });
        
        // Criar objeto com todos os dados do pedido
        const dados = {
            produtosCarrinho: produtosFormatados,
            valorFrete: parseFloat(pedido.frete.toString().replace(',', '.')) || 0,
            valorDesconto: parseFloat(pedido.desconto.toString().replace(',', '.')) || 0,
            observacaoPedido: pedido.observacao || '',
            pedidoOriginal: JSON.parse(JSON.stringify(pedido)),
            modoEdicaoPedido: true
        };
        
        // Definir cliente
        if (pedido.cliente) {
            if (typeof pedido.cliente === 'string') {
                try {
                    dados.clienteSelecionado = JSON.parse(pedido.cliente);
                } catch (e) {
                    dados.clienteSelecionado = { nome: pedido.cliente };
                }
            } else {
                dados.clienteSelecionado = pedido.cliente;
            }
        }
        
        console.log('Produtos no carrinho após formatação:', dados.produtosCarrinho);
        
        // Abrir o modal de lançamento com status de pedido para edição
        abrirModalPrincipalPedidos();
        
        // Mudar o título do modal e atualizar o carrinho
        setTimeout(() => {
            // Atualizar o título do modal
            const tituloModal = document.querySelector('.modal-titulo');
            if (tituloModal) {
                tituloModal.textContent = `Editar Pedido #${pedido.id}`;
            }
            
            // Atualizar o carrinho para mostrar os produtos do pedido
            const carrinhoContainer = document.querySelector('.coluna.carrinho');
            if (carrinhoContainer) {
                console.log('Atualizando carrinho com produtos:', dados.produtosCarrinho);
                if (dados.produtosCarrinho && dados.produtosCarrinho.length > 0) {
                    // Gerar o HTML do carrinho usando a função do editarCarrinho.js
                    const htmlCarrinhoEditado = gerarHTMLCarrinhoEditando(
                        dados.produtosCarrinho, 
                        dados.valorFrete, 
                        dados.valorDesconto
                    );
                    carrinhoContainer.innerHTML = htmlCarrinhoEditado;
                } else {
                    console.warn('Nenhum produto no carrinho para exibir');
                }
            } else {
                console.error('Container do carrinho não encontrado');
            }
            
            // Sobrescrever a função de adicionar ao carrinho para preservar os produtos existentes
            if (typeof sobrescreverFuncaoAdicionarAoCarrinho === 'function') {
                let dadosAtualizados = sobrescreverFuncaoAdicionarAoCarrinho(dados);
                
                // Reconfigurar os botões do carrinho
                if (typeof reconfigurarBotoesCarrinho === 'function') {
                    dadosAtualizados = reconfigurarBotoesCarrinho(dadosAtualizados);
                } else {
                    console.warn('Função reconfigurarBotoesCarrinho não encontrada, configurando botões manualmente');
                    
                    // Adicionar event listeners para os botões de adicionar ao carrinho (modo alternativo)
                    const btnsCarrinho = document.querySelectorAll('.btn-carrinho-colunas');
                    btnsCarrinho.forEach(btn => {
                        // Clone o botão para remover event listeners antigos
                        const cloneBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(cloneBtn, btn);
                        
                        // Adicionar novo event listener com closure para acessar os dados
                        cloneBtn.addEventListener('click', function(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            if (typeof adicionarAoCarrinhoEditando === 'function') {
                                adicionarAoCarrinhoEditando(dadosAtualizados);
                            } else {
                                console.error('Função adicionarAoCarrinhoEditando não encontrada!');
                            }
                        });
                    });
                }
                
                // Adicionar botões de ação específicos do modo de edição
                adicionarBotoesEdicao(carrinhoContainer, dadosAtualizados, pedido.id);
            } else {
                console.error('Função sobrescreverFuncaoAdicionarAoCarrinho não encontrada!');
            }
            
        }, 1000); // Atraso para garantir que o modal foi renderizado completamente
        
    } else {
        console.log('Pedido não encontrado');
        alert('Pedido não encontrado!');
    }
}

/**
 * Adiciona botões específicos para o modo de edição
 * @param {HTMLElement} container - Container onde os botões serão adicionados
 * @param {Object} dados - Dados do pedido em edição
 * @param {string} idPedido - ID do pedido sendo editado
 */
function adicionarBotoesEdicao(container, dados, idPedido) {
    // Verificar se o container existe
    if (!container) return;
    
    // Adicionar rótulo indicando modo de edição
    const rotulo = document.createElement('div');
    rotulo.className = 'modo-edicao-rotulo';
    rotulo.innerHTML = '<i class="fas fa-edit"></i> Modo de Edição Ativo';
    rotulo.style.textAlign = 'center';
    rotulo.style.margin = '10px 0';
    rotulo.style.padding = '5px';
    rotulo.style.backgroundColor = '#f0f8ff';
    rotulo.style.borderRadius = '4px';
    
    // Adicionar botão para salvar alterações
    const btnSalvar = document.querySelector('#btn-finalizar-pedido');
    if (btnSalvar) {
        btnSalvar.textContent = 'Salvar Alterações';
        btnSalvar.onclick = function() {
            // Verificar se os dados estão armazenados no DOM
            let dadosAtuais = dados;
            if (container.dataset.pedidoDados) {
                try {
                    dadosAtuais = JSON.parse(container.dataset.pedidoDados);
                } catch (e) {
                    console.error('Erro ao ler dados do carrinho para salvar:', e);
                }
            }
            
            // Verificar se temos dados e ID original do pedido
            if (dadosAtuais && dadosAtuais.pedidoOriginal && dadosAtuais.pedidoOriginal.id) {
                salvarPedidoEditado(idPedido, dadosAtuais);
            } else {
                console.error('Dados ou ID do pedido original não encontrados');
                alert('Erro ao salvar as alterações. Por favor, tente novamente.');
            }
        };
    }
    
    // Adicionar campo para frete
    const freteContainer = document.createElement('div');
    freteContainer.className = 'frete-container';
    freteContainer.style.margin = '15px 0';
    
    const freteLabel = document.createElement('label');
    freteLabel.htmlFor = 'valorFrete';
    freteLabel.textContent = 'Valor do Frete (R$):';
    freteLabel.style.display = 'block';
    freteLabel.style.marginBottom = '5px';
    
    const freteInput = document.createElement('input');
    freteInput.type = 'number';
    freteInput.id = 'valorFrete';
    freteInput.step = '0.01';
    freteInput.min = '0';
    freteInput.value = dados.valorFrete || 0;
    freteInput.style.width = '100%';
    freteInput.style.padding = '8px';
    freteInput.style.borderRadius = '4px';
    freteInput.style.border = '1px solid #ccc';
    
    // Atualizar o valor do frete nos dados quando mudar
    freteInput.addEventListener('change', function() {
        const novoFrete = parseFloat(this.value) || 0;
        
        // Obter dados atuais do container
        let dadosAtuais = dados;
        if (container.dataset.pedidoDados) {
            try {
                dadosAtuais = JSON.parse(container.dataset.pedidoDados);
            } catch (e) {
                console.error('Erro ao ler dados do carrinho:', e);
            }
        }
        
        // Atualizar valor do frete
        dadosAtuais.valorFrete = novoFrete;
        
        // Atualizar o HTML do carrinho
        container.innerHTML = gerarHTMLCarrinhoEditando(
            dadosAtuais.produtosCarrinho,
            dadosAtuais.valorFrete,
            dadosAtuais.valorDesconto
        );
        
        // Salvar dados atualizados no container
        container.dataset.pedidoDados = JSON.stringify(dadosAtuais);
        
        // Recriar botões de edição e listeners
        adicionarBotoesEdicao(container, dadosAtuais, idPedido);
        adicionarListenersRemoverItem(container, dadosAtuais);
    });
    
    freteContainer.appendChild(freteLabel);
    freteContainer.appendChild(freteInput);
    
    // Adicionar campo para desconto
    const descontoContainer = document.createElement('div');
    descontoContainer.className = 'desconto-container';
    descontoContainer.style.margin = '15px 0';
    
    const descontoLabel = document.createElement('label');
    descontoLabel.htmlFor = 'valorDesconto';
    descontoLabel.textContent = 'Valor do Desconto (R$):';
    descontoLabel.style.display = 'block';
    descontoLabel.style.marginBottom = '5px';
    
    const descontoInput = document.createElement('input');
    descontoInput.type = 'number';
    descontoInput.id = 'valorDesconto';
    descontoInput.step = '0.01';
    descontoInput.min = '0';
    descontoInput.value = dados.valorDesconto || 0;
    descontoInput.style.width = '100%';
    descontoInput.style.padding = '8px';
    descontoInput.style.borderRadius = '4px';
    descontoInput.style.border = '1px solid #ccc';
    
    // Atualizar o valor do desconto nos dados quando mudar
    descontoInput.addEventListener('change', function() {
        const novoDesconto = parseFloat(this.value) || 0;
        
        // Obter dados atuais do container
        let dadosAtuais = dados;
        if (container.dataset.pedidoDados) {
            try {
                dadosAtuais = JSON.parse(container.dataset.pedidoDados);
            } catch (e) {
                console.error('Erro ao ler dados do carrinho:', e);
            }
        }
        
        // Atualizar valor do desconto
        dadosAtuais.valorDesconto = novoDesconto;
        
        // Atualizar o HTML do carrinho
        container.innerHTML = gerarHTMLCarrinhoEditando(
            dadosAtuais.produtosCarrinho,
            dadosAtuais.valorFrete,
            dadosAtuais.valorDesconto
        );
        
        // Salvar dados atualizados no container
        container.dataset.pedidoDados = JSON.stringify(dadosAtuais);
        
        // Recriar botões de edição e listeners
        adicionarBotoesEdicao(container, dadosAtuais, idPedido);
        adicionarListenersRemoverItem(container, dadosAtuais);
    });
    
    descontoContainer.appendChild(descontoLabel);
    descontoContainer.appendChild(descontoInput);
    
    // Adicionar campo para observação
    const obsContainer = document.createElement('div');
    obsContainer.className = 'observacao-container';
    obsContainer.style.margin = '15px 0';
    
    const obsLabel = document.createElement('label');
    obsLabel.htmlFor = 'observacaoPedido';
    obsLabel.textContent = 'Observações:';
    obsLabel.style.display = 'block';
    obsLabel.style.marginBottom = '5px';
    
    const obsTextarea = document.createElement('textarea');
    obsTextarea.id = 'observacaoPedido';
    obsTextarea.value = dados.observacaoPedido || '';
    obsTextarea.style.width = '100%';
    obsTextarea.style.padding = '8px';
    obsTextarea.style.borderRadius = '4px';
    obsTextarea.style.border = '1px solid #ccc';
    obsTextarea.style.minHeight = '80px';
    obsTextarea.style.resize = 'vertical';
    
    // Atualizar a observação nos dados quando mudar
    obsTextarea.addEventListener('change', function() {
        // Obter dados atuais do container
        let dadosAtuais = dados;
        if (container.dataset.pedidoDados) {
            try {
                dadosAtuais = JSON.parse(container.dataset.pedidoDados);
            } catch (e) {
                console.error('Erro ao ler dados do carrinho:', e);
            }
        }
        
        // Atualizar observação
        dadosAtuais.observacaoPedido = this.value || '';
        
        // Salvar dados atualizados no container
        container.dataset.pedidoDados = JSON.stringify(dadosAtuais);
    });
    
    obsContainer.appendChild(obsLabel);
    obsContainer.appendChild(obsTextarea);
    
    // Adicionar botão para cancelar edição
    const botoesContainer = document.createElement('div');
    botoesContainer.className = 'botoes-edicao';
    botoesContainer.style.marginTop = '15px';
    
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn-secundario';
    btnCancelar.textContent = 'Cancelar Edição';
    btnCancelar.style.width = '100%';
    btnCancelar.style.marginTop = '10px';
    btnCancelar.onclick = function() {
        if (confirm('Tem certeza que deseja cancelar a edição? Todas as alterações serão perdidas.')) {
            fecharModalPrincipal();
        }
    };
    
    botoesContainer.appendChild(btnCancelar);
    
    // Se já temos os dados no dataset, salvar a versão atualizada
    if (!container.dataset.pedidoDados) {
        container.dataset.pedidoDados = JSON.stringify(dados);
    }
    
    // Inserir elementos no container
    container.insertBefore(rotulo, container.firstChild);
    
    // Adicionar campos após o carrinho mas antes do botão
    const resumoCarrinho = container.querySelector('.resumo-carrinho');
    if (resumoCarrinho) {
        container.insertBefore(freteContainer, resumoCarrinho.nextSibling);
        container.insertBefore(descontoContainer, freteContainer.nextSibling);
        container.insertBefore(obsContainer, descontoContainer.nextSibling);
    } else {
        container.appendChild(freteContainer);
        container.appendChild(descontoContainer);
        container.appendChild(obsContainer);
    }
    
    container.appendChild(botoesContainer);
}

/**
 * Gera o HTML do carrinho com os produtos, frete e desconto
 * @param {Array} produtos - Array de produtos
 * @param {number} frete - Valor do frete
 * @param {number} desconto - Valor do desconto
 * @returns {string} HTML do carrinho
 */
function gerarHTMLCarrinho(produtos, frete, desconto) {
    // Calcular o subtotal (soma dos produtos)
    const subtotal = produtos.reduce((total, item) => {
        const preco = typeof item.preco === 'string' ? 
            parseFloat(item.preco.replace('R$', '').replace(',', '.')) : 
            (parseFloat(item.preco) || 0);
        const quantidade = parseInt(item.quantidade) || 1;
        return total + (preco * quantidade);
    }, 0);
    
    // Calcular o total (subtotal + frete - desconto)
    const total = Math.max(0, subtotal + frete - desconto);
    
    // Formatar os valores para exibição
    const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
    const freteFormatado = frete.toFixed(2).replace('.', ',');
    const descontoFormatado = desconto.toFixed(2).replace('.', ',');
    const totalFormatado = total.toFixed(2).replace('.', ',');
    
    // Informação do frete
    const freteInfo = frete > 0 ? `
        <div class="frete-valor">
            <span>Frete:</span>
            <span>+ R$ ${freteFormatado}</span>
        </div>
    ` : '';
    
    // Informação do desconto
    const descontoInfo = desconto > 0 ? `
        <div class="desconto-manual">
            <span>Desconto:</span>
            <span>- R$ ${descontoFormatado}</span>
        </div>
    ` : '';
    
    return `
        <h3>Carrinho de Compras</h3>
        <div id="itens-carrinho">
            ${produtos.length === 0 ? '<p>Nenhum item no carrinho</p>' : ''}
            ${produtos.map(item => `
                <div class="item-carrinho">
                    <span>${item.nome}</span>
                    <span>${item.quantidade}x</span>
                    <span>${item.preco}</span>
                </div>
            `).join('')}
        </div>
        <div class="resumo-carrinho">
            <div class="subtotal-carrinho">
                <span>Subtotal:</span>
                <span>R$ ${subtotalFormatado}</span>
            </div>
            ${freteInfo}
            ${descontoInfo}
            <div class="total-carrinho">
                <p>Total: R$ ${totalFormatado}</p>
            </div>
        </div>
        <button id="btn-finalizar-pedido" class="btn-primario" ${produtos.length === 0 ? 'disabled' : ''}>
            Salvar Alterações
        </button>
    `;
}


// Função para carregar clientes no select
async function carregarClientesParaSelect() {
    try {
        const clientes = await getClientes();
        const select = document.getElementById('idCliente');
        
        if (select && clientes.length > 0) {
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nome;
                select.appendChild(option);
            });
        }
    } catch (erro) {
        console.error('Erro ao carregar clientes:', erro);
    }
}




