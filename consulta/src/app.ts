import express from 'express'
import axios from 'axios'

import { LatLon } from '../../coordenadas/src/app'
import { Condicao } from '../../condicoes/src/app'


const app = express()
app.use(express.json())




const baseConsulta: Record<string, {coordenada: LatLon, condicao: Condicao[]}> = {}


const funcoes = {
    
    CoordenadasCriadas: (coordenada: LatLon) => {
        baseConsulta[coordenada.id] = { coordenada, condicao: [] } 
    },
    CondicoesDaCidadeCriada: (condicao: Condicao) => {
        const condicoes= baseConsulta[condicao.coordenadaId]?.condicao || []
        condicoes.push(condicao)
    }
    
}

app.get('/coordenadas', (req, res) => {
    console.log(baseConsulta)
    res.json(baseConsulta)
})


app.post('/eventos', (req, res) => {
    type TipoDeEvento = 'CoordenadasCriadas' | 'CondicoesDaCidadeCriada';
    const tipoDeEvento: TipoDeEvento = req.body.tipo;
    funcoes[tipoDeEvento](req.body.dados);
    res.status(200).send(baseConsulta);
})

const port = 6000
app.listen(port,() => console.log(`Consultas. Porta ${port}.`))