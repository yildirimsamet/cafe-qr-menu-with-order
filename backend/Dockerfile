FROM node:18-alpine as dev

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]

FROM node:20-alpine as prod

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]