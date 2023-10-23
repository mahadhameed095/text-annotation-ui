import fs from 'fs';
import csv from 'csv-parser';
import { createDocuments } from './service/Document.service';
import { DocumentWithoutId } from './schemas';

const inputFilePath = "sample.csv";
const data : DocumentWithoutId[] = []
fs.createReadStream(inputFilePath)
.pipe(csv())
.on('data', function(item : Record<string, any>){
    const transformed = {text : item.document, metadata : { source : 'reddit' }};        
    data.push(transformed);
})
.on('end',async function(){
    await createDocuments(data);
});  