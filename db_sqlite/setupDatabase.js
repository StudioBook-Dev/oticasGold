const { executeSql, getDb } = require('./database');

// Função para inicializar o banco de dados
async function setupDatabase() {
    try {
        console.log('Iniciando configuração do banco de dados SQLite...');

        // Criar tabela de pedidos
        await executeSql(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id TEXT PRIMARY KEY,
                cliente TEXT,
                produtos TEXT,
                desconto REAL,
                frete REAL,
                total REAL,
                status TEXT,
                dataCriacao TEXT,
                pagamento TEXT,
                cupons TEXT,
                observacao TEXT
            )
        `);

        // Criar tabela de clientes
        await executeSql(`
            CREATE TABLE IF NOT EXISTS clientes (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                telefone TEXT,
                enderecoCompleto TEXT,
                estado TEXT,
                cidade TEXT,
                rua TEXT,
                casa TEXT,
                cep TEXT,
                datanascimento TEXT,
                email TEXT
            )
        `);

        // Criar tabela de produtos
        await executeSql(`
            CREATE TABLE IF NOT EXISTS produtos (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                descricao TEXT,
                preco REAL,
                estoque INTEGER,
                codigoInterno TEXT,
                codigoExterno TEXT,
                categoria TEXT,
                dataCriacao TEXT
            )
        `);

        // Criar tabela de categorias
        await executeSql(`
            CREATE TABLE IF NOT EXISTS categorias (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                descricao TEXT
            )
        `);

        // Criar tabela de cupons
        await executeSql(`
            CREATE TABLE IF NOT EXISTS cupons (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                valor REAL,
                tipo TEXT,
                datacriacao TEXT
            )
        `);

        // Criar tabela de categorias financeiras
        await executeSql(`
            CREATE TABLE IF NOT EXISTS categoriasFinanceiras (
                id TEXT PRIMARY KEY NOT NULL,
                nome TEXT NOT NULL,
                tipo TEXT NOT NULL,
                descricao TEXT,
                icone TEXT,
                cor TEXT,
                saldo REAL DEFAULT 0
            )
        `);

        // Criar tabela de transações financeiras
        await executeSql(`
            CREATE TABLE IF NOT EXISTS transacoesFinanceiras (
                id TEXT PRIMARY KEY NOT NULL,
                dataCriacao TEXT NOT NULL,
                descricao TEXT,
                tipo TEXT NOT NULL,
                categoria TEXT,
                valor REAL NOT NULL,
                pagamento TEXT
            )
        `);

        // Criar nova tabela de movimentações
        await executeSql(`
            CREATE TABLE IF NOT EXISTS movimentacoes (
                id TEXT PRIMARY KEY,
                dataHora TEXT,
                quantidade REAL,
                idProduto TEXT,
                produtoNome TEXT,
                tipo TEXT,
                motivo TEXT,
                observacao TEXT,
                FOREIGN KEY (idProduto) REFERENCES produtos(id)
            )
        `);

        // Criar índices para otimizar as consultas ao histórico de movimentações
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_movimentacoes_datahora ON movimentacoes(dataHora)`);
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON movimentacoes(tipo)`);
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_movimentacoes_produto ON movimentacoes(idProduto)`);
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_movimentacoes_motivo ON movimentacoes(motivo)`);

        // Criar índices para transações financeiras
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_transacoes_dataCriacao ON transacoesFinanceiras(dataCriacao)`);
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoesFinanceiras(tipo)`);
        await executeSql(`CREATE INDEX IF NOT EXISTS idx_transacoes_categoria ON transacoesFinanceiras(categoria)`);

        // Verificar se existem categorias financeiras e adicionar uma categoria de teste se não houver
        const { getAll } = require('./database');
        const categorias = await getAll("SELECT * FROM categoriasFinanceiras");

        if (categorias.length === 0) {
            console.log('Nenhuma categoria financeira encontrada. Adicionando categoria de teste...');
            await executeSql(
                `INSERT INTO categoriasFinanceiras (id, nome, tipo, descricao, cor, saldo) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    'cat-fin-' + Date.now(),
                    'Despesas Gerais',
                    'despesa',
                    'Categoria para despesas gerais',
                    '#FF5733',
                    0
                ]
            );
            console.log('Categoria financeira de teste adicionada com sucesso!');
        }

        console.log('Banco de dados SQLite configurado com sucesso!');
    } catch (error) {
        console.error('Erro ao configurar banco de dados SQLite:', error);
    }
}

// Exportar a função de configuração
module.exports = setupDatabase;

// Executar a configuração se este arquivo for executado diretamente
if (require.main === module) {
    setupDatabase().then(() => console.log('Setup concluído!'));
} 