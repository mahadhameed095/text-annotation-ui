import Env from '../ENV';
import prismaClient from '../prisma';
import { AssignedAnnotation, User } from '../schemas';
import { Annotation, Prisma } from '@prisma/client';

export async function submitAnnotation(
    annotationId : Annotation['id'],
    annotatorId : User['id'],
    value : Record<string, any>
)
{
    const sql = Prisma.sql`
        UPDATE "Annotation" 
            SET "value" = ${value},
                "annotationTimestamp" = CURRENT_TIMESTAMP
            WHERE
                "id" = ${annotationId} AND
                "annotatorId" = ${annotatorId}
    `;
    await prismaClient.$executeRaw(sql);
}

export async function reserveAnnotations(annotatorId : User['id']){
    return await prismaClient.$transaction(async (tx) => {
        const sql = Prisma.sql`
            UPDATE "Annotation" AS a
                SET "annotatorId" = ${annotatorId},
                "assignmentTimestamp" = CURRENT_TIMESTAMP
            FROM (
                SELECT DISTINCT ON ("documentId") "id"
                FROM "Annotation"
                WHERE 
                    "value" IS NULL
                    AND "documentId" NOT IN 
                        (SELECT "documentId" FROM "Annotation" WHERE "annotatorId" = ${annotatorId})
                    AND (
                        "annotatorId" IS NULL OR
                        "assignmentTimestamp" IS NULL OR
                        CURRENT_TIMESTAMP - "assignmentTimestamp" >= INTERVAL '${Env.RESERVATION_EXPIRY_IN_HOURS} hours'
                    )
                ORDER BY "documentId", RANDOM()
                LIMIT ${Env.MAX_RESERVATIONS}
            ) AS subquery
            WHERE a."id" = subquery."id"
            RETURNING a."id", a."assignmentTimestamp",(
                SELECT jsonb_build_object(
                    'id', d."id",
                    'text', d."text",
                    'metadata', d."metadata"
                )
                FROM "Document" AS d
                WHERE d."id" = a."documentId"
            ) AS document;`

        const assigned = await tx.$queryRaw<AssignedAnnotation[]>(sql);
        return assigned;
    }); 
}

export async function getAssignedAnnotations(annotatorId : number, limit ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { equals : Prisma.AnyNull},
            annotatorId
        },
        select : {
            id : true,
            assignmentTimestamp : true,
            document : true
        },
        take : limit
    });
    return assigned;
}

export async function getPastAnnotated(annotatorId : number, limit ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { not : Prisma.JsonNull},
            annotatorId
        },
        select : {
            id : true,
            annotationTimestamp : true,
            value : true,
            document : true
        },
        take : limit,
        orderBy : { annotationTimestamp : 'desc'}
    });
    return assigned;
}