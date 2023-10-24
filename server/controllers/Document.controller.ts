import { initServer } from "@ts-rest/express";
import { DocumentContract } from "../contracts";
import { DocumentService } from "../service";

const server = initServer();

const DocumentController = server.router(DocumentContract, {
  add : async ({ body : documents }) => {
    if(documents.length > 15000)
      return { status : 400, body : { message : 'Maximum of 15000 documents can be inserted at a time.'}};
    const ids = await DocumentService.createDocuments(documents);
    return { status : 201, body : ids };
  }
});

export default DocumentController;