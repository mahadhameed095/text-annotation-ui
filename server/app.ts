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
import Env from './ENV';

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