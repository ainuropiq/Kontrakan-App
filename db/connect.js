// db/connect.js — Koneksi PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

// Test koneksi saat startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database gagal terhubung:', err.message);
  } else {
    console.log('✅ Database PostgreSQL terhubung');
    release();
  }
});

module.exports = pool;
