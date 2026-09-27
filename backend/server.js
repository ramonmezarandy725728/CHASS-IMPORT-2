const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) console.error('Error BD:', err.message);
  else console.log('🟢 Base de Datos SQLite Conectada.');
});

// Crear Tablas
db.serialize(() => {
  // Tabla Usuarios
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    nombre TEXT,
    rol TEXT CHECK(rol IN ('ADMIN', 'TRABAJADOR'))
  )`);

  // Tabla Clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    dni TEXT,
    telefono TEXT,
    direccion TEXT
  )`);

  // Tabla Movimientos
  db.run(`CREATE TABLE IF NOT EXISTS movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('ingreso', 'salida')),
    cliente TEXT,
    monto REAL NOT NULL,
    concepto TEXT NOT NULL,
    motivo TEXT,
    metodo_pago TEXT,
    usuario TEXT NOT NULL,
    semana_id INTEGER DEFAULT 1,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla Semanas / Historial
  db.run(`CREATE TABLE IF NOT EXISTS semanas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_semana INTEGER,
    fecha_cierre TEXT,
    total_ingresos REAL,
    total_salidas REAL,
    balance REAL,
    diferencia_cuadre REAL
  )`);

  // Usuario Admin por defecto
  db.run(`INSERT OR IGNORE INTO usuarios (username, password, nombre, rol) VALUES ('randy', 'admin123', 'Randy Ramon Meza', 'ADMIN')`);
  db.run(`INSERT OR IGNORE INTO usuarios (username, password, nombre, rol) VALUES ('maria', 'maria123', 'María', 'TRABAJADOR')`);
});

// --- RUTAS DE API ---

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM usuarios WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(401).json({ error: 'Credenciales incorrectas' });
    res.json({ id: row.id, nombre: row.nombre, rol: row.rol });
  });
});

// Obtener datos de Caja Activa
app.get('/api/caja', (req, res) => {
  db.all(`SELECT * FROM movimientos WHERE semana_id = (SELECT COALESCE(MAX(numero_semana), 1) FROM semanas) + 1 OR (SELECT COUNT(*) FROM semanas) = 0`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const ingresos = rows.filter(m => m.tipo === 'ingreso').reduce((a, b) => a + b.monto, 0);
    const salidas = rows.filter(m => m.tipo === 'salida').reduce((a, b) => a + b.monto, 0);
    res.json({ movimientos: rows, ingresos, salidas, balance: ingresos - salidas });
  });
});

// Registrar Movimiento (Ingreso o Salida)
app.post('/api/movimientos', (req, res) => {
  const { tipo, cliente, monto, concepto, motivo, metodo_pago, usuario } = req.body;
  const stmt = db.prepare(`INSERT INTO movimientos (tipo, cliente, monto, concepto, motivo, metodo_pago, usuario) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  stmt.run([tipo, cliente || 'Cliente General', monto, concepto, motivo || '-', metodo_pago || 'Efectivo', usuario], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// Obtener Clientes
app.get('/api/clientes', (req, res) => {
  db.all(`SELECT * FROM clientes ORDER BY nombre ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear Cliente
app.post('/api/clientes', (req, res) => {
  const { nombre, dni, telefono, direccion } = req.body;
  db.run(`INSERT INTO clientes (nombre, dni, telefono, direccion) VALUES (?, ?, ?, ?)`, [nombre, dni, telefono, direccion], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, nombre });
  });
});

// Cierre de Semana
app.post('/api/cierre-semana', (req, res) => {
  const { numero_semana, ingresos, salidas, balance, diferencia } = req.body;
  const fechaCierre = new Date().toLocaleDateString('es-PE');
  
  db.run(`INSERT INTO semanas (numero_semana, fecha_cierre, total_ingresos, total_salidas, balance, diferencia_cuadre) VALUES (?, ?, ?, ?, ?, ?)`, 
    [numero_semana, fechaCierre, ingresos, salidas, balance, diferencia], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
  });
});

// Historial de Semanas
app.get('/api/semanas', (req, res) => {
  db.all(`SELECT * FROM semanas ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));