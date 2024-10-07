import { Application } from 'express';

// swagger.js or swagger.ts
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const swaggerDocument = yaml.load(fs.readFileSync(path.join(process.cwd(), 'src/swagger/swagger.yaml'), 'utf8'));
const setupSwaggerDocs = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

module.exports = setupSwaggerDocs;
