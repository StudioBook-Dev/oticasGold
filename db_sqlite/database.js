const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, 'database.db');

// Função para obter conexão com o banco de dados
function getDb() {
    return new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
        } else {
            // console.log('Conexão com o banco de dados SQLite estabelecida.');
        }
    });
}

// Função para executar uma consulta SQL que não retorna dados (CREATE, INSERT, UPDATE, DELETE)
function executeSql(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
        db.close();
    });
}

// Função para executar uma consulta SQL que retorna um único resultado
function getOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
        db.close();
    });
}

// Função para obter todos os registros
async function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        const db = getDb();
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    getDb,
    executeSql,
    getOne,
    getAll
}; 