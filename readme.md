# Structure


## Lancer le projet (back et front) avec docker

#### Au premier lancement ou à chaque modification des dockerfiles ou docker-compose

```sh   
docker compose -f docker-compose.yml up --build
```
#### Si vous avez déjà lancé le projet avec docker et que le conteneur est existant

```sh
docker-compose up
```
Playground graphQl: http://localhost:4000/graphql
PHPmyadmin: http://localhost:8080
  - serveur = [CONTAINER_NAME] (mysql)
  - user = [USERNAME] (root)
  - password = [PASSWORD] (root)
Client: http://localhost:3000

#### Entrez dans le conteneur

##### Dans le serveur ou client
```sh
docker exec -it [CONTAINER_ID] /bin/sh
```
"exit" pour sortir du conteneur

##### Dans la DB
```sh  
docker exec -it [CONTAINER_ID | CONTAINER_NAME] mysql -u[USERNAME] -p[PASSWORD]
```
"quit" pour sortir du conteneur

## Lancer le projet

### Installer les node modules

```sh
npm install
```

### Créer un fichier .env à la racine du projet

Exemple pour une BDD [image]({https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white}) local utilisée en développement
```
DATABASE_URL=file:./dev.db
```

### Génerer la base de données (Génère automatiquement la BDD)

```sh
npx prisma migrate dev
```
Génère automatiquement une base de données sqlite ainsi que la mrigation pour créer les tables correspondantes au schema prisma.

### Lancer le serveur

```sh
npm run start
```
Le playground graphQl sera accéssible sur le port 4000

### Pour visualiser et manipuler les données de la base de données

```sh
npx prisma studio
```
Une interface sera disponible sur le port 5000


## Pendant les développement

### Après chaque modification du modèle prisma

```sh
npx prisma db push
```

### Vous pouvez également réinitialiser la base de données

ATTENTION NE PAS UTILISER EN PRODUCTION
```sh
npx prisma migrate reset
```


## Pour la production
```sh
npx prisma migrate deploy
```

