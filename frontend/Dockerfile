FROM node:18 AS development

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

FROM node:18 AS production

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]