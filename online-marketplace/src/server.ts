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
import bcrypt from 'bcryptjs';

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
const SECRET_KEY = 'WEBTECHPROJ' //process.env['SECRET_KEY']! ;

/*const pool = new Pool({
 user: 'postgres',
  host: 'localhost', 
  database: 'retail',
  password: 'postgres',
  port: 5432,
});*/
/*const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'retail',
  password: 'postgres',
  port: 5433,
}); */

const pool = new Pool({
  user: (process.env['DB_USER']),
  host: process.env['DB_HOST'],
  database: process.env['DB_NAME'],
  password: String(process.env['DB_PASSWORD']),
  port: Number(process.env['DB_PORT'])
});

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

    const saltRounds = 10; //setting up rounds of hashing (there more rounds there higher hashing but slower)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const values = [username, hashedPassword];

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


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }


    /*if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    */

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
    console.log('DB Config:', {
      user: process.env['DB_USER'],
      host: process.env['DB_HOST'],
      database: process.env['DB_NAME'],
      password: process.env['DB_PASSWORD'],
      port: process.env['DB_PORT']
    });
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
        v.name AS vehicle_name,
        sender.username AS sender_username,
        receiver.username AS receiver_username
      FROM 
        messages m
      LEFT JOIN 
        products p ON m.product_id = p.id
      LEFT JOIN 
        vehicles v ON m.vehicle_id = v.id
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
    const { product_id, vehicle_id, sender_id, receiver_id, content, message_type } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sicherstellen, dass entweder `product_id` oder `vehicle_id` gesetzt ist
    if (!product_id && !vehicle_id) {
      return res.status(400).json({ error: 'Either product_id or vehicle_id must be provided' });
    }

    const query = `
      INSERT INTO messages (product_id, vehicle_id, sender_id, receiver_id, content, message_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [product_id || null, vehicle_id || null, sender_id, receiver_id, content, message_type];

    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('Error saving message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
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

app.patch('/api/products/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;


    const validStatuses = ['available', 'reserved', 'sold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }


    const query = `
      UPDATE products
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    const values = [status, id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error updating product status:', error);
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


app.get('/api/vehicles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY brand_id ASC');


    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});




app.get('/api/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('GET VEHICLE ERROR:', error);
    return res.status(500).send('SERVER ERROR');
  }
});


app.patch('/api/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isSold } = req.body;

    const result = await pool.query(
      'UPDATE vehicles SET isSold = $1 WHERE id = $2 RETURNING *',
      [isSold, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('UPDATE VEHICLE ERROR:', error);
    return res.status(500).send('SERVER ERROR');
  }
});



app.delete('/api/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM vehicles WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('DELETE VEHICLE ERROR:', error);
    return res.status(500).send('SERVER ERROR');
  }
});

app.post('/api/vehicles', async (req: Request, res: Response) => {
  console.log('Request body:', req.body);
  try {
    const {
      name, category, brandId, brand, modelId, model, price, mileage, firstRegistration, fuelType,
      power, description, image, isSold, sellerId, location, doors, seats,
      vehicleType, condition, warranty, transmission, drive, color, batteryCapacity, range
    } = req.body;

    // Pflichtfelder prüfen
    if (!name || !brandId || !brand || !modelId || !model || !price || !category || !sellerId) {
      console.error('❌ ERROR: Missing required fields!', req.body);
      return res.status(400).json({ error: 'Missing required fields', received: req.body });
    }

    // SQL Query (fügt `brand` & `model` zusätzlich zu `brandId` & `modelId` hinzu)
    const query = `
      INSERT INTO vehicles (
        name, category, brand_id, brand, model_id, model, price, mileage, first_registration, fuel_type,
        power, description, image, is_sold, seller_id, location, doors, seats,
        vehicle_type, condition, warranty, transmission, drive, color, battery_capacity, range
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
        $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
      ) RETURNING *;
    `;

    // Werte mit `camelCase → snake_case` Umwandlung für SQL
    const values = [
      name, category, brandId, brand, modelId, model, price, mileage, parseInt(firstRegistration, 10), fuelType,
      power, description, image || '', isSold || false, sellerId, location || null, doors || null, seats || null,
      vehicleType || null, condition || null, warranty || false, transmission || null, drive || null, color || null,
      batteryCapacity || null, range || null
    ];

    console.log('🚀 SQL Query:', query);
    console.log('💾 SQL Values:', values);

    // Daten in DB speichern
    const result = await pool.query(query, values);
    return res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error('❌ Error saving vehicle:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch all vehicles for a specific user
app.get("/api/vehicles/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const query = "SELECT * FROM vehicles WHERE seller_id = $1";
    const result = await pool.query(query, [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching user vehicles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





app.get('/api/brands', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM brands ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Marken:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});

app.get('/api/models', async (req, res) => {
  const { brandId } = req.query; // Query-Parameter holen
  try {
    let query = 'SELECT * FROM models ORDER BY name';
    let values: any[] = [];

    if (brandId) { // Falls eine Marke gefiltert wird
      query = 'SELECT * FROM models WHERE brand_id = $1 ORDER BY name';
      values = [brandId];
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Modelle:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
});
;


app.get('/api/models/:brand_id', async (req, res) => {
  const { brand_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM models WHERE brand_id = $1 ORDER BY name', [brand_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Fehler beim Abrufen der Modelle:', err);
    res.status(500).json({ error: 'Serverfehler' });
  }
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
