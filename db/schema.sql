-- =====================================================
-- KONTRAKAN MANAGER — Inisialisasi Database PostgreSQL
-- Jalankan otomatis saat pertama kali deploy di Railway
-- =====================================================

-- Tabel Units (9 pintu kontrakan)
CREATE TABLE IF NOT EXISTS units (
  id          INTEGER PRIMARY KEY,
  status      VARCHAR(20) NOT NULL DEFAULT 'vacant',
  tenant      VARCHAR(100),
  wa          VARCHAR(20),
  since       VARCHAR(7),
  rent        INTEGER NOT NULL DEFAULT 1500000,
  paid        BOOLEAN NOT NULL DEFAULT false,
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Tabel Keluhan / Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id          SERIAL PRIMARY KEY,
  unit_id     INTEGER NOT NULL REFERENCES units(id),
  priority    VARCHAR(10) NOT NULL DEFAULT 'medium',
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  description TEXT NOT NULL,
  category    VARCHAR(50) DEFAULT 'Lainnya',
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Tabel Pengaturan Pemilik
CREATE TABLE IF NOT EXISTS settings (
  key   VARCHAR(50) PRIMARY KEY,
  value TEXT
);

-- ── Data Awal: 9 Unit ──
INSERT INTO units (id, status, tenant, wa, since, rent, paid) VALUES
  (1, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (2, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (3, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (4, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (5, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (6, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (7, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (8, 'vacant',   NULL,              NULL,            NULL,      1000000, false),
  (9, 'vacant',   NULL,              NULL,            NULL,      1000000, false)
ON CONFLICT (id) DO NOTHING;

-- ── Data Awal: Keluhan ──
INSERT INTO complaints (unit_id, priority, status, description, category, date) VALUES
  (NULL, 'medium', 'pending', '', 'Lainnya', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ── Data Awal: Pengaturan ──
INSERT INTO settings (key, value) VALUES
  ('owner_name',    'Ainu Rafiq'),
  ('owner_wa',      '085777872213'),
  ('property_name', 'Kontrakan ID'),
  ('property_address', 'Kp.Asem RT.004 RW.005 Semanan, Kalideres')
ON CONFLICT (key) DO NOTHING;

DELETE FROM complaints
WHERE unit_id IS NULL
  AND description = '';
