import express from 'express'

require('dotenv').config()


const axios = require ('axios')



//const url = `${URL_BASE}?q=${Q}&limit=${LIMIT}&appid=${APPID}&lang=${LANGUAGE}`
//console.log(url)
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

app.get('/consulta_coordenadas', (req, res) => {
    res.json(coordenadas)
})

app.post('/consulta_coordenadas', async (req, res) => {
    const  { cidade }  = req.body
    const { APPID, LIMIT, LANGUAGE,  URL_BASE } = process.env
    const url = `${URL_BASE}?q=${cidade}&limit=${LIMIT}&appid=${APPID}&lang=${LANGUAGE}`
    
    try{
        const response = await axios.get(url)
        const {lat, lon } = response.data[0]
        //console.log(lat, lon)
        const LatLon = { id, cidade, lat, lon }
        coordenadas[id] = LatLon
        id = (+id + 1).toString()
        res.json(LatLon)
    }
    catch (erro){
        res.status(400).json({ erro: 'Cidade nÃ£o encontrada.'})
    
    }

})

const port = 4000
app.listen(port,() => console.log(`Coordenadas. Porta ${port}.`))