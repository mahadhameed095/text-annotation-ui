import { initContract } from "@ts-rest/core";
import { DocumentSchema, AnnotationSchema, AssignedAnnotationSchema, ValueCountsSchema, ValueSchema, ValueCountsWithIdSchema, ConflictingDocumentSchema } from "../schemas";
import { z } from "zod";
import { response } from "express";

const c = initContract();

const AnnotationContract = c.router({
    submitAnnotation:{
        method : 'POST',
        path : '/submitAnnotation',
        body: z.object({
                value : ValueSchema,
                id : z.number()
            }),
        responses:{
          200 : z.object({}),
        },
        summary : 'Submit an annotation for a document'        
    },
    reserveAnnotation: {
        method : 'POST',
        body : z.object({}),
        path : '/reserveAnnotation',
        responses:{
          200 : AssignedAnnotationSchema.array()
        },
        summary : 'Reserve documents for annotation.'
    },
    getAssignedAnnotations : {
      method : 'GET',
      query : z.object({
        take : z.coerce.number().optional()
      }),
      path : '/getAssignedAnnotations',
      responses:{
        200 : AssignedAnnotationSchema.array()
      },
      summary : 'Get reserved entries for a particular annotator.'
    },
    getPastAnnotations : {
      method : 'GET',
      query : z.object({
        take : z.coerce.number()
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
    },
    getCountsAll : {
      method : 'GET',
      path : '/getCounts',
      responses : {
        200 : ValueCountsSchema
      },
      summary : 'Get number of all annotated documents(and the breakdown of each label), for a specific annotator'
    },
    getAnnotatedCountOverTime : {
      method : 'GET',
      path : '/getAnnotatedCountOverTime',
      query : z.object({
        /**
         * number of days to take
         */
        take : z.coerce.number()
      }),
      responses : {
        200 : z.object({
          day : z.string().transform(val => new Date(val)),
          count : z.number()
        }).array()
      },
      summary : 'Get number of annotated documents grouped by last <take> days'
    },
    getCountsAllAnnotators : {
      method : 'GET',
      path : '/getCountsAllAnnotators',
      responses : {
        200 : ValueCountsWithIdSchema.array()
      },
      summary : 'Get number of all annotated documents(and the breakdown of each label), for all annotators (admin-only action)'
    },
    getTotalCount : {
      method : 'GET',
      path : '/getTotalCount',
      responses : {
        200 : ValueCountsSchema
      },
      summary : 'Get total number of hateful, and islamic documents annotated over all dataset'
    },
    getConflictingRows : {
      method : 'GET',
      path : '/conflicting',
      responses : {
        200 : ConflictingDocumentSchema.array()
      },
      summary : 'Get all documents with conflicts in their annotations(not all labels are same for the documents) (admin-only action)' 
    }
  },
  {
    pathPrefix : '/annotations',
    strictStatusCodes : true,
    baseHeaders : z.object({
        authorization : z.string()
    })
  },
  
);

export default AnnotationContract