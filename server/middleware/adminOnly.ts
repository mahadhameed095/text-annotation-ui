import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../service/User.service';

export default async function AdminOnly(req : Request, res : Response, next : NextFunction){
    if(req.user.role !== "ADMIN")
        return res.status(400).send({ message : "This action is admin-only."}); //user role
    
    next(); // admin role
}