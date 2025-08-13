import express from "express"
import { prisma } from "db/client"
import { AuthInput, SignUpInput } from "./types";
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware";
import cors from "cors"

import crypto from "crypto"
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"
import {addMinutes} from "date-fns"

const app=express();
app.use(express.json());
app.use(cors());

app.post("/user/signup",async(req,res)=>{
  const data=SignUpInput.safeParse(req.body);
  if(!data.success)
  {
    return res.status(403).json({
      "message":"Invalid inputs"
    })
  }
  const {email}=req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });  

  if(existingUser && existingUser.confirmed)
  {
    return res.status(403).json({
      error:"Account already created"
    })
  }
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 10);

  await prisma.user.upsert({//create or update
    where: { email },
    update: 
    {
      verificationToken: hashedToken,
      tokenExpiry: addMinutes(new Date(), 30),
    },
    create: {
      email,
      verificationToken: hashedToken,
      tokenExpiry: addMinutes(new Date(), 30),
    },
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,  
    },
  });
  
  const verifyUrl = `${process.env.BACKEND_URL}/verify?token=${token}&email=${email}`;
  
  await transporter.sendMail({
    to: email,
    subject: "Verify your BetterUptime account",
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. Link expires in 30 minutes.</p>`,
  });
  return res.json({
    message:"Verification Link sent successfully"
  })
  
})

app.get("/verify",async (req,res)=>{

  const {email,token}=req.query;
  if(!email || !token)
  {
    return res.status(400).send("Invalid verification link");
  }

  const user=await prisma.user.findUnique({
    where:{
      email:String(email)
    }
  }) 
  if(!user || !user.tokenExpiry || !user.verificationToken)
  {
    return res.status(400).json({
      error:"Invalid token"
    })
  }

  if (user.tokenExpiry < new Date()) {
    return res.status(400).send("Verification link expired");
  }

  const valid=await bcrypt.compare(String(token),user.verificationToken)
  if(!valid)return res.status(400).json({error:"Invalid verification link"})

  await prisma.user.update({
    where:{
      email:String(email)
    },
    data:{
      confirmed :true,
      tokenExpiry:null,
      verificationToken:null
    }
  })

  res.redirect(`${process.env.FRONTEND_URL}/set-password?email=${email}`)
})
app.post("/user/set-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.confirmed) {
    return res.status(400).json({ error: "User not found or not verified" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  const token = jwt.sign({ userId: user.id }, 
    process.env.JWT_PASS!, 
    { expiresIn: "1h" } // session lasts 1 hour
  );

  res.cookie("auth", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour in ms
  });

  return res.json({ message: "Password set successfully & cookie sent" });
});

app.post("/user/signin",async(req,res)=>{
  const data=AuthInput.safeParse(req.body);
  if(!data.success)
  {
    return res.status(403).json({
      message:"Invalid inputs"
    })
  }
  const {email,password}=req.body;
  const user= prisma.user.findUnique({
    where:{email}
  })
  if(!user || !user.confirmed || !user.password)return res.status(400).send("Invalid Credentials")

  const valid=await bcrypt.compare(password,user.password);

  if(!valid)return res.status(400).send("incorrect password")

  const token = jwt.sign({ userId: user.id }, 
      process.env.JWT_PASS!, 
    { expiresIn: "1h" } // session lasts 1 hour
  );

  res.cookie("auth", token, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour in ms
  });

})

app.post("/user/signout", (req, res) => {
  res.clearCookie("auth");
  return res.json({ message: "Signed out successfully" });
});

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
        take:10
      }

    }
  })

  if(!website) return res.status(409).send("No found website");

  return res.json({
    website
  })
})

app.get("/websites",authMiddleware,async(req,res)=>{
  const websites=await prisma.website.findMany({
    where:{
      userId:req.userId
    }
  })

  return res.json({
    websites
  })
})

app.listen(process.env.port || 3001)