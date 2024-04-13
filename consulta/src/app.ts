import express from 'express'
import axios from 'axios'

import { LatLon } from '../../coordenadas/src/app'
import { Condicao } from '../../condicoes/src/app'


const app = express()
app.use(express.json())

type TipoDeEvento = 'CoordenadasCriadas' | 'CondicoesDaCidadeCriada';

interface BaseConsulta {
    [id: string]: LatLon | Condicao[]
}


const baseConsulta: BaseConsulta = {};

const funcoes = {
    CoordenadasCriadas: (latLon: LatLon) => {
        baseConsulta[latLon.id] = latLon
    },
    CondicoesDaCidadeCriada: (condicao: Condicao) => {
        let condicoesDaCidade = baseConsulta[condicao.id] as Condicao[];
        if (!Array.isArray(condicoesDaCidade)) {
            condicoesDaCidade = [];
        }
        condicoesDaCidade.push(condicao);
        baseConsulta[condicao.id] = condicoesDaCidade;
    }
}

app.get('/coordenadas', (req, res) => {
    res.json(baseConsulta)
})


app.post('/eventos', (req, res) => {
    const { tipo, dados } = req.body;
    if (tipo in funcoes) {
        (funcoes[tipo as TipoDeEvento])(dados);
        res.status(200).send(baseConsulta);
    } else {
        res.status(400).send({ error: 'Tipo de evento desconhecido' });
    }
})

const port = 6000
app.listen(port,() => console.log(`Consultas. Porta ${port}.`))