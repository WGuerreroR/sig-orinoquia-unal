# ---------- BUILD ----------
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# ---------- SERVE ----------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar assets de Cesium
COPY --from=builder /app/node_modules/cesium/Build/Cesium /usr/share/nginx/html/cesium

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]