FROM node:18-alpine as build

WORKDIR /app/client
COPY package*.json ./

RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build

FROM nginx

COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/client/dist/frontend/browser /usr/share/nginx/html
