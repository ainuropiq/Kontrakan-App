// =====================================================
// server.js — Kontrakan Manager Backend
// Express + PostgreSQL API
// =====================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const pool    = require('./db/connect');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Auto-init database saat pertama kali jalan ──
async function initDatabase() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Database diinisialisasi');
  } catch (err) {
    console.error('⚠️  DB init error:', err.message);
  }
}

// ======================
// API: UNITS
// ======================

// GET /api/units — ambil semua unit
app.get('/api/units', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM units ORDER BY id');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/units/:id — ambil satu unit
app.get('/api/units/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM units WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Unit tidak ditemukan' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/units/:id — update data unit
app.put('/api/units/:id', async (req, res) => {
  const { status, tenant, wa, since, rent, paid } = req.body;
  try {
    const result = await pool.query(
      `UPDATE units SET status=$1, tenant=$2, wa=$3, since=$4, rent=$5, paid=$6, updated_at=NOW()
       WHERE id=$7 RETURNING *`,
      [status, tenant || null, wa || null, since || null, rent || 1500000, paid || false, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Unit tidak ditemukan' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/units/:id/paid — toggle status bayar
app.patch('/api/units/:id/paid', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE units SET paid = NOT paid, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================
// API: SETTINGS
// ======================

// GET /api/settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/settings — update pengaturan
app.put('/api/settings', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await pool.query(
        'INSERT INTO settings (key,value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2',
        [key, value]
      );
    }
    res.json({ success: true, message: 'Pengaturan disimpan' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================
// API: DASHBOARD SUMMARY
// ======================
app.get('/api/dashboard', async (req, res) => {
  try {
    const units     = await pool.query('SELECT * FROM units ORDER BY id');
    const settings  = await pool.query('SELECT key, value FROM settings');

    const cfg = {};
    settings.rows.forEach(r => { cfg[r.key] = r.value; });

    const u = units.rows;
    const occupied = u.filter(x => x.status !== 'vacant');
    const totalPaid = occupied.filter(x => x.paid).reduce((s, x) => s + x.rent, 0);

    res.json({
      success: true,
      data: {
        settings: cfg,
        units: u,
        summary: {
          total_units:    u.length,
          occupied:       occupied.length,
          vacant:         u.filter(x => x.status === 'vacant').length,
          paid_count:     occupied.filter(x => x.paid).length,
          unpaid_count:   occupied.filter(x => !x.paid).length,
          total_income:   totalPaid
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ======================
// CATCH-ALL → index.html
// ======================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======================
// START SERVER
// ======================
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Kontrakan Manager berjalan di port ${PORT}`);
    console.log(`🌐 Buka: http://localhost:${PORT}`);
  });
});
