FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Génère le client Prisma pour MySQL
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]