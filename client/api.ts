import { initClient } from '@ts-rest/core';
import * as Contracts from '../server/contracts';
import { Value } from '../server/schemas';
export * from '../server/schemas';

export type Labels = Value;

const baseUrl = 'https://annotext.azurewebsites.net/';

export const User = initClient(Contracts.UserContract, {
    baseUrl,
    baseHeaders : {}
});

export const Document = initClient(Contracts.DocumentContract, {
    baseUrl,
    baseHeaders : {}
});

export const Annotation = initClient(Contracts.AnnotationContract, {
    baseUrl,
    baseHeaders : {}
});

export const { AnnotationContract, DocumentContract, UserContract } = Contracts