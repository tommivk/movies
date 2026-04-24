
The app is deployed to: https://movies-tommivk.netlify.app/ (The backend server might take up to a minute to spin up) 

## Setting up the dev environment 
### Start the dev environment with docker
````
docker compose -f docker-compose.dev.yml up
````
### Start in production mode
````
docker compose -f docker-compose.yml up
````

The app will be available in http://localhost:8080/
