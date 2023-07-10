FROM node:18

WORKDIR /App

COPY package*.json ./

# use ci in stead of install
RUN npm install

# copy source code
COPY . .

# build the app
RUN npm run build

# Starting frontend with vite
CMD npm run dev