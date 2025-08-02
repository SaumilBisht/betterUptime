import {createClient} from "redis"
import {prisma} from "db/client"
import axios from "axios";
main();

async function main()
{
  const client=await createClient()
      .on("error",(err)=>console.log("redis error",err))
      .connect();
  while(1)
  {
    const res=await client.xReadGroup('india','india-1',{
      key:"betteruptime:websites",
      id:">"
    },{
      COUNT:10
    })
    
    
    if(!res)return;
    //@ts-ignore
    let websites_to_track=res[0].messages;

    websites_to_track.forEach(async(website: { message: { url: string; id: string; }; })=>{
      let startTime=Date.now;

      await axios.get(website.message.url)
            .then(()=>{
              prisma.website_tick.create({

                //@ts-ignore
                status:"UP",
                //@ts-ignore
                response_time_ms: Date.now()-startTime,
                website_id:website.message.id,
                region_id:"india"
              })
            })
    })
    



  }

  client.destroy();
}