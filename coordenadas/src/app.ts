import express from 'express'
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const app = express()
app.use(express.json())

interface Coordenada {
    idCoordenada: string;
    nomeCidade: string;
    lat: number;
    lon: number;
}

const coordenadas: Record<string, Coordenada> = {}
let idCoordenada: string = '1'

app.get('/coordenadas', (req, res) => {
    res.json(coordenadas)
})

app.post('/coordenadas', async (req, res) => {
    const { nomeCidade }  = req.body
    const { APPID, LIMIT, LANGUAGE,  URL_BASE } = process.env
    const url = `${URL_BASE}?q=${nomeCidade}&limit=${LIMIT}&appid=${APPID}&lang=${LANGUAGE}`
    
    try{
        const response = await axios.get(url)
        const {lat, lon} = response.data[0]
        const Coordenada = { idCoordenada, nomeCidade, lat, lon }
        coordenadas[idCoordenada] = Coordenada
      
        await axios.post('http://localhost:10000/eventos', {
            tipo: 'CoordenadasCriadas',
            dados: { idCoordenada, nomeCidade, lat, lon }
        })
        
        idCoordenada = (+idCoordenada + 1).toString()

        res.status(201).json(Coordenada)

    }
    catch (erro){
        res.status(400).json({ erro: 'nomeCidade nao encontrada.'})
    
    }
})

app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

const port = 4000
app.listen(port,() => console.log(`Coordenadas. Porta ${port}.`))

export {Coordenada}