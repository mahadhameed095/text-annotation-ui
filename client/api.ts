import { initClient } from '@ts-rest/core';
import ApiContract from '../server/contracts';
import { Value } from '../server/schemas';
export * from '../server/schemas';

export type Labels = Value;

// const baseUrl = 'https://annotext.azurewebsites.net/';
const baseUrl = process.env.SERVER_ENDPOINT || 'http://localhost:5433';

export const User = initClient(ApiContract.user, {
    baseUrl,
    baseHeaders : {}
});

export const Document = initClient(ApiContract.document, {
    baseUrl,
    baseHeaders : {}
});

export const Annotation = initClient(ApiContract.annotation, {
    baseUrl,
    baseHeaders : {}
});

export { ApiContract };