import { createExpressEndpoints } from '@ts-rest/express';
import bodyParser from 'body-parser';
import express from 'express';
import ApiContract from "./contracts";
import * as Controllers from "./controllers";
import { AdminOnly, Auth } from './middleware';
import path from 'path';

const app = express();
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
    
const distPath = path.join(__dirname, '../../client/dist');
app.use('/', express.static(distPath));

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root : distPath});
});
    
export default app;