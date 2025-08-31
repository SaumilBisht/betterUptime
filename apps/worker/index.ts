import { ensureConsumerGroup,xReadGroup,xAckBulk,xAutoClaim} from "redisstream/client";
import {prisma} from "db/client"
import axios,{ type AxiosInstance } from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';

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
  const agent = new HttpsProxyAgent(`http://${proxyHost}:${proxyPort}`);

  return proxyHost? 
    axios.create({
      httpAgent: agent,
      httpsAgent: agent,
      timeout: 20000,
      maxRedirects: 5,
    })
    : axios.create({ timeout: 10000 });//not hang on a dead server
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
    const response = await axiosInstance.get(url, { timeout: 20000 });
    console.log(url, response.status);
    const endTime = Date.now();
    await prisma.website_tick.create({
      data: {
        response_time_ms: endTime - startTime,
        status: "Up",
        region_id: REGION_ID,
        website_id: websiteId,
      },
    });
  } catch (err:any){
    console.error(url, err.code || err.message);
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