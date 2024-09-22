//import { getCars2, addCar } from './src/cars.js';
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require("mongoose");
const User = require('./models/user.model.js')
const userRoute = require("./routes/user.route")

const app = express();
const port = 3000;
// Criação do servidor HTTP
const server = http.createServer(app);

// Criação do servidor WebSocket
const wss = new WebSocket.Server({server});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

//configurando usando routes and controllers
app.use("/users", userRoute);



// Rota da API REST
app.get('/api', (req, res) => {
    res.json({ message: 'API REST funcionando!' });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send('deu certo ihul');
        }
    });
});

// Gerenciamento de conexões WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Envio de uma mensagem ao cliente quando ele se conecta
    ws.send('Bem-vindo ao servidor WebSocket!');

    // Recebendo mensagens do cliente
    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);
        // Enviando a mesma mensagem de volta ao cliente
        ws.send(`Você disse: ${message}`);
    });

    // Gerenciamento do fechamento da conexão
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Início do servidor
// server.listen(port, () => {
//     console.log(`Servidor rodando em http://localhost:${port}`);
// });


// conexão com o database
mongoose
  .connect(
    "mongodb://localhost:27017/plantinhas"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });