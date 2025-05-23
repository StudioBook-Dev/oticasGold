# Funcionalidade de Upload de Receitas

## Descrição
Esta funcionalidade permite anexar arquivos de receita médica ao cadastro de clientes. Os arquivos são renomeados com o ID do cliente e **mantêm seu formato original**, sendo salvos na pasta `db_sqlite/receitas`.

## Funcionalidades Implementadas

### 1. Campo de Upload no Formulário
- Adicionado campo de upload de arquivo no formulário de cadastro de cliente
- Aceita os seguintes formatos:
  - Documentos: PDF, DOC, DOCX
  - Imagens: JPG, JPEG, PNG, GIF, BMP
- Limite de tamanho: 10MB por arquivo
- **Arquivos mantêm seu formato original**

### 2. Processamento no Frontend
- **Arquivo**: `public/scripts/clientes/modalSecundarioClientes.js`
- **Função modificada**: `constructPostCliente()`
  - Captura o arquivo selecionado
  - Passa o ID para a função `constructReceita()`

### 3. Gerenciamento de Receitas
- **Arquivo**: `public/scripts/clientes/receitas.js`
- **Função implementada**: `constructReceita(id)`
  - Verifica se um arquivo foi selecionado
  - **Mantém a extensão original do arquivo**
  - Define o nome como ID + extensão original (formato: `{id}.{extensão}`)
  - Envia o arquivo para o servidor via FormData
  - Exibe feedback ao usuário sobre o sucesso/erro

### 4. Salvamento no Servidor
- **Arquivo**: `db_sqlite/routes.js`
- **Rota**: `POST /api/upload-receita`
- **Função de salvamento**: `salvarArquivo()`
- **Funcionalidades**:
  - **Salvamento direto sem conversão**
  - Validação de tipos de arquivo permitidos
  - Limite de tamanho (10MB)
  - Renomeação com ID do cliente + extensão original
  - Salvamento na pasta `db_sqlite/receitas`

## Fluxo de Funcionamento

1. **Usuário preenche o formulário** de cadastro de cliente
2. **Usuário seleciona um arquivo** no campo "Receita (Anexar arquivo)"
3. **Ao clicar em "Salvar"**:
   - Cliente é salvo no banco de dados
   - Arquivo é capturado e enviado para o servidor
   - **Arquivo é salvo mantendo seu formato original**
   - **Arquivo é renomeado para ID + extensão** (ex: `12345.pdf`, `12346.jpg`)
   - Arquivo é salvo em `db_sqlite/receitas/`

## Estrutura de Arquivos

```
db_sqlite/
├── receitas/              # Pasta onde as receitas são salvas
│   ├── 12345.pdf         # Arquivo PDF mantém formato
│   ├── 12346.jpg         # Arquivo JPG mantém formato
│   ├── 12347.docx        # Arquivo DOCX mantém formato
│   └── ...
└── routes.js              # Rotas da API incluindo upload
```

## Tratamento de Erros

- **Arquivo não selecionado**: Processo continua normalmente (cliente é salvo)
- **Tipo de arquivo inválido**: Erro retornado ao usuário
- **Arquivo muito grande**: Erro retornado ao usuário
- **Erro no servidor**: Cliente é salvo, mas usuário é notificado sobre erro na receita

## Dependências

- **multer**: Para processamento de uploads de arquivos
  ```bash
  npm install multer
  ```

## Validações Implementadas

1. **Frontend**:
   - Atributo `accept` no input para filtrar tipos de arquivo
   - Verificação de arquivo selecionado antes do envio
   - Nome: `{id}.{extensão_original}`

2. **Backend**:
   - Validação de extensões permitidas
   - Limite de tamanho de arquivo
   - Criação automática do diretório de destino
   - Salvamento direto sem conversão

## Feedback ao Usuário

- **Sucesso**: "Cliente e receita salvos com sucesso!"
- **Erro**: "Cliente salvo, mas houve erro ao salvar a receita. Tente novamente."

## Vantagens da Implementação Atual

✅ **Simplicidade**: Salvamento direto sem conversão complexa  
✅ **Compatibilidade**: Mantém formato original dos arquivos  
✅ **Confiabilidade**: Menos pontos de falha  
✅ **Organização**: Nomes simples e consistentes (ID + extensão)  
✅ **Performance**: Processamento rápido sem conversão  

Esta implementação garante que todos os arquivos de receita sejam armazenados de forma simples e confiável, mantendo sua integridade original. 