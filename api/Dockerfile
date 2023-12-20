FROM node:18-alpine as build

WORKDIR /app/api

COPY api/package*.json ./

RUN npm install

COPY ./api .

RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY api/package*.json ./
ARG NODE_ENV=production
RUN npm install
COPY --from=build /app/api/build /app/build

CMD ["node", "./build/api/server.js"]
