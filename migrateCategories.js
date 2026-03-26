require('dotenv').config();
const { sequelize } = require('./config/sequelize');
const { DataTypes, QueryTypes } = require('sequelize');

async function migrate() {
  try {
    await sequelize.authenticate();
    const qi = sequelize.getQueryInterface();

    // Add slug column (nullable first)
    try {
      await qi.addColumn('categories', 'slug', { type: DataTypes.STRING, allowNull: true });
      console.log('✅ Added slug column');
    } catch (e) {
      console.log('ℹ️  slug column already exists');
    }

    // Add description column
    try {
      await qi.addColumn('categories', 'description', { type: DataTypes.TEXT, allowNull: true });
      console.log('✅ Added description column');
    } catch (e) {
      console.log('ℹ️  description column already exists');
    }

    // Add image column
    try {
      await qi.addColumn('categories', 'image', { type: DataTypes.STRING, allowNull: true });
      console.log('✅ Added image column');
    } catch (e) {
      console.log('ℹ️  image column already exists');
    }

    // Backfill slugs for existing categories
    const cats = await sequelize.query('SELECT id, name FROM categories WHERE slug IS NULL', { type: QueryTypes.SELECT });
    const usedSlugs = new Set();
    for (const cat of cats) {
      let slug = cat.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      let finalSlug = slug;
      let counter = 1;
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      usedSlugs.add(finalSlug);
      await sequelize.query('UPDATE categories SET slug = $1 WHERE id = $2', { bind: [finalSlug, cat.id] });
      console.log(`✅ Set slug: ${cat.name} → ${finalSlug}`);
    }

    // Now make slug NOT NULL
    try {
      await qi.changeColumn('categories', 'slug', { type: DataTypes.STRING, allowNull: false, unique: true });
      console.log('✅ slug column set to NOT NULL + UNIQUE');
    } catch (e) {
      console.log('⚠️  Could not set slug NOT NULL:', e.message);
    }

    console.log('\n🎉 Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
