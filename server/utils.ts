import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { UserWithoutPassword } from './schemas';
import { generateOpenApi } from '@ts-rest/open-api';
import Env from './ENV';

export function encrypt(text : string){
    return crypto.createHash('sha256').update(text).digest('hex');
};

export function generateToken(user : UserWithoutPassword){
    return jwt.sign({ user }, Env.ACCESS_TOKEN_SECRET) ;
}

export function decryptToken(token : string) : number{
    const userId = 0;
    return userId;
}

export function removeKeyFromObject<T extends Record<string, any>, K extends keyof T>
(obj : T, key : K) : Omit<T, K>
{
    const {[key] : _, ...rest} = obj;
    return rest;
}

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