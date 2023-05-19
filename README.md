# ft_transcendence

Transcend with a ping-pong game ^\_^

## Tech Stack

### [Backend](backend)

NestJS(server), Prisma(ORM), Postgresql(DB), Redis(Cache DB), Sagger(API Doc)

### [Frontend](frontend)

React(Framework/Library), Vite(Tooling)

### DevOps

Docker-compose, Github(CI/CD)?

## Environment Variables

This project need a .env file to work. Here is an example: [.envexample](.envexample). All variables in the example file are necessary.

## SSL

Need genuine .key and .crt files in the backend directory to make https working. Or you might want to disable the "httpsOptions" and remove the file reading part in [main.ts](backend/src/main.ts).  
(Is set disabled for now.)

# How to run the project

1. Clone this repo.  
   via ssh: `git@github.com:JAS0NHUANG/ft_transcendenc.git`  
   via https: `https://github.com/JAS0NHUANG/ft_transcendenc.git`

2. Create the .env file in the project root directory from .envexample and set all the variables inside.

3. `make`
