# Backend Setup Instructions

Follow these steps to set up and run the backend server:

## Step 1: Install Dependencies

```bash
cd server
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then edit `.env` with your configuration:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration - CHANGE THESE IN PRODUCTION!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_change_this_in_production
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## Step 3: Set Up PostgreSQL Database

### Option A: Using PostgreSQL CLI (psql)

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ecommerce_db;

# Exit psql
\q
```

### Option B: Using pgAdmin or other GUI tool
- Create a new database named `ecommerce_db`

## Step 4: Run Database Migrations

The migration will create the `users` table:

```bash
npm run db:migrate
```

## Step 5: (Optional) Seed Database with Demo Users

This will create:
- Admin user: `admin@example.com` / `admin123456`
- Test user: `user@example.com` / `admin123456`

```bash
npm run db:seed
```

## Step 6: Start the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Verify Installation

Test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

## Quick Start Test

### 1. Register a new user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from the response!

### 3. Access protected route:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

## Database Management Commands

```bash
# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:undo

# Run all seeders
npm run db:seed

# Undo all seeders
npm run db:seed:undo

# Complete database reset (drop, create, migrate, seed)
npm run db:reset
```

## Troubleshooting

### Port already in use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Database connection error
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Migration errors
- Make sure database exists before running migrations
- Check database connection settings in `config/database.js`

### "sequelize is not defined" error
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Project Structure

```
server/
├── config/              # Database configuration
├── constants/           # Message constants
├── controllers/         # Request handlers
├── middleware/          # Custom middleware
├── migrations/          # Database migrations
├── models/              # Sequelize models
├── routes/              # API routes
├── seeders/            # Database seeders
├── utils/              # Helper utilities
├── .env                # Environment variables (create this)
├── .env.example        # Environment template
├── server.js           # Application entry point
└── package.json        # Dependencies and scripts
```

## Next Steps

1. **Connect Frontend**: Update the Next.js app to call these API endpoints
2. **Add More Features**: Products, cart, orders, etc.
3. **Set Up Testing**: Write unit and integration tests
4. **Deploy**: Deploy to production (Heroku, AWS, etc.)

## API Documentation

Full API documentation is available in `README.md`

## Security Notes

- Always change JWT secrets in production
- Never commit `.env` file to version control
- Use HTTPS in production
- Implement rate limiting for production
- Regular security audits recommended
