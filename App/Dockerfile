FROM node:18

WORKDIR /App

COPY package*.json ./

RUN apt update && apt install -y vim

# use ci in stead of install
RUN npm install

# copy source code
COPY . .

# Start the server using the production build
CMD npm run dev