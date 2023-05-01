all:
	mkdir ./database
	docker compose up --build -d

down:
	docker compose down

fclean:	down
	docker rmi -f $$(docker images -aq)
	docker system prune --all --force --volumes
	docker network prune --force
	docker volume prune --force
	rm -rf ./database

.PHONY:	all down fclean


