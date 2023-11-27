import prismaClient from "./prisma";

export default async function startup(){
    const uids = [
        "6S6dh8JRJraLdNC6pxg8wr8Desm2", //mahad
        "SM78hkQxsqT3JYWW16faV1IV4642", //raahim
        "VlqWoer8jvZ9XRcYEMfEfrblup03", //ahmed
    ];
    const admin = { approved : true, role : "ADMIN" } as const;
    await prismaClient.$transaction(
        uids.map(id => prismaClient.user.upsert({
            where : { id },
            create : { id, ...admin},
            update : admin,
        }))
    );
}