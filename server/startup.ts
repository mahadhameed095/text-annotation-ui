import prismaClient from "./prisma";
import { createAdmin, getUserById } from "./service/User.service";

const uids = [
    "6S6dh8JRJraLdNC6pxg8wr8Desm2", //mahad
    "SM78hkQxsqT3JYWW16faV1IV4642", //raahim
    "VlqWoer8jvZ9XRcYEMfEfrblup03", //ahmed
]

const admin = { approved : true, role : "ADMIN" } as const;

prismaClient.$transaction(
    uids.map(id => prismaClient.user.upsert({
        where : { id },
        create : { id, ...admin},
        update : admin,
    }))
).then(() => console.log("---------------start up script executed------------------"));