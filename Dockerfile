FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g npm@latest
    
EXPOSE 3000

