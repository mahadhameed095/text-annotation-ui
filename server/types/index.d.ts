import { User } from "../schemas";
import { Env } from "../schemas";
declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }

  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}