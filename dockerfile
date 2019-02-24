FROM node:11-alpine
RUN mkdir -p /app/server
WORKDIR /app/server
EXPOSE 80 443
RUN npm install
ENTRYPOINT npm run start
