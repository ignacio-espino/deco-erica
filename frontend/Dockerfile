# Local stage
FROM node:10.16.0 as local

WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN yarn install

COPY ./public /app/public
COPY ./src /app/src

# Run locally
EXPOSE 3000
CMD ["yarn", "run", "start"]

# Build for production stage
FROM local as production
RUN yarn run build

# Production stage
FROM nginx:1.16.0-alpine

COPY --from=production /app/build /usr/share/nginx/html
COPY ./nginx-proxy.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
