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
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config({ path: 'data.env' });





export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
const SECRET_KEY = process.env['SECRET_KEY']!;

const pool = new Pool({
  user: (process.env['DB_USER']),
  host: process.env['DB_HOST'],
  database: process.env['DB_NAME'],
  password: String(process.env['DB_PASSWORD']),
  port: Number(process.env['DB_PORT'])
});


// Middleware for request parsing and CORS
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Serve static files from the public folder
app.use(express.static('public'));

// Serve static files for Angular browser app
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Request logger middleware
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, URL: ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

app.post('/api/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [username, password];

    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received');


    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }


    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);


    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];


    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );


    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).send('SERVER ERROR');
  }
});

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
app.post('/api/products', async (req: Request, res: Response) => {
  console.log('Request body:', req.body);

  try {
    const { name, categoryId, price, ownerId, description, images } = req.body;


    if (!name || !categoryId || !price || !ownerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    const query = `
      INSERT INTO products (name, category_id, price, owner_id, description, images)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      name,
      categoryId,
      price,
      ownerId,
      description || '',
      images && images.length > 0 ? `{${images.join(',')}}` : null,
    ];


    const result = await pool.query(query, values);
    console.log('Product added:', result.rows[0]);
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/api/messages/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    const query = `
      SELECT 
        m.*, 
        p.name AS product_name,
        sender.username AS sender_username,
        receiver.username AS receiver_username
      FROM 
        messages m
      JOIN 
        products p ON m.product_id = p.id
      JOIN 
        users AS sender ON m.sender_id = sender.id
      JOIN 
        users AS receiver ON m.receiver_id = receiver.id
      WHERE 
        m.sender_id = $1 OR m.receiver_id = $1
      ORDER BY 
        m.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { product_id, sender_id, receiver_id, content } = req.body;

    if (!product_id || !sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO messages (product_id, sender_id, receiver_id, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [product_id, sender_id, receiver_id, content];

    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]); // Always return after sending response
  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ error: 'Internal Server Error' }); // Consistent response
  }
});



app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);

    console.log('SQL Query Result:', result);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Product with ID ${id} deleted.`);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});




app.use('/**', (req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});







// Start the server
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });


}

// Export handler for Angular CLI
export const reqHandler = createNodeRequestHandler(app);
