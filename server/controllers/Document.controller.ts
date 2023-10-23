import { initServer } from "@ts-rest/express";
import { DocumentContract } from "../contracts";
import { DocumentService } from "../service";

const server = initServer();

const DocumentController = server.router(DocumentContract, {
  add : async ({ body : documents }) => {
    const ids = await DocumentService.createDocuments(documents);
    return { status : 201, body : ids };
  }
});

export default DocumentController;