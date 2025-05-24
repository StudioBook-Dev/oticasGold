

// Função para abrir o modal de cupom
function modalCuponsParaPedido() {
    abrirModalSecundario({
        titulo: 'Selecionar Cupom',
        conteudo: `
            <form id="form-cupom" class="form-modal-secundario" >
                <div class="acoes-modal acoes-modal-cupons">
                    <button type="button" class="btn-modal-secundario btn-modal-secundario-cancel" onclick="cancelarCupomSelecionado()">
                        Cancelar
                    </button>
                    <button type="button" class="btn-modal-secundario btn-modal-primario" onclick="aplicarCupomSelecionado()"> 
                        Confirmar
                    </button>
                </div>
                <br><br>
                <div id="tabela-cupons"> </div>
            </form>`
    });
    gerarTabelaCuponsParaPedido();
}


// Função para carregar cupons e preencher a tabela
async function gerarTabelaCuponsParaPedido() {
    const cupons = await getCupons()
    const html = document.getElementById('tabela-cupons')

    if (!cupons || cupons.length === 0) {
        return '<p>Nenhum cupom encontrado.</p>';
    }

    let conteudo = `
    <table class="tabela-modal">
    <thead>
        <tr>
            <th>Ações</th>
            <th>Nome</th>
            <th>Valor</th>
            <th>Tipo</th>
        </tr>
    </thead>
    <tbody class="modal-conteudo">`;
    cupons.forEach(cupom => {
        conteudo += `
            <tr>
                <td>
                    <input type="radio" name="cupom" value="${cupom.id}" id="cupom-${cupom.id}">
                </td>
                <td>${cupom.nome}</td>  
                <td>${cupom.valor}</td>
                <td>${cupom.tipo === 'percentual' ? '%' : 'R$'}</td>
            </tr>`;
    });

    conteudo += '</tbody></table>'
    html.innerHTML = conteudo
}


function aplicarCupomSelecionado() {
    const cupomSelecionado = document.querySelector('input[name="cupom"]:checked');
    if (!cupomSelecionado) {
        alert('Selecione um cupom para aplicar.');
        return;
    }
    const cupomId = cupomSelecionado.value;
    const cupomNome = cupomSelecionado.closest('tr').getElementsByTagName('td')[1].innerText;
    const cupomValor = cupomSelecionado.closest('tr').getElementsByTagName('td')[2].innerText;
    const cupomTipo = cupomSelecionado.closest('tr').getElementsByTagName('td')[3].innerText;
    
    const cupom = {
        id: cupomId,
        nome: cupomNome,
        valor: cupomValor,
        tipo: cupomTipo
    }

    localStorage.setItem("cupom", JSON.stringify(cupom));
    statusIconeNoModalPrincipalPedido('cupom', true)
    fecharModalSecundario();
}


function cancelarCupomSelecionado() {
    localStorage.removeItem("cupom");
    statusIconeNoModalPrincipalPedido('cupom', false)
    fecharModalSecundario();
}


// // Função para aplicar o cupom selecionado
// function aplicarCupomSelecionado() {
//     const cupomSelecionado = document.querySelector('input[name="cupom"]:checked');
    
//     if (!cupomSelecionado) {
//         alert('Selecione um cupom para aplicar.');
//         return;
//     }
    
//     const cupomId = cupomSelecionado.value;
    
//     // Buscar os detalhes do cupom selecionado
//     getCupons()
//         .then(cupons => {
//             const cupomEncontrado = cupons.find(cupom => String(cupom.id) === String(cupomId));
            
//             if (cupomEncontrado) {
//                 // Criar objeto com informações do cupom
//                 const infoCupom = {
//                     id: cupomEncontrado.id,
//                     nome: cupomEncontrado.nome,
//                     valor: cupomEncontrado.valor,
//                     tipo: cupomEncontrado.tipo
//                 };
                
//                 // Armazenar o cupom globalmente para que possa ser acessado por outras funções
//                 window.cupomAplicado = infoCupom;
                
//                 // Atualizar a exibição do carrinho
//                 atualizarExibicaoCupomNoCarrinho(infoCupom);
                
//                 console.log(`Cupom aplicado: ${infoCupom.nome} - ${infoCupom.valor} ${infoCupom.tipo === 'percentual' ? '%' : 'R$'}`);
//             } else {
//                 console.error(`Cupom com ID ${cupomId} não encontrado.`);
//             }
            
//             // Fecha o modal após aplicar o cupom
//             fecharModalSecundario();
//         })
//         .catch(error => {
//             console.error('Erro ao aplicar cupom:', error);
//             alert('Erro ao aplicar o cupom. Tente novamente.');
//             fecharModalSecundario();
//         });
// }

