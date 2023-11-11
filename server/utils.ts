import { generateOpenApi } from '@ts-rest/open-api';
import csv from 'csv-parser';
import { Readable } from 'stream';


export function omit<T extends Record<string, any>, K extends keyof T>
(obj : T, key : K) : Omit<T, K>
{
    const {[key] : _, ...rest} = obj;
    return rest;
}

type Mask<T> = {
  [K in keyof T]?: boolean;
};
export function pick<T extends Record<any, any>, M extends Mask<T>>(obj : T, mask : M) : Pick<T, keyof M>{
  const result = Object.keys(mask).reduce((acc, curr) => {
    acc[curr] = obj[curr];
    return acc;
  }, {} as Record<any, any>);
  return result as any;
}

export function joinArrays<
  T extends Record<string, any>,
  U extends Record<string, any>, 
  K extends keyof T & keyof U>
(
  array1: T[],
  array2: U[],
  key: K
): (T & U)[] {
  const results = array1.map((item1) => {
    const matchingItem = array2.find((item2) => (item1[key] === item2[key] as boolean))!;
    const joined = { ...item1, ...matchingItem };
    return joined;
  });
  return results;
}


// export function removeKeysFromObject<T, M extends Mask<T>>(obj: T, mask : M): Omit<T, keyof M> {
//   const result: any = { ...obj };
//   Object.keys(mask).forEach((key) => {
//       if (mask[key as keyof T]) {
//           delete result[key];
//       }
//   });
//   return result;
// }

export function duplicateArray<T extends any[]>(arr : T, n : number) : T {
    return Array.from({ length: n }, () => arr).flat() as T;
}

// export function daysToMS(days : number){
//     return days * 86400000;
// }

export function patchOpenAPIDocument(openApiDocument : ReturnType<typeof generateOpenApi>){
    openApiDocument.components = openApiDocument.components || {};
    openApiDocument.components.securitySchemes = openApiDocument.components.securitySchemes || {};
    openApiDocument.components.securitySchemes.auth = {
      type : 'apiKey',
      in : 'header',
      name : 'authorization' 
    }
    openApiDocument.security = openApiDocument.security || [];
    openApiDocument.security.push({
      auth : []
    });
    
    Object.entries(openApiDocument.paths).map(([endpoint, methods]) => {
      Object.entries(methods).map(([method, implementation] : [method : any, implementation : any]) => {
        implementation.parameters = implementation.parameters.filter((obj : any) => !(obj.name === "authorization" && obj.in === "header"))
      });
    });
}


export function parseCSVBufferToArray<T extends any>(csvBuffer: Buffer) {
  return new Promise<T[]>((resolve, reject) => {
    const results : T[] = [];
    const bufferStream = new Readable();
    bufferStream.push(csvBuffer);
    bufferStream.push(null); // Signals the end of data
    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        // 'data' represents a row in the CSV file
        results.push(data);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}
