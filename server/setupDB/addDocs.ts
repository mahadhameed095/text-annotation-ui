import { faker } from "@faker-js/faker";
import { DocumentWithoutId } from "../schemas";
import { createDocuments } from "../service/Document.service";

export default function generateRandomDocs(num : number){
    const documents : DocumentWithoutId[] = [];
    for(let i = 0 ; i < num ; i++){
        documents.push({
            text : faker.lorem.paragraphs({ min : 1, max : 5}),
            metadata : { source : 'reddit'}
        })
    }
    return documents;
}

async function main(){
    const docs = generateRandomDocs(30000);
    await createDocuments(docs.slice(0, 15000));
    await createDocuments(docs.slice(15000));
}
main().then(() => console.log('-----------------------Added 30000 documents----------------------'))