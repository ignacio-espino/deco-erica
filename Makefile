.PHONY: build
build:
	docker-compose build
	docker-compose run frontend npm install

.PHONY: make-migrations
make-migrations:
	docker-compose run backend python manage.py makemigrations

.PHONY: run-migrations
run-migrations:
	docker-compose run backend python manage.py migrate

.PHONY: create-superuser
create-superuser:
	docker-compose run backend python manage.py createsuperuser

.PHONY: frontend
frontend:
	docker-compose up frontend

.PHONY: up
up:
	docker-compose up

.PHONY: stop
stop:
	docker-compose down
	docker-compose stop

.PHONY: clean
clean: stop
	docker-compose rm

.PHONY: shell-local
shell-local:
	docker-compose exec backend python manage.py shell_plus

.PHONY: bash-local
bash-local:
	docker-compose exec backend bash

.PHONY: logs-backend
logs-backend:
	docker-compose logs -ft backend
