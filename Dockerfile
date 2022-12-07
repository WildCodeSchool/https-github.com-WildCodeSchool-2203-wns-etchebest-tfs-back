FROM node:lts

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm i -g typescript ts-node-dev 
COPY src src
COPY tsconfig.json tsconfig.json
COPY prisma prisma
CMD npx prisma generate && npx prisma db push --force-reset && npx prisma db seed && npm run start && npx prisma studio