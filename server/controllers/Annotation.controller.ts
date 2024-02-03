import { initServer } from "@ts-rest/express";
import ApiContract from "../contracts";
import { AnnotationService } from "../service";
import { AdminOnly } from "../middleware";

const server = initServer();
const AnnotationController = server.router(ApiContract.annotation, {
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
        return { status : 200, body : counts };
    },
    getAnnotatedCountOverTime : async ({ query : { take }, req : { user } }) => {
        const results = await AnnotationService.getAnnotatedCountOverTime(user.id, take);
        /* Postgres returns BigInts which ts-rest doesnt agree with */
        return { status : 200, body : results };
    },
    getCountsAllAnnotators :{
        middleware : [AdminOnly],
        handler : async() => { 
            const results = await AnnotationService.getCountsAllAnnotators();
            return { status : 200, body : results};
        }
    },
    getTotalCount : async () => {
        const results = await AnnotationService.getTotalCounts();
        return { status : 200, body: results };
    },
    getConflictingRows : {
        middleware : [AdminOnly],
        handler : async () => {
            return { 
                status : 200,
                body : await AnnotationService.getConflictingRows()
            };
        }
    },
    skipAnnotation : async ({ body : { id }, req : { user }}) => {
        AnnotationService.skipAnnotation(id, user.id);
        return { status : 200, body : {}}
    }
});

export default AnnotationController;