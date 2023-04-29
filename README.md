# ft_transcendence
Transcend with a ping-pong game ^_^

## Tech Stack
### [Backend](backend)
NestJS(server), Prisma(ORM), Postgresql(DB), Redis(Cache DB), Sagger(API Doc) 

### [Frontend](frontend)
React(Framework/Library), Vite(Tooling)

### [DevOps](devops)
Docker-compose, Github(CI/CD)?

## Run the project
`make`
`make build`
`make stop`

## Environment Variables
This project need a .env file to work. Here is an example: [.envexample](.envexample)

## SSL
Need genuine .key and .crt files in the backend directory to make https working. Or you might want to disable the "httpsOptions" and remove the file reading part in [main.ts](backend/src/main.ts).  

