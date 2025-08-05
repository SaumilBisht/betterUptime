## STEPS

1. Docker containers:
    docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
    docker run -d -p 6379:6379 redis

2. Migrate DB: bunx prisma migrate dev     

3. Seed The DB with websites And Regions

    - Start api server : bun index.ts
    - Go to tests: bun test

    -> docker exec -it <container_id> sh
    -> psql -U postgres
    -> put india and usa region(must create a seed.ts)
       - insert into region (id,name) values ('9a0511a5-731b-4892-8d70-4108baa29362','india');
       - insert into region (id,name) values ('3b6ee783-3a33-47e8-86e4-3b5d6dd0336a','usa');

4. Create Consumer Group
    -> docker exec -it <container_id> sh
    -> redis-cli
    -> XGROUP CREATE betteruptime:website 9a0511a5-731b-4892-8d70-4108baa29362 $ MKSTREAM
    -> XGROUP CREATE betteruptime:website 3b6ee783-3a33-47e8-86e4-3b5d6dd0336a $ MKSTREAM

5. Push from pusher
  -> bun index.ts

6. Worker se read
  -> REGION_ID=9a0511a5-731b-4892-8d70-4108baa29362 WORKER_ID=1 bun index.ts