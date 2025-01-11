# Setup
Everything can be run with docker. Install that on your local machine for development.

# Development
To start the entire application in development, run:

```docker-compose up```

If a package.json or Dockerfile is changed, the containers will need to be rebuilt.

```docker-compose up --build```

`vue-app` will auto-reload, but api-app depends on docker-compose watch mode. Press "w" after starting docker-compose for changes to api-app to cause the server to restart. It should also rebuild appropriate containers when a package.json file changes.

Parts of the application can also be run outside of docker. For folders with `package.json`, for example, see what `engine` is supported and what `scripts` are provided.

