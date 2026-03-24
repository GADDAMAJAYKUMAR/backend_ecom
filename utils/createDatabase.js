// utils/createDatabase.js
const { Client } = require('pg');
require('dotenv').config();

async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';

  // Connect to default 'postgres' database
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully!`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

module.exports = createDatabaseIfNotExists;
