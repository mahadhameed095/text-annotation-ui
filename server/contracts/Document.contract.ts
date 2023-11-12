import { initContract } from "@ts-rest/core";
import { DocumentSchema } from "../schemas";
import { z } from "zod";

const c = initContract();

const DocumentContract = c.router({
    add: {
        method : 'POST',
        path : '/addDocument',
        responses:{
          201 : DocumentSchema.shape.id.array(),
        },
        body: z.object({ compressedResults : z.string() }),
        summary : 'Add a document (admin-only access)'
    },
},{
    pathPrefix : '/documents',
    strictStatusCodes : true,
    baseHeaders : z.object({
        authorization : z.string()
    })
});

export default DocumentContract;