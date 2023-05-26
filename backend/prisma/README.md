Changes in the prisma schema are not implemented automatically.
They have to be migrated in the container as follows:

docker exec -it backend bash
npx prisma migrate dev --name <name migration>
exit