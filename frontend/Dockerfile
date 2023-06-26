FROM node:18

WORKDIR /frontend

COPY package*.json ./
# copy the entire prisma directory including migrations

RUN apt update && apt install -y vim

# use ci in stead of install
RUN npm ci --verbose

# copy source code
COPY . .

# build the React project
RUN npm run build

# Start the server using the production build
CMD npm run start