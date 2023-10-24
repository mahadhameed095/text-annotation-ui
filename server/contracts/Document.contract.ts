import { initContract } from "@ts-rest/core";
import { DocumentSchema } from "../schemas";

const c = initContract();

const DocumentContract = c.router({
    add: {
        method : 'POST',
        path : '/addDocument',
        responses:{
          201 : DocumentSchema.shape.id.array(),
          400 : c.type<{ message : 'Maximum of 15000 documents can be inserted at a time.'}>()
        },
        body: DocumentSchema
                .pick({ text : true, metadata : true}).array(),
        summary : 'Add a document (admin-only access)'
    },
},{
    strictStatusCodes : true
});

export default DocumentContract;