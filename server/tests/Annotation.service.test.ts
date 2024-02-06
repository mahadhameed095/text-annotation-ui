import Env from '../ENV';
import Contracts from '../contracts';
import prismaClient from '../prisma';
import { AnnotationService } from '../service';
import z from 'zod';
import { Prisma } from '@prisma/client';

const AnnotationContract = Contracts.annotation;
const annotatorId = "6S6dh8JRJraLdNC6pxg8wr8Desm2";

describe("Annotation Reservation", () => {
    
    const schema = AnnotationContract.reserveAnnotation.responses[200];
    let result : z.infer<typeof schema>;

    beforeAll(async () => {
        result = await AnnotationService.reserveAnnotations(annotatorId); 
    });
    
    it("should return the correct information", () => {
        expect(schema.safeParse(result).success).toBe(true);
    });
    
    it("the returned ids should all correspond to annotations that are reserved for this annotator", async () => {
        const ids = result.map(item => item.id);
        for(const item of result){
            
            const q = await prismaClient.annotation.findMany({ 
                where : { id : { in : ids}},
                select : { annotatorId : true
            }});

            expect(q.every(item => item.annotatorId && item.annotatorId === annotatorId)).toBe(true);
        }
    });

    it(`should reserve ${Env.MAX_RESERVATIONS} annotations at a time`, () => {
        expect(result.length).toBe(Env.MAX_RESERVATIONS);
    });

    // it("should reserve less than 10 annotations when free annotations < 10 ", () => {

    // });

    // it("make sure that the assigned annotations have not been taken from already assigned annotators(unlesss their time is up)" () => {

    // });
});



describe("Annotation Submission", () => {
    let annotationId : number;
    beforeAll(async () => {
        annotationId = (await AnnotationService.getAssignedAnnotations(annotatorId, 1))[0].id;
    });
    it("should be able to submit correct annotation", async () => {
        const value = { hateful : true, islamic : true } as const;
        await AnnotationService.submitAnnotation(annotationId, annotatorId, value);
        
        const result = await prismaClient.annotation.findFirst( { 
            where :  { id : annotationId },
            select : { value : true } 
        });

        expect(value).toStrictEqual(result?.value); //because object comparison is weird in js
    });
    
    // it("shouldnt be able to submit for someones else's assignment", async () => {});
    
    // it("should generate correct timestamp for the submission", () => {

    // });
});

describe("Get Assigned Annotations for an annotator", () => {
    const schema = AnnotationContract.getAssignedAnnotations.responses[200];
    let results : z.infer<typeof schema>;
    let annotationIds : number[];
    
    beforeAll(async () => {
        results = await AnnotationService.getAssignedAnnotations(annotatorId);
        annotationIds = results.map(item => item.id)
    });
    
    it("should return correct data for specified annotator", async () => {
        expect(schema.safeParse(results).success).toBe(true);
    });

    it("should all belong to the annotator", async () => {
        const entries = await prismaClient.annotation.findMany({ 
            where  : { id : { in : annotationIds }},
            select : { annotatorId : true }
        });

        expect(entries.every(e => e.annotatorId === annotatorId)).toBe(true);
    });


    it("entries should have null annotation values", async () => {
        const entries = await prismaClient.annotation.findMany({ 
            where  : { id : { in : annotationIds }},
            select : { value : true }
        });
        expect(entries.every(e => e.value === null)).toBe(true);
    })
});


describe("Get past annotated entries of an annotator", () => {
    const schema = AnnotationContract.getPastAnnotations.responses[200];
    let results : z.infer<typeof schema>;
    let annotationIds : number[];

    beforeAll(async () => {
        results = await AnnotationService.getPastAnnotated(annotatorId) as any;
        annotationIds = results.map(item => item.id)
    });

    it("should return correct data", () => {
        expect(schema.safeParse(results).success).toBe(true);
    });

    it("should all belong to this annotator", async () => {
        const entries = await prismaClient.annotation.findMany({ 
            where  : { id : { in : annotationIds }},
            select : { annotatorId : true }
        });
        expect(entries.every(e => e.annotatorId === annotatorId)).toBe(true);
    });
});

describe("Get annotation counts breakdown for a particular annotator", () => {
    const schema = AnnotationContract.getCountsAll.responses[200];
    let results : z.infer<typeof schema>;

    beforeAll(async () => {
        results = await AnnotationService.getCounts(annotatorId);
    });

    it("should return correct data", () => {
        expect(schema.safeParse(results).success).toBe(true);
    });

    it("the sums should be correct", async () => {
        const count = await prismaClient.annotation.count({ where : {
            value : { not : Prisma.JsonNull },
            annotatorId
        }});

        expect(count).toBe(results.total);
        const { hateful, non_hateful, islamic, non_islamic, total } = results;
        expect(hateful + non_hateful).toBe(total);
        expect(islamic + non_islamic).toBe(total);
    });
});

describe("Get counts breakdown overall", () => {
    const schema = AnnotationContract.getCountsAllAnnotators.responses[200];
    let results : z.infer<typeof schema>;

    beforeAll(async () => {
        results = await AnnotationService.getCountsAllAnnotators();
    });

    it("should return correct data", () => {
        expect(schema.safeParse(results).success).toBe(true);
    });

    it("the sums should be correct",  () => {
        for(const item of results){
            const { hateful, total, non_hateful, islamic, non_islamic } = item;
            expect(hateful + non_hateful).toBe(total);
            expect(islamic + non_islamic).toBe(total);
        }
    });
});


describe("Get annotation counts total", () => {
    const schema = AnnotationContract.getTotalCount.responses[200];
    let results : z.infer<typeof schema>;

    beforeAll(async () => {
        results = await AnnotationService.getTotalCounts();
    });

    it("should return correct data", () => {
        expect(schema.safeParse(results).success).toBe(true);
    });

    it("the sums should be correct", async () => {
        const count = await prismaClient.annotation.count({ where : {
            value : { not : Prisma.JsonNull }
        }});

        const { hateful, non_hateful, islamic, non_islamic } = results;
        expect(hateful + non_hateful).toBe(count);
        expect(islamic + non_islamic).toBe(count);
    });
});

describe("Get Annotated Count over time", () => {
    const schema = AnnotationContract.getAnnotatedCountOverTime.responses[200];
    let results : z.infer<typeof schema>;

    beforeAll(async () => {
        results = await AnnotationService.getAnnotatedCountOverTime(annotatorId, 7);
    });

    it("should return correct data", () => {
        expect(schema.safeParse(results).success).toBe(true);
    });
});

describe("Skipping annotations", () => {
    let annotationId : number;
    beforeAll(async () => {
        annotationId = (await AnnotationService.getAssignedAnnotations(annotatorId, 1))[0].id;
    });

    it("should no longer be reserved by user", async () => {
        await AnnotationService.skipAnnotation(annotationId, annotatorId);
        const item = await prismaClient.annotation.findFirst({
            where : { id : annotationId },
            select : { annotatorId : true, assignmentTimestamp : true}});

        expect(item?.annotatorId).toBe(null);
        expect(item?.assignmentTimestamp).toBe(null);
    });

});