FROM node:20-alpine as dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:20-alpine as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


CMD ["npm", "run", "start"]