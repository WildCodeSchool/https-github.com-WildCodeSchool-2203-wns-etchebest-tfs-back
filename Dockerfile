FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm i -g typescript ts-node-dev
COPY src src
COPY tsconfig.json tsconfig.json
COPY .env .env
COPY prisma prisma
ENV DATABASE_URL="mysql://root:root@mysql:3306/tfs"
CMD npx prisma generate && npx prisma db push --force-reset && npx prisma db seed && npm run start && npx prisma studio