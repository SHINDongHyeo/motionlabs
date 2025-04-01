FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g npm@latest

RUN npm install

RUN npm run build
    
EXPOSE 3000

ENV NODE_ENV=development

CMD ["node", "dist/main.js"]
