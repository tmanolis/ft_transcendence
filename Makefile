all:
	mkdir -p ~/transcendence/database
	docker-compose -f ./devops/docker-compose.yml up --build -d

down:
	docker-compose -f ./devops/docker-compose.yml down

fclean:	down
	docker rmi -f $$(docker images -aq)
	docker system prune --all --force --volumes
	docker network prune --force
	docker volume prune --force
	rm -rf ~/transcendence/database

.PHONY:	all down fclean


