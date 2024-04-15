import express from 'express'
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const app = express()
app.use(express.json())

interface LatLon {
    id: string;
    cidade: string;
    lat: number;
    lon: number;
}

const coordenadas: Record<string, LatLon> = {}
let id: string = '1'

app.get('/coordenadas', (req, res) => {
    res.json(coordenadas)
})

app.post('/coordenadas', async (req, res) => {
    const { cidade }  = req.body
    const { APPID, LIMIT, LANGUAGE,  URL_BASE } = process.env
    const url = `${URL_BASE}?q=${cidade}&limit=${LIMIT}&appid=${APPID}&lang=${LANGUAGE}`
    
    try{
        const response = await axios.get(url)
        const {lat, lon} = response.data[0]
        const LatLon = { id, cidade, lat, lon }
        coordenadas[id] = LatLon
      
        await axios.post('http://localhost:10000/eventos', {
            tipo: 'CoordenadasCriadas',
            dados: { id, cidade, lat, lon }
        })
        
        id = (+id + 1).toString()

        res.status(201).json(LatLon)

    }
    catch (erro){
        res.status(400).json({ erro: 'Cidade naoo encontrada.'})
    
    }
})

app.post("/eventos", (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

const port = 4000
app.listen(port,() => console.log(`Coordenadas. Porta ${port}.`))

export {LatLon}