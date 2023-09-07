DB_DIR='./database'

all:
	rm -rf ./database
	mkdir ./database
	docker compose up --build

down:
	docker compose down

fclean:	down
	docker rmi -f $$(docker images -aq)
	docker system prune --all --force --volumes
	docker network prune --force
	docker volume prune --force
	rm -rf ./database
	docker volume rm $$(docker volume ls -q)

.PHONY:	all down fclean
