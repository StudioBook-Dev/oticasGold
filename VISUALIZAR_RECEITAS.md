# Funcionalidade de Visualização de Receitas

## Descrição
Esta funcionalidade permite verificar e visualizar receitas existentes no modal de edição de clientes. Quando um cliente possui uma receita anexada, são exibidos botões para visualizar e baixar o arquivo.

## Funcionalidades Implementadas

### 1. Verificação Automática de Receitas
- **Local**: Modal de edição de cliente
- **Função**: `verificarReceita(id)`
- **Comportamento**: Verifica automaticamente se existe receita para o cliente quando o modal é aberto

### 2. Interface de Visualização
- **Receita encontrada**: Mostra nome do arquivo e botões de ação
- **Nenhuma receita**: Mostra mensagem "Nenhuma receita anexada"
- **Erro**: Mostra mensagem de erro caso haja problema na verificação

### 3. Botões de Ação
- **👁️ Visualizar Receita**: Abre o arquivo em nova aba do navegador
- **📥 Baixar**: Faz download do arquivo para o computador

## Rotas do Backend

### 1. Verificar Receita
- **Rota**: `GET /api/verificar-receita/:clienteId`
- **Função**: Verifica se existe arquivo de receita para o cliente
- **Retorno**:
  ```json
  // Receita encontrada
  {
    "existe": true,
    "arquivo": {
      "nome": "12345.pdf",
      "extensao": ".pdf",
      "tamanho": 12345,
      "dataModificacao": "2025-05-23T19:00:00.000Z",
      "url": "/api/receita/12345"
    }
  }
  
  // Receita não encontrada
  {
    "existe": false,
    "mensagem": "Nenhuma receita encontrada para este cliente"
  }
  ```

### 2. Servir Receita
- **Rota**: `GET /api/receita/:clienteId`
- **Função**: Serve o arquivo de receita para visualização/download
- **Suporte a formatos**: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, BMP
- **Content-Type**: Definido automaticamente baseado na extensão

## Fluxo de Funcionamento

### 1. No Modal de Edição
1. **Cliente abre modal de edição**
2. **Sistema verifica automaticamente** se existe receita
3. **Exibe interface apropriada**:
   - Botões de visualizar/baixar (se existe)
   - Mensagem de "nenhuma receita" (se não existe)

### 2. Visualização de Receita
1. **Usuário clica em "Visualizar Receita"**
2. **Sistema abre nova aba** com o arquivo
3. **Navegador renderiza** o arquivo conforme o tipo:
   - PDFs: Visualizador nativo do navegador
   - Imagens: Exibição direta
   - Documentos: Download automático

### 3. Download de Receita
1. **Usuário clica em "Baixar"**
2. **Sistema cria link temporário** para download
3. **Arquivo é baixado** com nome original

## Interface Visual

### Receita Encontrada
```
✓ Receita encontrada: 12345.pdf
[👁️ Visualizar Receita] [📥 Baixar]
```

### Nenhuma Receita
```
Nenhuma receita anexada
```

### Carregando
```
Verificando receita...
```

## Arquivos Modificados

1. **`db_sqlite/routes.js`**:
   - Rota `GET /api/verificar-receita/:clienteId`
   - Rota `GET /api/receita/:clienteId`

2. **`public/scripts/clientes/receitas.js`**:
   - Função `verificarReceita(id)`
   - Função `visualizarReceita(clienteId, nomeArquivo)`
   - Função `baixarReceita(clienteId, nomeArquivo)`

3. **`public/scripts/clientes/editarCliente.js`**:
   - Adicionado container `<div id="receita-info">`
   - Chamada automática de `verificarReceita()` após abertura do modal

## Tratamento de Erros

- **Pasta não encontrada**: Retorna mensagem apropriada
- **Arquivo não encontrado**: Status 404 com mensagem de erro
- **Erro de servidor**: Log do erro e retorno de mensagem genérica
- **Erro no frontend**: Exibição de mensagem de erro no container

## Segurança

- **Validação de ID**: Apenas busca por arquivos que começam exatamente com o ID
- **Tipos de arquivo**: Content-Type definido corretamente para cada extensão
- **Paths seguros**: Uso de `path.join()` para evitar directory traversal

Esta funcionalidade proporciona uma experiência completa de gerenciamento de receitas, permitindo verificação rápida e acesso fácil aos arquivos anexados. 