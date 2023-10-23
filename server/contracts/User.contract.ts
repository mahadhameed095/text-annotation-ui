import { initContract } from "@ts-rest/core";
import { UserSchema } from "../schemas";
import { z } from "zod";

const c = initContract();

const UserContract = c.router({
    register: {
        method : 'POST',
        path: '/register',
        responses:{
            400 : c.type<{ message: "email already exists" }>(),
            201 : UserSchema.omit({ password : true }).extend({ token : z.string()})
        },
        body: UserSchema.pick({ name : true, email : true, password : true}),
        summary : 'Register a user'
    },
    login: {
        method : 'POST',
        path : '/login',
        responses:{
            400 : c.type<{ message : "email or password incorrect"}>(),
            200 : UserSchema.omit({ password : true }).extend({ token : z.string()})
        },
        body: UserSchema.pick({ email : true, password : true }),
        summary : 'login a user'
    }
}, {
    strictStatusCodes : true
});

export default UserContract;