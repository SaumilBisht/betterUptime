import { createClient } from "redis";

// all client connections and functions in this file
const client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

type WebsiteEvent = {
  url: string, id: string
}

type MessageType = {
    id: string,
    message: {
        url: string,
        id: string
    }
}

const STREAM_NAME = "betteruptime:website";

export async function ensureConsumerGroup(consumerGroup: string) {
  try {
    await client.xGroupCreate(STREAM_NAME, consumerGroup, "$", { MKSTREAM: true });
    console.log(`Consumer group ${consumerGroup} created`);
  } catch (err: any) {
    if (err.message.includes("BUSYGROUP")) {
      console.log(`Consumer group ${consumerGroup} already exists`);
    } else {
      throw err;
    }
  }
}
async function xAdd({url, id}: WebsiteEvent) {
    await client.xAdd(
        STREAM_NAME, '*', {
            url,
            id
        }
    );
}

export async function xAddBulk(websites: WebsiteEvent[]) {
  for (let i = 0; i < websites.length; i++) {
      await xAdd({//@ts-ignore
          url: websites[i].url,//@ts-ignore
          id: websites[i].id
      })
  }
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> //returns 
{
    
  const res = await client.xReadGroup(
      consumerGroup, workerId, {
          key: STREAM_NAME,
          id: '>'
      }, {
      'COUNT': 5
      }
  );

  //@ts-ignore
  let messages: MessageType[] | undefined = res?.[0]?.messages;

  return messages;
}

async function xAck(consumerGroup: string, eventId: string) {
  await client.xAck(STREAM_NAME, consumerGroup, eventId)
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
  await Promise.all(eventIds.map(eventId => xAck(consumerGroup, eventId)));
}

export async function xAutoClaim(consumerGroup: string, workerId: string, minIdleMs = 60000, count = 10): Promise<MessageType[]> {

  const res = await client.xAutoClaim(
    STREAM_NAME,
    consumerGroup,
    workerId,
    minIdleMs, // claim messages, idle > minIdleMs
    '0-0',     // start from the beginning of pending list
    { COUNT: count }
  );

  // res[1] is the array of messages
  //@ts-ignore
  let messages: MessageType[] = res?.messages || res?.[1] || [];
  return messages;
}