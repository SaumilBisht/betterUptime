import { xReadGroup,xAckBulk,xAutoClaim} from "redisstream/client";
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
  let lastAutoClaim=Date.now();
  while(1)
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