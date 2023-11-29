FROM node:lts-alpine
ENV NODE_ENV=dev
WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install 
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
RUN chown -R node /usr/local/lib/node_modules/
RUN npm install -g prisma
RUN prisma generate


