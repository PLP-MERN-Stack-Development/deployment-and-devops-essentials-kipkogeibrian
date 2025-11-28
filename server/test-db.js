const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pool.connect();
    console.log('✅ Connected to database successfully!');
    
    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();