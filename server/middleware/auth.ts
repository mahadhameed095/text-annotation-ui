import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebaseAuth';
import { getUserById } from '../service/User.service';

export default async function Auth(req : Request, res : Response, next : NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(400).json({ message : "unauthorized" });
    try{
      const { phone_number, email, name, uid, picture} = await auth.verifyIdToken(token);
      const dbUser = await getUserById(uid);
      if(!dbUser) throw Error;
      req.user = {phone_number, email, name, profile : picture, ...dbUser};
      next();
    }
    catch {
      return res.status(400).json({ message : "unauthorized" })
    }
}