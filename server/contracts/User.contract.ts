import { initContract } from "@ts-rest/core";
import { UserSchema } from "../schemas";
import { z } from "zod";

const c = initContract();

const UserContract = c.router({
    signIn: {
        method : 'POST',
        path : '/signIn',
        responses:{
            200 : UserSchema
        },
        body: z.object({ token : z.string() }),
        summary : 'login or register a user'
    },
    approve: {
        method : 'POST',
        path : '/approve',
        body : UserSchema.pick({ id : true }),
        headers : z.object({ authorization : z.string() }),
        responses: {
            200 : z.object({}),
        },
        summary : 'Approve a user for annotation(admin-only)'
    },
    listApproved : {
        method : 'GET',
        path : '/',
        headers : z.object({ authorization : z.string() }),
        query : z.object({
            take : z.coerce.number().max(100).optional(),
            skip : z.coerce.number().int()
        }),
        responses : {
            200 : UserSchema.array()
        },
        summary : 'Get all users. (admin-only access)'
    },
    listUnapproved : {
        method : 'GET',
        path : '/',
        headers : z.object({ authorization : z.string() }),
        query : z.object({
            take : z.coerce.number().max(100).optional(),
            skip : z.coerce.number().int()
        }),
        responses : {
            200 : UserSchema.array()
        },
        summary : 'Get all users. (admin-only access)'
    }
}, {
    pathPrefix : '/users',
    strictStatusCodes : true,
});

export default UserContract;