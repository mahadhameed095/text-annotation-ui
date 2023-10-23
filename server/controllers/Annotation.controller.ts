import { initServer } from "@ts-rest/express";
import { AnnotationContract } from "../contracts";
import { AnnotationService } from "../service";
import { ValueCountsSchema } from "../schemas";

const server = initServer();
const DocumentController = server.router(AnnotationContract, {
    submitAnnotation : async ({ body : { value, id }, req : { user }}) => {
        await AnnotationService.submitAnnotation(id, user.id, value);
        return { status : 200, body : {} };
    },
    reserveAnnotation : async({  req : { user } }) => {
        const assigned = await AnnotationService.reserveAnnotations(user.id);
        return { status : 200, body : assigned as any };
    },
    getPastAnnotations : async ({ query : { take }, req : { user }}) => {
        const annotations = await AnnotationService.getPastAnnotated(user.id, take);
        return { status : 200, body : annotations as any }
    },
    getAssignedAnnotations : async ({ query : { take }, req : { user }}) => {
        const assigned = await AnnotationService.getAssignedAnnotations(user.id, take)
        return { status : 200, body : assigned as any };
    },
    getCountsAll : async ({ req : { user }}) => {
        const counts = await AnnotationService.getCounts(user.id);
        /* Postgres returns BigInts which ts-rest doesnt agree with */
        return { status : 200, body : ValueCountsSchema.parse(counts) };
    },
    getAnnotatedCountOverTime : async ({ query : { take }, req : { user } }) => {
        const results = await AnnotationService.getAnnotatedCountOverTime(user.id, take);
        /* Postgres returns BigInts which ts-rest doesnt agree with */
        return { status : 200, body : results.map(row => ({ day : row.day, count : Number(row.count)})) };
    }
});

export default DocumentController;