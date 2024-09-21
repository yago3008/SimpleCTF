const express = require('express');
const { sequelize } = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const systemRoutes = require('./routes/system');

const app = express();
const port = 3000;


app.use(express.json());

app
    .get('/', (req, res) => {
      res.send('Servidor rodando...');
    })
    .use('/auth', authRoutes)
    .use('/profile', profileRoutes)
    .use('/system', systemRoutes);


const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar as tabelas:', error);
  }
};

syncDatabase();

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
