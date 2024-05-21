import express from 'express'
import axios from 'axios';

const app = express()
app.use(express.json())

interface Cidade{
    idCidade: string;
    nomeCidade: string;
}
interface Coordenada {
    idCidade: string;
    idCoordenada: string;
    nomeCidade: string;
    lat: number;
    lon: number;
}
interface Condicao {
    idCoordenada: string;
    idCondicao: string;
    nomeCidade: string;
    lat: number;
    lon: number;
    dt: number;
    feels_like: number;
    description: string;
}


const cidades: Record<string, Cidade> = {}
let id: string = '1'

app.get('/cidades', (req, res) => {
    res.json(cidades)
})

app.post('/cidades', async (req, res) => {
    const cidade  = req.body


    try{

    }
    catch(erro){
        res.status(400).json({ erro: 'errooooo.'})
    }
})