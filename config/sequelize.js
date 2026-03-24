const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'test' || process.env.DB_NAME === ':memory:') {
  // Use SQLite for tests
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully");

    // Use sync without alter since we handle schema changes with migrations
    await sequelize.sync({ alter: true });
    console.log("✅ All models synced successfully");

  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
