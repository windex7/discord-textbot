FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

WORKDIR /usr/app
COPY ./package.json /usr/app

RUN npm install discord.js
RUN npm install dotenv