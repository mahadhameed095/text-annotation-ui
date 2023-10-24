import { faker } from "@faker-js/faker";
import { User } from "../schemas";
import { encrypt } from "../utils";
import prismaClient from "../prisma";


function generateRandomUsers(num : number) {
    const users : Omit<User, 'id'>[] = [
        {name : "mahad", email : "mahad@annotext.com", password : encrypt("mahad@annotext.com"), role : "ADMIN"},
        {name : "ahmed", email : "ahmed@annotext.com", password : encrypt("ahmed@annotext.com"), role : "ADMIN"},
        {name : "raahim", email : "raahim@annotext.com", password : encrypt("raahim@annotext.com"), role : "ADMIN"}
    ];
    for(let i = 0 ; i < num - 3 ; i++){
        const email = faker.internet.email()
        users.push({
            name : faker.person.fullName(),
            email,
            password : encrypt(email),
            role : "USER"  
        })
    }
    return users;
}

const users = generateRandomUsers(10);
prismaClient.user.createMany({ data : users })
    .then(result => console.log(`Added ${result.count} users.`));