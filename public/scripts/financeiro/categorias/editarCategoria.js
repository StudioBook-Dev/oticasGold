
// Funções para editar e excluir categorias
async function editarCategoriaFinanceira(id) {
    try {
        // Buscar a categoria pelo ID
        const response = await fetch(`/api/financeiro/categorias/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar categoria');
        }
        const categoria = await response.json();
        
        // Abrir modal de edição com os dados da categoria
        abrirModalSecundario({
            titulo: 'Editar Categoria Financeira',
            conteudo: `
                <div class="opcoes-financeiro">
                    <form id="formEditarCategoriaFinanceira">
                        <input type="hidden" id="idCategoriaFinanceira" value="${categoria.id}">
                        <div class="form-group">
                            <label for="nomeEditarCategoriaFinanceira">Nome</label>
                            <input type="text" id="nomeEditarCategoriaFinanceira" class="form-control form-control-full" value="${categoria.nome}" required>
                        </div>
                        <div class="form-group">
                            <label for="descricaoEditarCategoriaFinanceira">Descrição</label>
                            <textarea id="descricaoEditarCategoriaFinanceira" class="form-control form-control-full">${categoria.descricao || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Tipo</label>
                            <div class="tipo-container">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="tipoEditarCategoriaFinanceira" id="tipoEditarDespesa" value="despesa" ${categoria.tipo === 'despesa' ? 'checked' : ''}>
                                    <label class="form-check-label" for="tipoEditarDespesa">Despesa</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="tipoEditarCategoriaFinanceira" id="tipoEditarReceita" value="receita" ${categoria.tipo === 'receita' ? 'checked' : ''}>
                                    <label class="form-check-label" for="tipoEditarReceita">Receita</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="corEditarCategoriaFinanceira">Cor</label>
                            <input type="color" id="corEditarCategoriaFinanceira" class="form-control color-picker" value="${categoria.cor || '#3498db'}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn-salvar">Salvar</button>
                            <button type="button" class="btn-cancelar" onclick="fecharModalSecundario()">Cancelar</button>
                        </div>
                    </form>
                </div>
            `
        });

        // Adicionar estilos específicos ao formulário
        const style = document.createElement('style');
        style.id = 'estilo-form-editar-categoria-financeira';
        style.textContent = `
            .opcoes-financeiro {
                padding: 15px;
            }
            .form-group {
                margin-bottom: 15px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            .form-control-full {
                width: 100%;
                box-sizing: border-box;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 14px;
            }
            textarea.form-control-full {
                min-height: 80px;
                resize: vertical;
            }
            .tipo-container {
                display: flex;
                gap: 20px;
                margin-top: 5px;
            }
            .form-check-inline {
                display: flex;
                align-items: center;
            }
            .form-check-inline input {
                margin-right: 5px;
            }
            .color-picker {
                width: 50px;
                height: 50px;
                padding: 0;
                border: none;
                border-radius: 50%;
                overflow: hidden;
                cursor: pointer;
                box-shadow: 0 0 0 1px #ddd;
            }
            .form-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                margin-top: 20px;
            }
            .btn-salvar, .btn-cancelar {
                padding: 10px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            .btn-salvar {
                background-color: #3498db;
                color: white;
                border: none;
            }
            .btn-salvar:hover {
                background-color: #2980b9;
            }
            .btn-cancelar {
                background-color: #f5f5f5;
                border: 1px solid #ddd;
                color: #333;
            }
            .btn-cancelar:hover {
                background-color: #e5e5e5;
            }
        `;
        document.head.appendChild(style);

        // Adicionar evento de submit ao formulário
        document.getElementById('formEditarCategoriaFinanceira').addEventListener('submit', function(e) {
            e.preventDefault();
            putCategoriaFinanceira();
        });
    } catch (error) {
        console.error('Erro ao editar categoria:', error);
        alert('Erro ao carregar dados da categoria para edição.');
    }
}


function constructPutCategoriaFinanceira() {
    const id = document.getElementById('idCategoriaFinanceira').value;
    const nome = document.getElementById('nomeEditarCategoriaFinanceira').value;
    const descricao = document.getElementById('descricaoEditarCategoriaFinanceira').value;
    const tipo = document.querySelector('input[name="tipoEditarCategoriaFinanceira"]:checked').value;
    const cor = document.getElementById('corEditarCategoriaFinanceira').value;

    const categoria = {
        id: id,
        nome: nome,
        tipo: tipo,
        descricao: descricao,
        cor: cor
    }

    putCategoriaFinanceira(categoria);
}

