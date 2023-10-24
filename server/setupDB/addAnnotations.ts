import { faker } from "@faker-js/faker";
import { getAllUsers } from "../service/User.service";
import prismaClient from "../prisma";

function generateRecord(userIds : number[]){
    const annotatorId = faker.helpers.arrayElement(userIds);
    const isAnnotated = faker.datatype.boolean();
    const assignmentTimestamp = faker.date.recent({ days : 30 });
    let annotationTimestamp = null;
    let value = null;
    if (isAnnotated) {
      annotationTimestamp = faker.date.between({
        from : assignmentTimestamp,
        to : new Date()
      });
      value = {
        hateful: faker.datatype.boolean(),
        islamic: faker.datatype.boolean(),
      };
    }
    return {
        annotatorId,
        assignmentTimestamp,
        annotationTimestamp,
        value,
      };
}

function partitionArray<T>(arr: T[], partitionSize: number): T[][] {
  const partitions: T[][] = [];
  for (let i = 0; i < arr.length; i += partitionSize) {
      const partition = arr.slice(i, i + partitionSize);
      partitions.push(partition);
  }
  return partitions;
}

async function main(){
    const userIds = (await getAllUsers()).map(user => user.id);
    const annots = (await prismaClient.annotation.findMany({ select : { id : true, documentId : true }}));
    const randomSubset = faker.helpers.arrayElements(annots, annots.length/2);
    const records : ({id : number, documentId : number } & ReturnType<typeof generateRecord>)[] 
      = randomSubset.map(({ id, documentId }) => ({...generateRecord(userIds), id, documentId}));

    await prismaClient.$transaction(records.map(r => prismaClient.annotation.update({
      where : { id : r.id },
      data : r as any
    })));    
}


main().then(() => console.log('--------------------------Added annotations--------------------------'));