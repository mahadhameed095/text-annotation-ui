import { initServer } from "@ts-rest/express";
import { DocumentContract } from "../contracts";
import { DocumentService } from "../service";
import multer from "multer";
import { parseCSVBufferToArray } from "../utils";
import { DocumentSchema } from "../schemas";

const server = initServer();
const storage = multer({ 
  limits : { 
    fileSize : 100 * 1024 * 1024
  }
});

const DocumentController = server.router(DocumentContract, {
  add : {
    middleware : [storage.single('file')],
    handler : async ({ req }) => {
      const file = req.file!;
      const documents = DocumentSchema
        .pick({ text : true, metadata : true}).array()
        .parse(await parseCSVBufferToArray(file.buffer));
      console.log(documents.length);
      // const ids = await DocumentService.createDocuments(documents);
      return { status : 201, body : [] };
    }
  }
});

export default DocumentController;