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

export async function getAllUsers(skip ?: number, take ?: number){
    const users = await prismaClient.user.findMany({ 
        skip,
        take
    });
    return users;
}

export async function getAllApprovedUsers(skip ?: number, take ?: number){
    const users = await prismaClient.user.findMany({ 
        skip,
        take,
        where : { approved : true }
    });
    return users;
}

export async function getAllUnapprovedUsers(skip ?: number, take ?: number){
    const users = await prismaClient.user.findMany({ 
        skip,
        take,
        where : { approved : false }
    });
    return users;
}