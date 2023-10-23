import { initContract } from "@ts-rest/core";
import { UserSchema, UserWithoutPasswordSchema } from "../schemas";
import { z } from "zod";

const c = initContract();

const UserContract = c.router({
    register: {
        method : 'POST',
        path: '/register',
        responses:{
            400 : c.type<{ message: "email already exists" }>(),
            201 : UserWithoutPasswordSchema.extend({ token : z.string()})
        },
        body: UserSchema.pick({ name : true, email : true, password : true}),
        summary : 'Register a user'
    },
    login: {
        method : 'POST',
        path : '/login',
        responses:{
            400 : c.type<{ message : "email or password incorrect"}>(),
            200 : UserWithoutPasswordSchema.extend({ token : z.string()})
        },
        body: UserSchema.pick({ email : true, password : true }),
        summary : 'login a user'
    },
    listAll : {
        method : 'GET',
        path : '/',
        query : z.object({
            skip : z.coerce.number().optional(),
            take : z.coerce.number().optional()
        }),
        responses : {
            200 : UserWithoutPasswordSchema.array()
        },
        summary : 'Get all users. (admin-only access)'
    }
}, {
    strictStatusCodes : true
});

export default UserContract;