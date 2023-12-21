FROM node:18-alpine as build

WORKDIR /app/client
COPY frontend/package*.json ./

RUN npm install --legacy-peer-deps
COPY ./frontend .

RUN npm run build

FROM nginx

COPY ./frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/client/dist/frontend/browser /usr/share/nginx/html
