# Sistema de Gerenciamento de Produtos e Pedidos

Este projeto é um sistema completo para gerenciamento de produtos, pedidos, clientes, categorias e cupons, utilizando SQLite como banco de dados.

## Características

- **SQLite**: Banco de dados rápido e eficiente que garante integridade de dados
- **API RESTful**: Endpoints bem definidos para todas as operações
- **Interface Kanban**: Gerenciamento visual de pedidos
- **Cadastros Completos**: Produtos, clientes, categorias, cupons
- **Gestão de Estoque**: Controle e histórico de movimentações
- **Operações Atômicas**: Garantia de que as operações de banco de dados sejam completas

## Requisitos

- Node.js v12 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/codebase.git
cd codebase
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3001
```

## Estrutura do Projeto

O sistema está organizado da seguinte forma:

```
db_sqlite/
  ├── database.js        # Configuração da conexão com o banco de dados
  ├── setupDatabase.js   # Criação das tabelas
  ├── index.js           # Instruções de integração
  ├── routes.js          # Rotas da API REST
  ├── pedidosModel.js    # Operações CRUD para pedidos
  ├── produtosModel.js   # Operações CRUD para produtos
  ├── clientesModel.js   # Operações CRUD para clientes
  ├── categoriasModel.js # Operações CRUD para categorias
  ├── cuponsModel.js     # Operações CRUD para cupons
  └── estoqueModel.js    # Operações para gerenciamento de estoque
```

## Endpoints da API

### Pedidos
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/:id` - Buscar um pedido específico
- `POST /api/pedidos` - Criar um novo pedido
- `PUT /api/pedidos/:id` - Atualizar um pedido
- `PATCH /api/pedidos/:id/status` - Atualizar apenas o status
- `DELETE /api/pedidos/:id` - Excluir um pedido

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `GET /api/produtos/:id` - Buscar um produto específico
- `POST /api/produtos` - Criar um novo produto
- `PUT /api/produtos/:id` - Atualizar um produto
- `PATCH /api/produtos/:id/estoque` - Atualizar apenas o estoque
- `DELETE /api/produtos/:id` - Excluir um produto

### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Buscar um cliente específico
- `POST /api/clientes` - Criar um novo cliente
- `PUT /api/clientes/:id` - Atualizar um cliente
- `DELETE /api/clientes/:id` - Excluir um cliente

### Categorias
- `GET /api/categorias` - Listar todas as categorias
- `GET /api/categorias/:id` - Buscar uma categoria específica
- `POST /api/categorias` - Criar uma nova categoria
- `PUT /api/categorias/:id` - Atualizar uma categoria
- `DELETE /api/categorias/:id` - Excluir uma categoria

### Cupons
- `GET /api/cupons` - Listar todos os cupons
- `GET /api/cupons/:id` - Buscar um cupom específico
- `POST /api/cupons` - Criar um novo cupom
- `PUT /api/cupons/:id` - Atualizar um cupom
- `DELETE /api/cupons/:id` - Excluir um cupom

### Estoque
- `GET /api/estoque/historico` - Listar histórico de movimentações de estoque
- `POST /api/estoque/movimentacao` - Registrar uma nova movimentação de estoque
- `POST /api/produtos/atualizarEstoque` - Atualizar estoque de um produto
- `DELETE /api/estoque/historico` - Limpar histórico de estoque (admin)

## Estrutura de Dados

### pedidos
- id (TEXT): Identificador único do pedido
- cliente (TEXT): Dados do cliente em formato JSON
- produtos (TEXT): Lista de produtos em formato JSON
- desconto (REAL): Valor do desconto
- frete (REAL): Valor do frete
- total (REAL): Valor total do pedido
- status (TEXT): Status do pedido (fila, concluido, cancelar)
- dataCriacao (TEXT): Data de criação do pedido
- pagamento (TEXT): Dados de pagamento em formato JSON
- cupons (TEXT): Cupons aplicados em formato JSON
- observacao (TEXT): Observações adicionais

### produtos
- id (TEXT): Identificador único do produto
- nome (TEXT): Nome do produto
- descricao (TEXT): Descrição do produto
- preco (REAL): Preço do produto
- estoque (INTEGER): Quantidade em estoque
- codigoInterno (TEXT): Código interno
- codigoExterno (TEXT): Código externo
- categoria (TEXT): Categoria do produto
- dataCriacao (TEXT): Data de criação do produto

### clientes
- id (TEXT): Identificador único do cliente
- nome (TEXT): Nome do cliente
- telefone (TEXT): Telefone do cliente
- enderecoCompleto (TEXT): Endereço completo
- estado (TEXT): Estado
- cidade (TEXT): Cidade
- rua (TEXT): Rua
- casa (TEXT): Número da casa/apartamento
- cep (TEXT): CEP
- datanascimento (TEXT): Data de nascimento
- email (TEXT): Email do cliente

### categorias
- id (TEXT): Identificador único da categoria
- nome (TEXT): Nome da categoria
- descricao (TEXT): Descrição da categoria

### cupons
- id (TEXT): Identificador único do cupom
- nome (TEXT): Nome do cupom
- valor (REAL): Valor do cupom
- tipo (TEXT): Tipo do cupom (percentual, valor)
- datacriacao (TEXT): Data de criação do cupom

### logEstoque
- id (TEXT): Identificador único do log
- dataHora (TEXT): Data e hora da alteração
- valor (REAL): Valor da alteração
- valor_anterior (REAL): Valor anterior
- novoValor (REAL): Novo valor
- tipoDaTransacao (TEXT): Tipo de transação (entrada, saida)
- idProduto (TEXT): ID do produto alterado
- tipo_movimento (TEXT): Tipo de movimento (venda, ajuste)
- observacao (TEXT): Observações adicionais

## Funcionalidades

- **Kanban de Pedidos**: Visualize e gerencie pedidos com interface intuitiva
- **Gestão de Estoque**: Controle de entradas e saídas com histórico completo
- **Cadastros**: Interface para cadastro de produtos, clientes e categorias
- **Cupons**: Sistema de descontos com cupons personalizáveis
- **API Completa**: Acesso a todos os recursos via API REST

## Suporte

Para dúvidas ou suporte, abra uma issue no repositório do projeto.

## Licença

Este projeto está licenciado sob a licença ISC. 