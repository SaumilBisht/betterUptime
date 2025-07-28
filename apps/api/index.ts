import express from "express"
import {prisma} from "db/client"
const app=express();
app.use(express.json());
app.post("/website",async(req,res)=>{

  if(!req.body.url)
  {
    res.status(401).json({})
    return
  }
  const website=await prisma.website.create({
    data:{
      url:      req.body.url,
      timeAdded: new Date()
    }
  })

  res.json({
    id:website.id
  })
})

app.post("/status/:websiteId",()=>{

})

app.listen(process.env.port || 3001)