import prismaClient from '../prisma';
import { DBUser } from '../schemas';


export async function createUser(id : string) : Promise<DBUser> {
    const result = await prismaClient.user.create({ data : { id }});
    return result;
}

export async function getUserById(id : string) : Promise<DBUser | null> {
    const user = await prismaClient.user.findFirst({ where : { id }});
    return user;
}

export async function approveUser(id : string){
    await prismaClient.user.update({ where : { id }, data : { approved : true }})
}

export async function getAllUsers(ids : string[]){
    const users = await prismaClient.user.findMany({ 
        where : { id : { in : ids }}
    });
    return users;
}