FROM node:18

WORKDIR /backend

COPY package*.json ./

RUN apt update && apt install -y vim

RUN npm ci --verbose

COPY certificate.crt /etc/ssl/
COPY private.key /etc/ssl/

# copy source code
COPY . .

RUN npm run build

# Start the server using the production build
CMD [ "npm", "run", "start:dev" ]
