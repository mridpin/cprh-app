### running locally on docker
```
docker build .
docker run image_id -p 8000:8000
```

or run with:
```
docker-compose up
```
the volume mapping allows to make changes to the project from local development, will be picked up by project inside Docker