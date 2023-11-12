import { initContract } from '@ts-rest/core';
import UserContract from './User.contract';
import DocumentContract from './Document.contract';
import AnnotationContract from './Annotation.contract';

const contract = initContract();
const ApiContract = contract.router({ 
    document : DocumentContract, 
    user : UserContract,
    annotation : AnnotationContract
}, {
    pathPrefix : "/api"
});

export default ApiContract;