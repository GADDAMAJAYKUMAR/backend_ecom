import dotenv from 'dotenv';

dotenv.config();

const baseConfig = {
  dialect: 'postgres',
  logging: false,
};

const getDevConfig = () => ({
  ...baseConfig,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce_db',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
});

const getTestConfig = () => ({
  ...baseConfig,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME_TEST || 'ecommerce_db_test',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
});

const getProdConfig = () => ({
  ...baseConfig,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

export default {
  development: getDevConfig(),
  test: getTestConfig(),
  production: getProdConfig(),
};
