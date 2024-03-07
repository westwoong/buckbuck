FROM node:slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env.product .

COPY ./dist .

EXPOSE 3000

CMD [ "node", "main" ]
