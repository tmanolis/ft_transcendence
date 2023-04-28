## NestJS
Backend framework base on Node.js and Express.  

## Prisma
ORM for Node.js & TypeScript

## Postgresql
Database.  

## Redis
Cache databse.  

## Swagger
API documentation tool

# Development Process
1. Setup the NestJS environment and create a new project
`npm i -g @nestjs/cli`  
`nest new transcendence`  

Run the bootstraped app
`npm run start`  
`npm run start:dev`(this will watch for changes in files)  

2. Remove example (unnecessary) files and create new module  
Remove `app.controller.ts` and its test file `app.controller.spec.ts`  
Also remove `app.service.ts` file  

Generate a new moudle with `nest g module <module_name>`  
Generate a controller for this module `nest g controller <module_name>`  
!! The module.ts file is the entry point of each module. The controller.ts does the routing and some config. The service.ts "provide" the services(functionalities).  !!

---

## Installation
```bash
$ npm install
```

## Running the app
```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov
```