// // Função para atualizar a exibição do cupom no carrinho
// function atualizarExibicaoCupomNoCarrinho(cupom) {
//     // Atualizar a exibição do carrinho para incluir o cupom
//     document.querySelector('.coluna.carrinho').innerHTML = htmlCarrinhoComCupom(cupom);
// }

// // Função para gerar o HTML do carrinho com cupom aplicado
// function htmlCarrinhoComCupom(cupom) {
//     // Calcular o subtotal (soma dos produtos)
//     const subtotal = parseFloat(calcularTotalCarrinho().replace(',', '.'));
    
//     // Obter o valor do frete (se existir)
//     const valorFrete = window.valorFrete || 0;
    
//     // Obter o desconto manual (se existir)
//     const descontoManual = window.valorDesconto || 0;
    
//     // Calcular o valor do desconto do cupom
//     let descontoCupom = 0;
//     if (cupom) {
//         if (cupom.tipo === 'percentual') {
//             descontoCupom = subtotal * (parseFloat(cupom.valor) / 100);
//         } else {
//             descontoCupom = parseFloat(cupom.valor);
//         }
//     }
    
//     // Calcular o desconto total (manual + cupom)
//     const descontoTotal = descontoManual + descontoCupom;
    
//     // Calcular o total final (subtotal + frete - desconto total)
//     const totalFinal = Math.max(0, subtotal + valorFrete - descontoTotal);
    
//     // Formatar os valores para exibição
//     const subtotalFormatado = subtotal.toFixed(2).replace('.', ',');
//     const descontoManualFormatado = descontoManual.toFixed(2).replace('.', ',');
//     const descontoCupomFormatado = descontoCupom.toFixed(2).replace('.', ',');
//     const descontoTotalFormatado = descontoTotal.toFixed(2).replace('.', ',');
//     const freteFormatado = valorFrete.toFixed(2).replace('.', ',');
//     const totalFinalFormatado = totalFinal.toFixed(2).replace('.', ',');
    
//     // Formatar a apresentação do cupom
//     let cupomInfo = '';
//     if (cupom) {
//         let valorFormatado;
//         if (cupom.tipo === 'percentual') {
//             valorFormatado = `${cupom.valor}%`;
//         } else {
//             valorFormatado = `R$ ${parseFloat(cupom.valor).toFixed(2).replace('.', ',')}`;
//         }
        
//         cupomInfo = `
//             <div class="cupom-aplicado">
//                 <div class="info-cupom">
//                     <span class="label-cupom">Cupom:</span>
//                     <span class="nome-cupom">${cupom.nome}</span>
//                     <span class="valor-cupom">${valorFormatado}</span>
//                     <button type="button" class="btn-remover-cupom" onclick="removerCupomAplicado()">
//                         <i class="fas fa-times"></i>
//                     </button>
//                 </div>
//             </div>
//             <div class="desconto-aplicado">
//                 <span>Desconto do cupom:</span>
//                 <span>- R$ ${descontoCupomFormatado}</span>
//             </div>
//         `;
//     }
    
//     // Informação do desconto manual
//     const descontoManualInfo = descontoManual > 0 ? `
//         <div class="desconto-manual">
//             <span>Desconto manual:</span>
//             <span>- R$ ${descontoManualFormatado}</span>
//         </div>
//     ` : '';
    
//     // Informação do frete
//     const freteInfo = valorFrete > 0 ? `
//         <div class="frete-valor">
//             <span>Frete:</span>
//             <span>+ R$ ${freteFormatado}</span>
//         </div>
//     ` : '';
    
//     return `
//         <h3>Carrinho de Compras</h3>
//         <div id="itens-carrinho">
//             ${produtosCarrinho.length === 0 ? '<p>Nenhum item no carrinho</p>' : ''}
//             ${produtosCarrinho.map(item => `
//                 <div class="item-carrinho">
//                     <span>${item.nome}</span>
//                     <span>${item.quantidade}x</span>
//                     <span>${item.preco}</span>
//                 </div>
//             `).join('')}
//         </div>
//         <div class="resumo-carrinho">
//             <div class="subtotal-carrinho">
//                 <span>Subtotal:</span>
//                 <span>R$ ${subtotalFormatado}</span>
//             </div>
//             ${freteInfo}
//             ${descontoManualInfo}
//             ${cupomInfo}
//             <div class="total-carrinho">
//                 <p>Total: R$ ${totalFinalFormatado}</p>
//             </div>
//         </div>
//         <button class="btn-primario" onclick="finalizarPedido()" ${produtosCarrinho.length === 0 ? 'disabled' : ''}>
//             Finalizar Venda
//         </button>
//     `;
// }