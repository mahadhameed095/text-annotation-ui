import { EnvSchemaWithTransform } from "./schemas";
import 'dotenv/config';

const Env = EnvSchemaWithTransform.parse(process.env);
export default Env;