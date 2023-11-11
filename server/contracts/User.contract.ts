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
        responses: {
            200 : z.undefined(),
        },
        summary : 'Approve a user for annotation(admin-only)'
    },
    listAll : {
        method : 'GET',
        path : '/',
        query : z.object({
            take : z.coerce.number().max(1000).optional(),
            pageToken : z.string().optional()
        }),
        responses : {
            200 : z.object({ 
                users: UserSchema.array(),
                pageToken : z.string().optional()
            })
        },
        summary : 'Get all users. (admin-only access)'
    }
}, {
    strictStatusCodes : true
});

export default UserContract;