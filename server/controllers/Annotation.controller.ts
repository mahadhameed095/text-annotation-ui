import { initServer } from "@ts-rest/express";
import { AnnotationContract } from "../contracts";
import { AnnotationService } from "../service";

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
    getPastAnnotations : async ({ body : { limit }, req : { user }}) => {
        const annotations = await AnnotationService.getPastAnnotated(user.id, limit);
        return { status : 200, body : annotations as any }
    },
    getAssignedAnnotations : async ({ body : { limit }, req : { user }}) => {
        const assigned = await AnnotationService.getAssignedAnnotations(user.id, limit)
        return { status : 200, body : assigned as any };
    }
});

export default DocumentController;