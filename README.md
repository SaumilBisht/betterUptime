## STEPS

1. Docker containers:
    docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
    docker run -d -p 6379:6379 redis

2. Migrate DB(packages/db):
     -> bun run migrate (should seed regions manually)   


3. Push from pusher
  -> bun index.ts

4. Worker se read
  -> REGION_ID=9a0511a5-731b-4892-8d70-4108baa29362 WORKER_ID=1 bun index.ts
  -> REGION_ID=3b6ee783-3a33-47e8-86e4-3b5d6dd0336a WORKER_ID=2 bun index.ts
  (region id take from seed regions as it will make the consumer group)