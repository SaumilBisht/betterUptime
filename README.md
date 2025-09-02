## MANUAL STEPS

1. Docker containers:
    docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
    docker run -d -p 6379:6379 redis

2. Migrate DB:
     -> cd packages/db 
     -> bun run migrate (should seed regions manually)   


3. Push from pusher
  -> bun index.ts

4. Worker se read
  -> REGION_ID=9a0511a5-731b-4892-8d70-4108baa29362 WORKER_ID=1 bun index.ts
  -> REGION_ID=3b6ee783-3a33-47e8-86e4-3b5d6dd0336a WORKER_ID=2 bun index.ts
  (region id take from seed regions as it will make the consumer group)
5. Api start
  -> bun index.ts

6. Frontend Start
  -> bun run dev

## DOCKER STEPS:

STEP 0: CLONE REPO
  -> git clone https://github.com/SaumilBisht/betterUptime
  -> cd betterUptime

STEP 1: CREATE NETWORK
  -> docker network create my_app  

STEP 2: RUN POSTGRES & REDIS
  -> docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
  -> docker run -d -p 6379:6379 redis

STEP 3: BUILD IMAGES
  docker build -t uptime-fe -f docker/Dockerfile.fe .
  docker build -t uptime-api -f docker/Dockerfile.api .
  docker build -t uptime-pusher -f docker/Dockerfile.pusher .
  docker build -t uptime-worker -f docker/Dockerfile.worker .

STEP 4: RUN EACH CONTAINER

# Run frontend
docker run -d \
  --name frontend \
  --network my_app \
  -p 3000:3000 \
  uptime-fe

# Run backend
docker run -d \
  --name api \
  --network my_app \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres \
  --env-file ./apps/api/.env \
  -p 3001:3001 \
  uptime-api


# Run Pusher server
docker run -d \
  --name pusher \
  --network my_app \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres \
  uptime-pusher

# Run WORKER server
docker run -d \
  --name worker1 \
  --network my_app \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres \
  --env REGION_ID=9a0511a5-731b-4892-8d70-4108baa29362 \
  --env WORKER_ID=1 \
  --env-file ./apps/worker/.env \
  uptime-worker1

docker run -d \
  --name worker2 \
  --network my_app \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres \
  --env REGION_ID=3b6ee783-3a33-47e8-86e4-3b5d6dd0336a \
  --env WORKER_ID=2 \
  --env-file ./apps/worker/.env \
  uptime-worker2

* For migrating database:
  - docker exec -it frontend sh
  - cd packages/db
  - bunx prisma migrate dev --name init

  (exit to move out)

* To remove all container:
    docker stop $(docker ps -q)
    docker rm $(docker ps -aq)
