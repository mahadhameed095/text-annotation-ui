import { Prisma } from '@prisma/client';
import prismaClient from '../prisma';
import { Document } from '../schemas';
import { duplicateArray } from '../utils';
import Env from '../ENV';
/**
 * 
 * @param documents 
 * @returns 
 */
export async function createDocuments(documents : Omit<Document, 'id'>[]) : Promise<Document['id'][]> {
    return await prismaClient.$transaction(async (tx) => {
        const chunk_size = 5000;
        const num_chunks = Math.ceil(documents.length / chunk_size);
        const ids : number[] = []
        for(let i = 0 ; i < num_chunks ; i++){
            /**
             * Prisma's createMany function does not return the objects created. Because of that we dont know what ids are created. This is prisma's limitation.
            */
            const chunk = documents.slice(i * chunk_size, (i + 1) * chunk_size);
            const q = Prisma.sql`
                INSERT INTO "Document" 
                    ("text", "metadata")
                VALUES ${Prisma.join(
                chunk.map(doc => Prisma.sql`(${Prisma.join([doc.text, doc.metadata])})`)
                )}
                RETURNING "id"
            `;
            const insertedDocs = await prismaClient.$queryRaw<{id : number}[]>(q); 
            const insertedDocsIds = insertedDocs.map(doc => doc.id);
            await tx.annotation.createMany({
                data : duplicateArray(insertedDocsIds.map(id => ({ documentId : id })), Env.NUM_ANNOTATIONS_PER_DOCUMENT)
            });
            ids.push(...insertedDocsIds);
        }
        return ids;
        /* 10minutes */
    }, { 
        timeout : 600000, 
        isolationLevel : 'ReadCommitted'
    });
}

