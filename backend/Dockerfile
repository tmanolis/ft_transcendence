FROM node:18

WORKDIR /backend

COPY package*.json ./
COPY prisma ./prisma/

RUN apt update && apt install -y vim

RUN npm ci --verbose

COPY certificate.crt /etc/ssl/
COPY private.key /etc/ssl/


# copy source code
COPY . .

RUN npx prisma generate

# Start the server using the production build
CMD npx prisma migrate deploy &&  npm run start:dev
