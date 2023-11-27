import { createExpressEndpoints } from '@ts-rest/express';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import ApiContract from "./contracts";
import * as Controllers from "./controllers";
import { AdminOnly, Auth } from './middleware';
import { generateOpenApi } from '@ts-rest/open-api';
import { patchOpenAPIDocument } from './utils';
import * as swaggerUi from 'swagger-ui-express';
import Env from './ENV';
import startup from './startup';
import path from 'path';

startup()
  .then(() => {
    console.log("Startup script executed. Now Starting server....");
    const app = express();
    // app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    createExpressEndpoints(
      ApiContract.user,
      Controllers.UserController,
      app,
      { globalMiddleware : [bodyParser.json()]}
    );
    createExpressEndpoints(
      ApiContract.document,
      Controllers.DocumentController,
      app,
      { globalMiddleware : [bodyParser.json({ limit : '30mb'}), Auth, AdminOnly] }
    );
    createExpressEndpoints(
      ApiContract.annotation,
      Controllers.AnnotationController,
      app,
      { globalMiddleware : [bodyParser.json(), Auth] }
    );
    
    const openApiDocument = generateOpenApi(ApiContract, {
      info: {
        title: 'API',
        version: '1.0.0',
        
      },
    });
    
    patchOpenAPIDocument(openApiDocument);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
    
    const distPath = path.join(__dirname, '../../client/dist');
    app.use('/', express.static(distPath));
    
    app.get('/*', (req, res) => {
      res.sendFile('index.html', { root : distPath});
    });
    
    
    app.listen(Env.PORT, () => {
      console.log(`Server is running on port ${Env.PORT}`);
    });
});