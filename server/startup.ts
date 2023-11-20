import prismaClient from "./prisma";
import { createAdmin, getUserById } from "./service/User.service";

const uids = [
    "6S6dh8JRJraLdNC6pxg8wr8Desm2", //mahad
    "SM78hkQxsqT3JYWW16faV1IV4642", //raahim
    "VlqWoer8jvZ9XRcYEMfEfrblup03", //ahmed
]

prismaClient.$transaction( async tx => {
    for(const uid of uids){
        const user = await getUserById(uid);
        if(!user){
            await createAdmin(uid);
        }
    }
}).then(() => console.log("---------------start up script executed------------------"));