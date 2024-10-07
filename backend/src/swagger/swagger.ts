import yaml from 'js-yaml';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerDocument = yaml.load(fs.readFileSync(join(__dirname, './swagger.yaml'), 'utf8'));

const setupSwaggerDocs = (app: express.Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument as object));
};

export default setupSwaggerDocs;
