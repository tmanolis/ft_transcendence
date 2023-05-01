## NestJS
#### Backend framework base on Node.js and Express.  
Learn how to install, create new project, run service, test, use cli tool...etc. on [NestJS - DOCS](https://docs.nestjs.com)   

!! The module.ts file is the entry point of each module. The controller.ts does the routing and some config. The service.ts "provide" the services(functionalities).  !!

## Prisma
#### ORM for Node.js & TypeScript
This is a good tuto video:[WDS - Learn Prisma In 60 Minutes](https://www.youtube.com/watch?v=RebA5J-rlwg)  
And of course: [NestJS - DOCS - Prisma](https://docs.nestjs.com/recipes/prisma)  

? do we always need to do the migration manualy on local server before dockerizing the project ?

## Postgresql
Database.  

## Redis
Cache databse.  

## Swagger
#### API documentation tool
Learn how to integrate swagger into NestJS here: [NestJS - DOCS - OpenAPI](https://docs.nestjs.com/openapi/introduction)

## Websocket  
Using "socket.io" library.  
[NestJS - DOCS - Gateways](https://docs.nestjs.com/websockets/gateways)  
`npx nest g gateway`  

## SSL certificate(optional)
Aquire an SSL certificate from [ZeroSSL](https://zerossl.com). Follow the instruction on the site.  
Copy the .crt and .key files into docker containers.  
Use 'fs' package to read the file and add httpsOptions into main.ts.  

