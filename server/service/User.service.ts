import prismaClient from '../prisma';
import { User } from '../schemas';

export async function createUser(name : string, email : string, password : string) : Promise<User> {
    const user = await prismaClient.user.create({data : {name, email, password}});
    return user;
}

export async function getUserByEmail(email : string) : Promise<User | null> {
    const user = await prismaClient.user.findFirst({ where : { email }});
    return user;
}
