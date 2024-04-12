import express from 'express'
import { v4 as uuidv4 } from 'uuid'

require('dotenv').config()
const axios = require ('axios')

const app = express()
app.use(express.json())


app.post('/eventos', async (req, res) => {
    const evento = req.body;
    //envia o evento para o microsserviço de coordenadas
    await axios.post('http://localhost:4000/eventos', evento);
    //envia o evento para o microsserviço de condicoes
    await axios.post('http://localhost:5000/eventos', evento);
    res.status(200).send({ msg: "ok" });

})

const port = 10000
app.listen(port,() => console.log(`Barramento de eventos. Porta ${port}.`))
