# Local stage
FROM node:14 as build

WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN yarn install --network-timeout 1000000

COPY ./public /app/public
COPY ./src /app/src

# Build for production stage
RUN yarn run build

# Production stage
FROM nginx:1.16.0-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx-proxy.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
