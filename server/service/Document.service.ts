import { Prisma } from '@prisma/client';
import prismaClient from '../prisma';
import { Document } from '../schemas';
import { duplicateArray } from '../utils';
/**
 * 
 * @param documents 
 * @returns 
 * WARNING: A maximum of 15k docs can be inserted at a time. Call it repeatedly for more.
 */
export async function createDocuments(documents : Omit<Document, 'id'>[]) : Promise<Document['id'][]> {
    if(documents.length > 15000) throw Error('Maximum of 15000 documents can be inserted at a time.');
    return await prismaClient.$transaction(async (tx) => {
        /**
         * Prisma's createMany function does not return the objects created. Because of that we dont know what ids are created. This is prisma's limitation.
         */
        const q =Prisma.sql`
            INSERT INTO "Document" 
                ("text", "metadata")
            VALUES ${Prisma.join(
            documents.map(doc => Prisma.sql`(${Prisma.join([doc.text, doc.metadata])})`)
            )}
            RETURNING "id"
        `;
        const insertedDocs = await prismaClient.$queryRaw<{id : number}[]>(q); 
        const insertedDocsIds = insertedDocs.map(doc => doc.id);
        /* For each returned id, we are inserting n entries against it in the annotations table */
        await tx.annotation.createMany({
            data : duplicateArray(insertedDocsIds.map(id => ({ documentId : id })), 3)
        });
        
        /* return the array of ids created in the Document table */
        return insertedDocsIds;
    });
}

