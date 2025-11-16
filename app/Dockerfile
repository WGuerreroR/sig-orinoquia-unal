# === Build Stage ===
FROM node:20 AS build
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn prod

# === Deploy Stage ===
FROM nginx:stable-alpine
COPY --from=build /app/prod /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
