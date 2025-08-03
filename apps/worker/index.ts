import { xReadGroup,xAckBulk } from "redisstream/client";
import {prisma} from "db/client"
import axios from "axios";

const REGION_ID = process.env.REGION_ID!;
const WORKER_ID = process.env.WORKER_ID!;

if (!REGION_ID) {
  throw new Error("Region not provided");
}

if (!WORKER_ID) {
  throw new Error("Region not provided");
}

async function main()
{
  while(1)
  {
    const response = await xReadGroup(REGION_ID, WORKER_ID); //messages array returns
    if (!response) continue;

    let promises = response.map(({message}) => fetchWebsite(message.url, message.id))

    await Promise.all(promises);
    console.log(promises.length);

    xAckBulk(REGION_ID, response.map(({id}) => id));//redis message id acknowledge
  
  }
}
async function fetchWebsite(url: string, websiteId: string) //receives url and db id
{
  // hits url and puts it in status DB
  return new Promise<void>((resolve, reject) => {
  const startTime = Date.now();

  axios.get(url)
    .then(async () => { 
      const endTime = Date.now();
      await prisma.website_tick.create({
          data: {
              response_time_ms: endTime - startTime,
              status: "Up",
              region_id: REGION_ID,
              website_id: websiteId
          }
      })
      resolve()
    })
    .catch(async () => {
      const endTime = Date.now();
      await prisma.website_tick.create({
          data: {
              response_time_ms: endTime - startTime,
              status: "Down",
              region_id: REGION_ID,
              website_id: websiteId
          }
      })
      resolve()
    })
  })
}

main();