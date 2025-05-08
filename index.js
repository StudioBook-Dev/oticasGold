const express = require('express');
const path = require('path');

// Importar módulos do SQLite
const setupDatabase = require('./db_sqlite/setupDatabase');
const dbRoutes = require('./db_sqlite/routes');

const app = express();
const port = 3001;

// Inicializar banco de dados SQLite
setupDatabase()
  .then(() => console.log('Banco de dados SQLite inicializado com sucesso!'))
  .catch(err => console.error('Erro ao inicializar banco de dados SQLite:', err));

// Configurando middleware para processar JSON
app.use(express.json());

// Configurando pasta de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usando as rotas da API SQLite
app.use('/api', dbRoutes);

// Rota para a página inicial e qualquer outra rota (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log('Usando SQLite para gerenciamento de dados.');
}); 