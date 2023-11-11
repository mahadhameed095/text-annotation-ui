import { initServer } from "@ts-rest/express";
import { DocumentContract } from "../contracts";
import { DocumentService } from "../service";
import { DocumentSchema } from "../schemas";
import pako from 'pako';

const server = initServer();

const DocumentController = server.router(DocumentContract, {
  add : {
    handler : async ({ body : { compressedResults } }) => {
      const deflatedBuffer = Uint8Array.from(atob(compressedResults), c => c.charCodeAt(0))
      const inflatedData = pako.inflate(deflatedBuffer, { to: 'string' });
      const documents = DocumentSchema
                          .pick({ text : true, metadata : true})
                          .array()
                          .parse(JSON.parse(inflatedData));

      const ids = await DocumentService.createDocuments(documents);
      return { status : 201, body : ids };
    }
  }
});

export default DocumentController;