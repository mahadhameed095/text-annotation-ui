import { initClient } from '@ts-rest/core';
import * as Contracts from '../server/contracts';

const baseUrl = 'http://localhost:5433';

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

