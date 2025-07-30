import express from "express"
import { prisma } from "db/client"
import { AuthInput } from "./types";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware";

const app=express();
app.use(express.json());
app.post("/website",authMiddleware,async(req,res)=>{

  if(!req.body.url)
  {
    res.status(401).json({})
    return
  }

  
  const website=await prisma.website.create({
    data:
    {
      userId:req.userId!,
      url:req.body.url,
      timeAdded: new Date()
    }
  })

  res.json({
    id:website.id
  })
})

app.post("/status/:websiteId",authMiddleware,async(req,res)=>{

  const website=await prisma.website.findFirst({
    where:{
      id:req.params.websiteId,
      userId:req.userId
    },
    include:{
      ticks:{
        orderBy:[{
          createdAt:"desc"
        }],
        take:1
      }

    }
  })

  if(!website) return res.status(409).send("No found website");

  return res.json({
    website
  })
})

app.post("/user/signup",async(req,res)=>{
  const data=AuthInput.safeParse(req.body);
  if(!data.success)
  {
    return res.status(403).json({
      "message":"Invalid inputs"
    })
  }
  let user;
  try{
    user=await prisma.user.create({
      data:{
        username:data.data.username,
        password:data.data.password
      }
    })
  }
  catch(c)
  {
    return res.status(403).send("Db mein kuch dikkat")
  }
  res.json({
    id: user.id
  })
})
app.post("/user/signin",async(req,res)=>{
  const data=AuthInput.safeParse(req.body);
  if(!data.success)
  {
    return res.status(403).json({
      message:"Invalid inputs"
    })
  }

  let user=await prisma.user.findFirst({
    where:{
      username:data.data.username
    }
  })

  if(user!.password!=data.data.password)
  {
    return res.status(403).send("wrong pass");
  }
  const jwtToken=jwt.sign({
    sub:user!.id
  },process.env.JWT_PASS!)

  return res.json({
    token: jwtToken
  })

})

app.listen(process.env.port || 3001)