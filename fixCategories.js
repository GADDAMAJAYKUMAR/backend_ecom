require('dotenv').config();
const { sequelize } = require('./config/sequelize');
const { DataTypes } = require('sequelize');

async function fix() {
  await sequelize.authenticate();
  
  // Delete the duplicate 'tablets' row (the one with null slug)
  await sequelize.query("DELETE FROM categories WHERE id = '174c64f5-e5b7-4eac-9e7b-0cc8984303a5'");
  console.log('Deleted duplicate tablets entry');

  // Make slug NOT NULL
  const qi = sequelize.getQueryInterface();
  await qi.changeColumn('categories', 'slug', { type: DataTypes.STRING, allowNull: false });
  console.log('slug column set to NOT NULL');

  console.log('Done!');
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
