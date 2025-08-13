import type { NextFunction, Request ,Response} from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req:Request,res:Response,next:NextFunction){

  const token = req.cookies.auth;
  if (!token) return res.status(401).send("Not signed in");

  try 
  {
    const payload = jwt.verify(token, process.env.JWT_PASS!);//@ts-ignore
    req.userId = payload.userId as string; 
    next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
}

