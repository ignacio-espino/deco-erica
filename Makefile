#### Deploy variables ####
GCLOUD_USERNAME := nacho
VM_INSTANCE_NAME := sistema-deco
VM_ZONE := "us-central1-a"
PROJECT_NAME := "sapient-cycling-404615"
###########################

.PHONY: build
build:
	docker compose build
	docker compose run frontend npm install

.PHONY: make-migrations
make-migrations:
	docker compose run backend python manage.py makemigrations

.PHONY: show-migrations
show-migrations:
	docker compose run backend python manage.py showmigrations

.PHONY: run-migrations
run-migrations:
	docker compose run backend python manage.py migrate

.PHONY: create-superuser
create-superuser:
	docker compose run backend python manage.py createsuperuser

.PHONY: frontend
frontend:
	docker compose up frontend

.PHONY: up
up:
	docker compose up

.PHONY: stop
stop:
	docker compose down
	docker compose stop

.PHONY: clean
clean: stop
	docker compose rm

.PHONY: shell-local
shell-local:
	docker compose exec backend python manage.py shell_plus

.PHONY: bash-local
bash-local:
	docker compose exec backend bash

.PHONY: logs-backend
logs-backend:
	docker compose logs -ft backend

.PHONY: up-production
up-production:
	gcloud compute ssh ${GCLOUD_USERNAME}@${VM_INSTANCE_NAME} --zone ${VM_ZONE} --project ${PROJECT_NAME} -- 'cd deco-erica && sudo docker compose rm -f && sudo docker compose -f docker-compose-production.yml up -d --force-recreate'

.PHONY: run-migrations-production
run-migrations-production:
	gcloud compute ssh ${GCLOUD_USERNAME}@${VM_INSTANCE_NAME} --zone ${VM_ZONE} --project ${PROJECT_NAME} -- 'cd deco-erica && sudo docker compose -f docker-compose-production.yml exec backend python manage.py migrate'

.PHONY: build-production
build-production:
	gcloud compute ssh ${GCLOUD_USERNAME}@${VM_INSTANCE_NAME} --zone ${VM_ZONE} --project ${PROJECT_NAME} -- 'cd deco-erica && sudo docker compose -f docker-compose-production.yml build'

.PHONY: git-pull-production
git-pull-production:
	gcloud compute ssh ${GCLOUD_USERNAME}@${VM_INSTANCE_NAME} --zone ${VM_ZONE} --project ${PROJECT_NAME} -- 'cd deco-erica && git pull'

.PHONY: deploy
deploy: git-pull-production build-production up-production run-migrations-production