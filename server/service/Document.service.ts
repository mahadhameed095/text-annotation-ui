import prismaClient from '../prisma';
import { Document } from '../schemas';
import { duplicateArray } from '../utils';

export async function createDocuments(documents : Omit<Document, 'id'>[]) : Promise<Document['id'][]> {
    return await prismaClient.$transaction(async (tx) => {
        /**
         * Prisma's createMany function does not return the objects created. Because of that we dont know what ids are created. This is prisma's limitation.
         */
        const inserted_docs = await Promise.all(
            documents.map(doc => tx.document.create({ 
                data : doc,
            }))
        );
        
        const inserted_docs_ids = inserted_docs.map(doc => doc.id);
        /* For each returned id, we are inserting n entries against it in the annotations table */
        await tx.annotation.createMany({
            data : duplicateArray(inserted_docs_ids.map(id => ({ documentId : id })), 3)
        });
        
        /* return the array of ids created in the Document table */
        return inserted_docs_ids;
    });
}

