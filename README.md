## Template project
React + Django + Docker-Compose

### Installation
1. install docker-compose
1. create `.env` file in `/backend` by copping from `.env.example`
1. build using docker-compose: run `make build`
1. run migrations: `make run-migrations`
1. create superuser: `make create-superuser`
1. to start project just run: `make up`
1. project should be running in http://localhost:3000 and the backend at http://localhost:8000

### Where to add new code
- In `urls.py` you can define the endpoints, check already defined examples

### ToDo
- the entire project doesn't have a single test
- the frontend is quite a mess

