import { initServer } from "@ts-rest/express";
import { UserContract } from "../contracts";
import { UserService } from "../service";
import { encrypt, generateToken, removeKeyFromObject } from "../utils";
import { AdminOnly, Auth } from "../middleware";
import prismaClient from "../prisma";

const server = initServer();
 
const UserController = server.router(UserContract, {
    register : async ({ body : { email, name, password }}) => {
      const user = await UserService.getUserByEmail(email);
      if(user) return { 
        status : 400,
        body : { message : "email already exists" }
      };
      const createdUser = removeKeyFromObject( //omit password from fetched user
        await UserService.createUser(name, email, encrypt(password)),
        'password'
      );
      const token = generateToken(createdUser);
      return { status : 201, body : { ...createdUser, token }};
    },
    login : async ({ body : { email, password }}) => {
      const user = await UserService.getUserByEmail(email);
      if(!user || user.password !== encrypt(password)) return { 
        status : 400, 
        body : { message : "email or password incorrect"}
      };
      const userPasswordRemoved = removeKeyFromObject(user, 'password');
      const token = generateToken(userPasswordRemoved);
      return {
        status : 200,
        body : {...userPasswordRemoved, token}
      };
    },
    listAll : {
      middleware : [Auth, AdminOnly as any],
      handler : async ({ query }) => {
        const users = await prismaClient.user.findMany({
          ...query
        });
        return { status : 200, body : users }
      }
    }
});

export default UserController;