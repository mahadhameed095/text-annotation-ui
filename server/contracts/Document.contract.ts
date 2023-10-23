import { initContract } from "@ts-rest/core";
import { DocumentSchema } from "../schemas";

const c = initContract();

const DocumentContract = c.router({
    add: {
        method : 'POST',
        path : '/addDocument',
        responses:{
          201 : DocumentSchema.shape.id.array(),
        },
        body: DocumentSchema
            .pick({ text : true, metadata : true}).array(),
        summary : 'Add a document (admin-only access)'
    },
});

export default DocumentContract;