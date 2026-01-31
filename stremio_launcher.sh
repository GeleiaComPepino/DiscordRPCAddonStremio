#!/bin/bash

echo "Iniciando scripts Node..."
node /home/geleiacompepino/Projetos/DiscordRPCAddonStremio/index.js &
PID1=$!
echo "Script1 PID = $PID1"

node /home/geleiacompepino/Projetos/DiscordRPCAddonStremio/Servidor/index.js &
PID2=$!
echo "Script2 PID = $PID2"

echo "Iniciando Stremio..."
flatpak run com.stremio.Stremio
echo "Stremio finalizou, encerrando Node."

kill $PID1
kill $PID2

echo "Todos os scripts encerrados."

