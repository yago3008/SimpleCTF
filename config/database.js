const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('projeto_pessoal', 'projeto_pessoal', 'projeto_pessoal', {
  host: 'localhost',
  dialect: 'mysql'
});

// Função para verificar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

module.exports = { sequelize, testConnection };
