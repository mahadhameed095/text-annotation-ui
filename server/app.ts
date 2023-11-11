import { createExpressEndpoints } from '@ts-rest/express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as Contracts from "./contracts";
import * as Controllers from "./controllers";
import { AdminOnly, Auth } from './middleware';
import { generateOpenApi } from '@ts-rest/open-api';
import { patchOpenAPIDocument } from './utils';
import * as swaggerUi from 'swagger-ui-express';
import admin from 'firebase-admin';
import Env from './ENV';



admin.initializeApp({
  credential: admin.credential.cert('annotext-4fa92-firebase-adminsdk-ks24q-96338efe3c.json')
});

const auth = admin.auth();

const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ0OWU0N2ZiZGQ0ZWUyNDE0Nzk2ZDhlMDhjZWY2YjU1ZDA3MDRlNGQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiMjBrLTAxNDYgUmFhaGltIFNpZGRpcWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS2F4aFBVUzF4YmRnQVpsZjd4emxacFlIZVQyYXo4aVhsVmJ4WWdoOEpSPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2Fubm90ZXh0LTRmYTkyIiwiYXVkIjoiYW5ub3RleHQtNGZhOTIiLCJhdXRoX3RpbWUiOjE2OTk3MDgxNDIsInVzZXJfaWQiOiJTTTc4aGtReHNxVDNKWVdXMTZmYVYxSVY0NjQyIiwic3ViIjoiU003OGhrUXhzcVQzSllXVzE2ZmFWMUlWNDY0MiIsImlhdCI6MTY5OTcwODE0MywiZXhwIjoxNjk5NzExNzQzLCJlbWFpbCI6ImsyMDAxNDZAbnUuZWR1LnBrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDkzODM0MzcxNzczMDgwMjc0OTciXSwiZW1haWwiOlsiazIwMDE0NkBudS5lZHUucGsiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.FzCmj0ixqKK2RIdBf_6c_-bg3vI6dXOQUg9oL_0tr56iiazmJyX23MpRFp07GdkN_RRBUh_H142yFrlE73K79xFfUzUmh17yQtGjNLa6N-VGahILWfBGxycw2vw98cYuSoFHbT1s9rjVpBdmGDgPxx5qpNo3TTbmu71CrCoNORvAdqY5yakx_RtcAoMSXQQRGnuIwlDysbqn-qdiCmrf46a87qb0IyEN9JViYmnQFpzB_GPvUqKkpg7U-BZ1jjkmF7THe_ihbPwFRxg-pV8Q-Hh__itQjsEqeGeDXY9MyciECVzZmJ0jeC_EeU1P0IAOdGHkKlmpOe6mSLFcxCdqUA";

auth.verifyIdToken(token)
    .then(user => {
        const { name, email, phone_number, uid } = user;
        console.log({ name, phone_number, uid, email });
});


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

createExpressEndpoints(
  Contracts.UserContract,
  Controllers.UserController,
  app
);
createExpressEndpoints(
  Contracts.DocumentContract,
  Controllers.DocumentController,
  app,
  { globalMiddleware : [Auth, AdminOnly] }
);
createExpressEndpoints(
  Contracts.AnnotationContract,
  Controllers.AnnotationController,
  app,
  { globalMiddleware : [Auth] }
);

const openApiDocument = generateOpenApi(Contracts.ApiContract, {
  info: {
    title: 'API',
    version: '1.0.0',
    
  },
});

patchOpenAPIDocument(openApiDocument);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(Env.PORT, () => {
  console.log(`Server is running on port ${Env.PORT}`);
});