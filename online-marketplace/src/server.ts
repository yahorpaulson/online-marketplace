import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import * as bodyParser from 'body-parser';
import { Request, Response, NextFunction } from 'express';




import cors from 'cors';
import express from 'express';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'retail',
  password: 'postgres',
  port: 5433,
});

app.use(cors());
app.use(bodyParser.json());


app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});


/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}



app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    res.status(500).send('SERVER ERROR');
  }
});

app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    res.json(result.rows);
  } catch (error) {
    console.error('GET CATEGORIES ERROR:', error);
    res.status(500).send('SERVER ERROR');
  }
});



/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
