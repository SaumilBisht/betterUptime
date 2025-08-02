import {createClient} from "redis"
import {prisma} from "db/client"

setInterval(main,3*60*1000)

async function main(){

  let websites:{url:string,id:string}[]=await prisma.website.findMany();

  const client=await createClient()
      .on("error",(err)=>console.log("redis error",err))
      .connect();

  for(const website of websites)
  {
    const res=await client.xAdd('betteruptime:websites','*',{
      url:website.url,
      id:website.id
    })
    console.log(res);
  }
  client.quit();
}