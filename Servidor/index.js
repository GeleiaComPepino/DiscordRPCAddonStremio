const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const RPC = require('discord-rpc')

const app = express()
app.use(bodyParser.json())

// Discord RPC
const clientId = "1446922291207344189"   // seu client ID
RPC.register(clientId)
const rpc = new RPC.Client({ transport: 'ipc' })

// Sua API KEY da OMDb
const OMDB_KEY = "6ea6cda0"

// ---------- Função para pegar nome da série ----------
async function getTitleFromIMDB(id) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${OMDB_KEY}&i=${id}`)
        const data = await res.json()

        if (data && data.Title) {
            return data.Title
        }

        return id // fallback
    } catch (err) {
        console.log("Erro OMDb:", err)
        return id
    }
}

// ---------- Função para atualizar Discord RPC ----------
async function updateRPC(data) {
    console.log("Recebido do Stremio:", data)

    const [imdb, season, episode] = data.id.split(':')

    const title = await getTitleFromIMDB(imdb)

    rpc.setActivity({
        details: `Assistindo: ${title}`,
        state: `Temporada ${season} • Episódio ${episode}`,
        largeImageKey: "stremio",
        largeImageText: "Stremio",
        startTimestamp: Math.floor(data.timestamp / 1000)
    })

    console.log("RPC atualizado!")
}

// ---------- Endpoint para o addon ----------
app.post('/stremio-event', async (req, res) => {
    const data = req.body
    updateRPC(data)
    res.json({ ok: true })
})

// ---------- Iniciar servidor ----------
rpc.on("ready", () => {
    console.log("✔ Discord RPC conectado!")
    app.listen(41555, () => console.log("✔ Servidor ouvindo em http://localhost:41555"))
})

rpc.login({ clientId }).catch(console.error)

