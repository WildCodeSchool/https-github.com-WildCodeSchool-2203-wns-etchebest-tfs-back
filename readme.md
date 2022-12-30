# Structure

# Project status

*This project is currently in development*

## Pre-requisites

You need to install on your machine:
Docker: https://docs.docker.com/get-docker/ It needs to be installed in rootless-mode
Nodejs: https://nodejs.org/en/download/
Yarn:  https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable

## Create a directory. In this directory, clone both of the repositories:

Back-end: 
```sh
git clone git@github.com:WildCodeSchool/2203-wns-etchebest-tfs-back.git
``` 

Front-end:
```sh
git clone git@github.com:WildCodeSchool/2203-wns-etchebest-tfs-front.git
``` 


## Run the project locally using Docker:

#### First time you need to build the application image, and each time the Dockerfile is updated, you need to rebuild:

```sh   
docker compose -f docker-compose.yml up --build
```
#### Otherwise just run this command:

```sh
docker-compose up
```

#### Check if the containers are running properly:
```sh
docker ps -a
```

Playground graphQl: http://localhost:4000/graphql
PHPmyadmin: http://localhost:8080
  - serveur = [CONTAINER_NAME] (mysql)
  - user = [USERNAME] (root)
  - password = [PASSWORD] (root)
Client: http://localhost:3000

#### Enter in a docker container:

##### For the server and client containers:
```sh
docker exec -it [CONTAINER_ID] /bin/sh
```

##### For the database container
```sh  
docker exec -it [CONTAINER_ID | CONTAINER_NAME] mysql -u[USERNAME] -p[PASSWORD]
```

### Prisma ORM: Create database
https://www.prisma.io/docs/getting-started/quickstart

### Generate and apply migrations (development ONLY):
```sh
npx prisma generate
```

```sh
npx prisma migrate dev
```

### Everytime a model is updated:

```sh
npx prisma db push
```

### Visualize datas:
```sh
npx prisma studio
```
An interface will be available on port 5000


## Seeding datas:

#### For development, DB is initialized with 4 users: Intern, User, Lead, Admin

##### Intern
- email: intern@structure.com
- password: 00000000
##### User
- email: user@structure.com
- password: 00000000
##### Lead
- email: lead@structure.com
- password: 00000000
##### Admin
- email: admin@structure.com
- password: 00000000


### Reset database:

WARNING: DO NO USE IN PRODUCTION
```sh
npx prisma migrate reset
```


### FOR PRODUCTION ONLY
```sh
npx prisma migrate deploy
```

