import { z } from 'zod';
import Env from '../ENV';
import prismaClient from '../prisma';
import { Annotation, AssignedAnnotation, ConflictingDocument, User, ValueCounts, ValueCountsSchema, ValueCountsWithId, ValueCountsWithIdSchema } from '../schemas';
import { Prisma } from '@prisma/client';
import Contracts from '../contracts';

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
        WITH FreeDocuments AS (
            SELECT DISTINCT ON ("documentId") *
            FROM "Annotation"
            WHERE 
              "value" = 'null'
              AND "documentId" NOT IN (
                SELECT "documentId" FROM "Annotation" WHERE "annotatorId" = ${annotatorId}
              )
              AND (
                "annotatorId" IS NULL OR
                "assignmentTimestamp" IS NULL OR
                CURRENT_TIMESTAMP - "assignmentTimestamp" >= INTERVAL '${Env.RESERVATION_EXPIRY_IN_HOURS} hours'
              )
          ),
          RandomlySelected AS (
            SELECT * FROM FreeDocuments
            ORDER BY RANDOM()
            LIMIT ${Env.MAX_RESERVATIONS}
          )
          UPDATE "Annotation" AS a
            SET 
              "annotatorId" = ${annotatorId},
              "assignmentTimestamp" = CURRENT_TIMESTAMP
            WHERE
              a."id" in (SELECT "id" FROM RandomlySelected)
          
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

export async function getAssignedAnnotations(annotatorId : string, take ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { equals : Prisma.JsonNull },
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

export async function getPastAnnotated(annotatorId : string, take ?: number){
    const assigned = await prismaClient.annotation.findMany({
        where : {
            value : { not : Prisma.JsonNull },
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

export async function getCounts(annotatorId : string){
    const q = Prisma.sql`
        SELECT
            SUM(CASE WHEN "value" != 'null' THEN 1 ELSE 0 END) AS total,
            SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
            SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
            SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
            SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
        FROM "Annotation"
        WHERE "annotatorId" = ${annotatorId};
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsSchema
            .parse((await prismaClient.$queryRaw<ValueCounts[]>(q))[0]);
}

export async function getCountsAllAnnotators(){
    const q = Prisma.sql`
    SELECT
    	U."id",
        SUM(CASE WHEN "value" != 'null' THEN 1 ELSE 0 END) AS total,
        SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
        SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
        SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
        SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
    FROM "User" U LEFT JOIN "Annotation" A on U."id" = A."annotatorId"
    GROUP BY U."id";
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsWithIdSchema
            .array()
            .parse((await prismaClient.$queryRaw<ValueCountsWithId[]>(q)));
}

export async function getTotalCounts(){
    const q = Prisma.sql`
        SELECT
            (SELECT COUNT(*) FROM "Annotation") AS total,
            SUM(CASE WHEN "value"->>'hateful' = 'true'  THEN 1 ELSE 0 END) AS hateful,
            SUM(CASE WHEN "value"->>'hateful' = 'false' THEN 1 ELSE 0 END) AS non_hateful,
            SUM(CASE WHEN "value"->>'islamic' = 'true'  THEN 1 ELSE 0 END) AS islamic,
            SUM(CASE WHEN "value"->>'islamic' = 'false' THEN 1 ELSE 0 END) AS non_islamic
        FROM "Annotation";
    `;

    /* The parsing is necessary as it will convert the bigints to regular numbers */
    return ValueCountsSchema.parse((await prismaClient.$queryRaw<ValueCounts[]>(q))[0]);
}

export async function getAnnotatedCountOverTime(annotatorId : string, days : number){
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
    const results = await prismaClient.$queryRaw(q);
    return Contracts.annotation.getAnnotatedCountOverTime.responses[200].parse(results);
}

export async function getConflictingRows(){
    const sql = Prisma.sql`
    SELECT 
	    "documentId",
	    jsonb_agg(jsonb_build_object('annotationId', id, 'islamic', "value"->>'islamic')) AS conflicts
    FROM 
	    "Annotation"
    WHERE 
	    "value" != 'null'
    GROUP BY 
	    "documentId"
    HAVING
	    COUNT(DISTINCT "value"->>'islamic') > 1;`
    return await prismaClient.$queryRaw<ConflictingDocument[]>(sql);
}

export async function skipAnnotation(annotationId : Annotation['id'], annotatorId : User['id']){
    await prismaClient.annotation.update({ 
        where : { 
            id : annotationId,
            annotatorId,
            value : { equals : Prisma.JsonNull }
        },
        data : {
            annotatorId : null,
            assignmentTimestamp : null,
        }
    })
}