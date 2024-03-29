FROM node:16
MAINTAINER ashwani@zxcv32.com
WORKDIR /etc/newman
COPY src ./src
COPY .env ./
COPY package*.json ./
RUN npm install
ENTRYPOINT [ "node", "src/index.js" ]
