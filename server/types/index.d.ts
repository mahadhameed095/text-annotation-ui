import { UserWithoutPassword } from "../schemas";
import { Env } from "../schemas";
declare global {
    namespace Express {
        export interface Request {
            user: UserWithoutPassword;
        }
    }

  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }

}
const meow = "";
export { meow };