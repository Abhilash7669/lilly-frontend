FROM node:24-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ARG DEFAULT_PORT=3000

ENV PORT=${DEFAULT_PORT}

EXPOSE $PORT

CMD ["npm", "start"]
