## Migrate changes in prisma scheme

Changes in the prisma schema are not implemented automatically.
They have to be migrated in the container as follows:

docker exec -it backend bash
npx prisma migrate dev --name <name migration>
exit


## Update upon prisma error

** When prisma errors occur, it's possible that the current state
is still on an old version of the prisma scheme. To update, run:

docker exec -it backend bash
npx prisma migrate dev
exit


## Prisma Studio

** To open Prisma Studio, copy .env file into the /backend folder
at build, with key DB_CONTAINER set to "localhost",
and run the following command from that folder:

npx prisma studio