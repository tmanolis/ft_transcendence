Changes in the prisma schema are not implemented automatically.
They have to be migrated in the container as follows:

docker exec -it backend bash
npx prisma migrate dev --name <name migration>
exit

To open Prisma Studio, copy .env file into the /backend folder,
change the DB_CONTAINER-variable value to "localhost",
and run the following command from that folder:
npx prisma studio
