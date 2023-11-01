import { z } from 'zod';
import Env from '../ENV';
import prismaClient from '../prisma';
import { AssignedAnnotation, User, ValueCounts, ValueCountsSchema, ValueCountsWithId, ValueCountsWithIdSchema } from '../schemas';
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

export async function getAssignedAnnotations(annotatorId : number, take ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { equals : Prisma.AnyNull },
            annotatorId
        },
        select : {
            id : true,
            assignmentTimestamp : true,
            document : true
        },
        take
    });
    return assigned;
}

export async function getPastAnnotated(annotatorId : number, take ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { not : Prisma.AnyNull },
            annotatorId
        },
        select : {
            id : true,
            annotationTimestamp : true,
            value : true,
            document : true
        },
        take,
        orderBy : { annotationTimestamp : 'desc'}
    });
    return assigned;
}

export async function getCounts(annotatorId : number){
    const q = Prisma.sql`
        SELECT
            SUM(CASE WHEN "value" != 'null' AND "value" IS NOT NULL THEN 1 ELSE 0 END) AS total,
            SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
            SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
            SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
            SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
        FROM "Annotation"
        WHERE "annotatorId" = ${annotatorId};
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsSchema.parse((await prismaClient.$queryRaw<ValueCounts[]>(q))[0]);
}

export async function getCountsAllAnnotators(){
    const q = Prisma.sql`
    SELECT
    	U."id",
        SUM(CASE WHEN "value" != 'null' AND "value" IS NOT NULL THEN 1 ELSE 0 END) AS total,
        SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
        SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
        SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
        SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
    FROM "User" U LEFT JOIN "Annotation" A on U."id" = A."annotatorId"
    GROUP BY U."id";
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsWithIdSchema.array().parse((await prismaClient.$queryRaw<ValueCountsWithId[]>(q)));
}

export async function getTotalCounts(){
    const q = Prisma.sql`
        SELECT
            (SELECT COUNT(*) FROM "Document") AS total,
            SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
            SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
            SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
            SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
        FROM "Annotation";
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsSchema.parse((await prismaClient.$queryRaw<ValueCounts[]>(q))[0]);
}

export async function getAnnotatedCountOverTime(annotatorId : number, days : number){
    const q = Prisma.sql`
        SELECT
            date_trunc('day', "annotationTimestamp") AS day,
            COUNT(*) AS count
        FROM "Annotation"
        WHERE "annotatorId" = ${annotatorId}
            AND "annotationTimestamp" >= CURRENT_TIMESTAMP - INTERVAL '1 days' * ${days}
        GROUP BY day
        ORDER BY day;
    `;
    const results = await prismaClient.$queryRaw<{day : string, count : BigInt}[]>(q);
    return z.object({ 
        day : z.coerce.string(),
        count : z.coerce.number()
    }).array().parse(results);
}