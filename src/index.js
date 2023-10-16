const express = require('express'); // Importa o módulo do Express
const app = express(); // Cria uma instância do Express
require('dotenv').config();
const database = require('./config/dbConfig');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');
const routes = require('./routes/routes');
const bodyParser = require('body-parser');

var path = require('path');

const PORT = process.env.PORT; // Define a porta na qual o servidor deve escutar

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

app.use(session({ secret: 'kasdakhdjakdajhkjhaksdjhakdjhakdjhkajhsd' }));
app.use(routes);
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'temp')
}));

app.listen(PORT, () => {
  console.log(`Servidor executando na porta ${PORT}`);
});

