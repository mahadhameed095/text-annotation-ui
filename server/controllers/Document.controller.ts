import { initServer } from "@ts-rest/express";
import ApiContract from "../contracts";
import { DocumentService } from "../service";
import pako from 'pako';
import { z } from "zod";

const server = initServer();

const DocumentController = server.router(ApiContract.document, {
  add : {
    handler : async ({ body : { compressedResults } }) => {
      const deflatedBuffer = Uint8Array.from(atob(compressedResults), c => c.charCodeAt(0))
      const inflatedData = pako.inflate(deflatedBuffer, { to: 'string' });
      
      const documents = z.object({ text : z.string(), metadata : z.any().optional()})
                          .transform( obj => {
                            if(!obj.metadata) return { text : obj.text, metadata : null };
                            if(typeof obj.metadata! !== 'object') return { text : obj.text, metadata : { _ : obj.metadata } };
                            return obj;
                          })
                          .array()
                          .parse(JSON.parse(inflatedData));
                          
      const ids = await DocumentService.createDocuments(documents);
      return { status : 201, body : ids };
    }
  }
});

export default DocumentController;