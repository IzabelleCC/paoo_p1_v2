import express from 'express'
import { v4 as uuidv4 } from 'uuid'

require('dotenv').config()
const axios = require ('axios')

const app = express()
app.use(express.json())

interface Condicao {
    id: string;
    name: string;
    lat: number;
    lon: number;
    dt: number;
    feels_like: number;
    description: string;
}

const condicoes: Record<string, Condicao[]> = {}


app.post('/consulta_coordenadas/:id/consulta_condicoes', async (req, res) => {
    const idObs = uuidv4();
    const { lat, lon } = req.body
    const { APPID, UNITS, LANGUAGE, URL_BASE } = process.env
    const url = `${URL_BASE}?lat=${lat}&lon=${lon}&appid=${APPID}&units=${UNITS}&lang=${LANGUAGE}`
   // console.log(lat, lon)
   // console.log(url)
    
    try{
        const response = await axios.get(url)
        const feels_like = response.data.main.feels_like
        const description = response.data.weather[0].description
        const dt = response.data.dt
        const name = response.data.name
        const condicaoDaCidade : Condicao[] = condicoes[req.params.id]  || []

        condicaoDaCidade.push({ id: idObs, name, lat, lon, dt, feels_like, description })

        condicoes[req.params.id] = condicaoDaCidade

        await axios.post('http://localhost:10000/eventos', {
            tipo: 'CondicaoCriada',
            dados: condicaoDaCidade, coordenadaId: req.params.id,
        })

        res.status(201).json(condicaoDaCidade)        
    }
    catch (erro){
        res.status(400).json({ erro: 'Cidade nao encontrada.'})
    }

})
app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

app.get('/consulta_coordenadas/:id/consulta_condicoes', (req, res) => {
    res.json(condicoes[req.params.id] || [])
})

const port = 5000
app.listen(port,() => console.log(`Coordenadas. Porta ${port}.`))