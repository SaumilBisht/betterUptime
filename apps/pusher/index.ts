import {prisma} from "db/client"
import { xAddBulk } from "redisstream/client";

async function main(){

  let websites=await prisma.website.findMany({
    select:{
      url:true,
      id:true
    }
  });

  await xAddBulk(websites);
}

setInterval(()=>{
  main()
},3*60*1000)

main()