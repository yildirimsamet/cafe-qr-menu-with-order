FROM node:18 AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["npm", "run", "dev"]

FROM node:18 AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["node", "src/index.js"]
