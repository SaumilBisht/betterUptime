import express from "express"
import { prisma } from "db/client"
import { AuthInput } from "./types";
import jwt from "jsonwebtoken"

const app=express();
app.use(express.json());
app.post("/website",async(req,res)=>{

  if(!req.body.url)
  {
    res.status(401).json({})
    return
  }

  
  const website=await prisma.website.create({
    data:
    {
      url:req.body.url,
      timeAdded: new Date()
    }
  })

  res.json({
    id:website.id
  })
})

app.post("/status/:websiteId",(req,res)=>{

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