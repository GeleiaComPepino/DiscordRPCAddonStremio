const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

const builder = new addonBuilder({
    id: "org.bryan.discordrpc",
    version: "1.0.0",
    name: "Discord RPC Sync",
    description: "Envia informações do Stremio para o Discord RPC.",
    
    catalogs: [],
    resources: ["stream"],
    types: ["movie", "series"],
    idPrefixes: ["tt"]
});

builder.defineStreamHandler(async (args) => {
    const info = {
        id: args.id,
        type: args.type,
        title: args.id,
        timestamp: Date.now()
    };
    fetch("http://localhost:41555/stremio-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
    }).catch(() => {});

    return Promise.resolve({ streams: [] });
});

serveHTTP(builder.getInterface(), { port: 7000 });

console.log("Addon rodando: http://localhost:7000/manifest.json");

