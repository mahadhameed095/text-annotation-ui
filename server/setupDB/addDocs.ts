import { faker } from "@faker-js/faker";
import { DocumentWithoutId } from "../schemas";
import { createDocuments } from "../service/Document.service";
import fs from 'fs';
import csv from 'csv-parser';
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

function parseCSVToArray(csvFilePath : string) {
    return new Promise<any[]>((resolve, reject) => {
      const results : any[] = [];
  
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => {
          // 'data' represents a row in the CSV file
          results.push({ text : data.Document, metadata: { subreddit : data.subreddit }});
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
}



async function main(){
    const path = 'C:/Users/mahad/Downloads/To-be-Annotated-35000.csv';
    const data = await parseCSVToArray(path);
    const ids = await createDocuments(data);
    console.log(ids.length, 'documents added');
    // const docs = generateRandomDocs(30000);
    // await createDocuments(docs.slice(0, 15000));
    // await createDocuments(docs.slice(15000));
}
main().then(() => console.log('-----------------------Exited----------------------'))