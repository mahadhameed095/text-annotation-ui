import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserWithoutPasswordSchema } from '../schemas';
import Env from '../ENV';

export default function Auth(req : Request, res : Response, next : NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(400).json({ message : "unauthorized" });
    jwt.verify(token, Env.ACCESS_TOKEN_SECRET, (err : any, payload : any) => {
      if (err) return res.status(400).json({ message : "unauthorized" });
      req.user= UserWithoutPasswordSchema.parse(payload.user);
      next();
    });   
}