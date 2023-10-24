import prismaClient from "../prisma";

async function deleteAll(){
    await prismaClient.annotation.deleteMany({});
    await prismaClient.document.deleteMany({});
    await prismaClient.user.deleteMany({});
}

deleteAll()
.then(() => {
    console.log('----------------------WIPED THE TABLE----------------------');
});