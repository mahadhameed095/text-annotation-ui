import { initServer } from "@ts-rest/express";
import ApiContract from "../contracts";
import { UserService } from "../service";
import { AdminOnly, Auth } from "../middleware";

import { createUser } from "../service/User.service";
import { joinArrays, pick } from "../utils";
import { auth } from "../firebaseAuth";

const server = initServer();
 
const UserController = server.router(ApiContract.user, {
    async signIn({ body : { token }}){
      const firebaseUserData = await auth.verifyIdToken(token);     
      let user = await UserService.getUserById(firebaseUserData.uid);
      if(!user)
        user = await createUser(firebaseUserData.uid);

        return {
        status : 200,
        body : { 
          ...user,
          ...pick(firebaseUserData, 
            { email : true, name : true, phone_number : true, picture : true })
        }
      };
    },

    approve:{
      middleware : [Auth, AdminOnly],
      async handler({ body : { id }}){
        await UserService.approveUser(id);
        return { status : 200, body : {} }
      }
    },
    listApproved : {
      middleware : [Auth, AdminOnly as any],
      async handler({ query : { take, skip } }){

        const dbUsers = await UserService.getAllApprovedUsers(skip, take);
        const firebaseUsersListResults = await auth.getUsers(dbUsers.map(user => ({ uid : user.id })));
        const firebaseUsers = firebaseUsersListResults.users.map( 
          user => ({ name : user.displayName, email : user.email, profile : user.photoURL, phone_number : user.phoneNumber, id : user.uid })
        );
        const results = joinArrays(firebaseUsers, dbUsers, 'id');
        return { status : 200, body : results };
      }
    },
    listUnapproved : {
      middleware : [Auth, AdminOnly as any],
      async handler({ query : { take, skip } }){

        const dbUsers = await UserService.getAllUnapprovedUsers(skip, take);
        const firebaseUsersListResults = await auth.getUsers(dbUsers.map(user => ({ uid : user.id })));
        const firebaseUsers = firebaseUsersListResults.users.map( 
          user => ({ name : user.displayName, email : user.email, profile : user.photoURL, phone_number : user.phoneNumber, id : user.uid })
        );
        const results = joinArrays(firebaseUsers, dbUsers, 'id');
        return { status : 200, body : results };
      }
    }
});

export default UserController;