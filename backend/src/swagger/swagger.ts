// import { Application } from 'express';

// const yaml = require('js-yaml');
// const swaggerUi = require('swagger-ui-express');
// const fs = require('fs');
// const path = require('path');

// const swaggerFilePath =
//   process.env.NODE_ENV === 'production' ? path.join(__dirname, 'swagger/swagger.yaml') : path.join(process.cwd(), 'src/swagger/swagger.yaml');

// const swaggerDocument = yaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));

// const setupSwaggerDocs = (app: Application) => {
//   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// };

// module.exports = setupSwaggerDocs;

export {};
