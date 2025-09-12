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
import cookieParser from "cookie-parser";
const app=express();
app.use(cookieParser())
app.use(express.json());

app.use(cors({
  origin: "https://uptimewatch.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.post("/user/signup",async(req,res)=>{
  const data=SignUpInput.safeParse(req.body);
  if(!data.success)
  {
    return res.status(403).json({
      error:"Invalid inputs"
    })
  }
  console.log("Signup request received", req.body);
  const {email}=req.body;
  try{
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
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });
    console.log("reached 3")
    console.log(process.env.USER_EMAIL)
    
    const verifyUrl = `${process.env.BACKEND_URL}/verify?token=${token}&email=${email}`;
    
    await transporter.sendMail({
      to: email,
      subject: "Verify your BetterUptime account",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. Link expires in 30 minutes.</p>`,
    });
    console.log("reached 4")
  }
  catch(e){
    console.error("Email send error:", e);
    return res.status(403).json({
      error:"An unexpected error occured"
    })
  }
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
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.confirmed) {
      return res.status(403).json({ error: "User not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_PASS!, { expiresIn: "1h" });
    res.cookie("auth", token, { 
      httpOnly: true, 
      secure: false,       //true in prod
      sameSite: "lax",    //none in prod
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Error in set-password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/user/signin", async (req, res) => {
  const data = AuthInput.safeParse(req.body);
  if (!data.success) {
    return res.status(403).json({ error: "Invalid inputs" });
  }

  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.confirmed || !user.password) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_PASS!, { expiresIn: "1h" });
  
  res.cookie("auth", token, { 
    httpOnly: true, 
    secure: false,       //true in prod
    sameSite: "lax",    //none in prod
    maxAge: 60 * 60 * 1000,
  });

  return res.status(200).json({ message: "Signin successful" });
});

app.post("/user/signout", (req, res) => {
  res.clearCookie("auth");
  return res.json({ message: "Signed out successfully" });
});

app.get("/auth/validate", authMiddleware, (req, res) => {
  return res.json({ valid: true, id: req.userId }); 
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

  const skip = req.body.skip || 0;

  const website=await prisma.website.findFirst({
    where:{
      id:req.params.websiteId,
      userId:req.userId
    },
    include:{
      ticks:{
        orderBy:[{createdAt:"desc"}],
        skip,
        take:10,
        include: { region: true } 
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
    },
    include:{
      ticks: {
        orderBy: { createdAt: "desc" },
        take: 10, // 10 liye from each website
        include: { region: true }
      }
    }
  })

  const formatted = websites.map(w => {
    const indiaTick = w.ticks.find(t => t.region.name === "india");
    const usTick = w.ticks.find(t => t.region.name === "usa");
    return {
      id: w.id,
      url: w.url,
      indiaStatus: indiaTick ? indiaTick.status : "Unknown",
      indiaResponse: indiaTick ? indiaTick.response_time_ms : 0,
      indiaChecked: indiaTick ? indiaTick.createdAt : null,
      usStatus: usTick ? usTick.status : "Unknown",
      usResponse: usTick ? usTick.response_time_ms : 0,
      usChecked: usTick ? usTick.createdAt : null
    };
  });

  return res.json({ websites: formatted });
})

app.delete('/website/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const website = await prisma.website.findUnique({
      where: { id },
    });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    await prisma.website.delete({
      where: { id },
    });

    return res.status(200).json({ success: true, message: 'Website deleted' });
  } catch (error) {
    console.error('Failed to delete website:', error);
    return res.status(500).json({ error: 'Failed to delete website' });
  }
});

app.listen(process.env.port || 3001)