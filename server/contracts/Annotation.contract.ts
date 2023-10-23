import { initContract } from "@ts-rest/core";
import { AnnotationSchema, DocumentSchema,AssignedAnnotationSchema } from "../schemas";
import { z } from "zod";

const c = initContract();

const AnnotationContract = c.router({
    submitAnnotation:{
        method : 'POST',
        path : '/submitAnnotation',
        body: z.object({
                value : z.record(z.string(), z.any()),
                id : z.number()
            }),
        responses:{
          200 : z.object({}),
        },
        summary : 'Submit an annotation for a document'        
    },
    reserveAnnotation: {
        method : 'GET',
        path : '/reserveAnnotation',
        responses:{
          200 : AssignedAnnotationSchema.array()
        },
        summary : 'Reserve documents for annotation.'
    },
    getAssignedAnnotations : {
      method : 'POST',
      body : z.object({
        limit : z.number().int()
      }),
      path : '/getAssignedAnnotations',
      responses:{
        200 : AssignedAnnotationSchema.array()
      },
      summary : 'Get reserved entries for a particular annotator.'
    },
    getPastAnnotations : {
      method : 'POST',
      body : z.object({
        limit : z.number().int()
      }),
      path : '/getPastAnnotations',
      responses : {
        200 : AnnotationSchema.pick({
          id : true,
          value : true,
          annotationTimestamp : true
        }).extend({
          document : DocumentSchema
        }).array()
      },
      summary : 'Get past annotated entries for a particular annotator.'
    }
  },
  {
    strictStatusCodes : true,
    baseHeaders : z.object({
        authorization : z.string()
    })
  }
);

export default AnnotationContract