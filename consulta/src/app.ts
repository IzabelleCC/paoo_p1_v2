import express from 'express'
import axios from 'axios'




const app = express()
app.use(express.json())

interface Cidade{
    id: string;
    nome: string;
}

interface LatLon {
    id: string;
    cidade: string;
    lat: number;
    lon: number;
}
interface Condicao {
    idCond: string;
    name: string;
    lat: number;
    lon: number;
    dt: number;
    feels_like: number;
    description: string;
    coordenadaId: string;
}



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