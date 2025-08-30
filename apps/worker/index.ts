import { ensureConsumerGroup,xReadGroup,xAckBulk,xAutoClaim} from "redisstream/client";
import {prisma} from "db/client"
import axios,{ type AxiosInstance } from "axios";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
  throw new Error("Region not provided");
}

if (!WORKER_ID) {
  throw new Error("Region not provided");
}

const proxyPort = Number(process.env.PROXY_PORT);

async function checkRegion(region_id:string):Promise<string | null>
{
  const res = await prisma.region.findUnique({ where: { id: REGION_ID } });
  if (!res) return null;
  if (res.name === "india") return process.env.INDIA_PROXY!;
  if (res.name === "usa") return process.env.US_PROXY!;
  return null;
}

async function createAxiosInstance(): Promise<AxiosInstance> {
  const proxyHost = await checkRegion(REGION_ID);
  console.log(proxyHost);
  return proxyHost
    ? axios.create({
        proxy: { host: proxyHost, port: proxyPort },
        timeout: 10000, // 10 seconds
      })
    : axios.create({ timeout: 10000 });
}
const axiosInstance = await createAxiosInstance();

await ensureConsumerGroup(REGION_ID);
async function main()
{
  let lastAutoClaim=Date.now();
  while(true)
  {
    const response = await xReadGroup(REGION_ID, WORKER_ID); //messages array returns

    if (response && response.length > 0) {
      await Promise.all(
        response.map(({ message }) => fetchWebsite(message.url, message.id))
      );// Waits for all of them to finish not one by one which would take some time.
      xAckBulk(REGION_ID, response.map(({ id }) => id));
      console.log(`Processed ${response.length} new messages`);//how many messages were read in a single xReadGroup call+ some messages arrive at slightly different times(as pusher is pushing every 3 min).
    }
    //Pending Messages Reclaim Now.
    if (Date.now() - lastAutoClaim > 300000) { // every 300 seconds
      lastAutoClaim = Date.now();

      const pending = await xAutoClaim(REGION_ID, WORKER_ID, 90000, 10); // claim msgs idle > 90s
      if (pending.length > 0) 
      {
        console.log(`Reclaimed ${pending.length} stuck messages`);
        await Promise.all(
          pending.map(({ message }) => fetchWebsite(message.url, message.id))
        );
        xAckBulk(REGION_ID, pending.map(({ id }) => id));
      }
    }
  }
}
async function fetchWebsite(url: string, websiteId: string) //receives url and db id
{
  // hits url and puts it in status DB
  const startTime = Date.now();
  
  try {
    await axiosInstance.get(url);
    const endTime = Date.now();
    await prisma.website_tick.create({
      data: {
        response_time_ms: endTime - startTime,
        status: "Up",
        region_id: REGION_ID,
        website_id: websiteId,
      },
    });
  } catch {
    const endTime = Date.now();
    await prisma.website_tick.create({
      data: {
        response_time_ms: endTime - startTime,
        status: "Down",
        region_id: REGION_ID,
        website_id: websiteId,
      },
    });
  }
}

main();