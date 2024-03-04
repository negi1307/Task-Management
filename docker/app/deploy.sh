docker rmi -f $(docker images -q)
docker tag tmstserver:latest tmstserver:previous
docker tag tmstadmin:latest tmstadmin:previous
docker tag tmstsales:latest tmstsales:previous
docker tag tmstuser:latest tmstuser:previous
docker-compose up -d --build
