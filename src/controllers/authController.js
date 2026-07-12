const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/authDb');

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: Number(user.id), username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function register(req, res) {
  const { username, password, role } = req.body;
  if (!username || !password || !role)
    return res.status(400).json({ error: 'username, password y role son requeridos' });

  if (!['admin', 'user'].includes(role))
    return res.status(400).json({ error: 'role debe ser admin o user' });

  let conn;
  try {
    conn = await pool.getConnection();
    const existing = await conn.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'El usuario ya existe' });

    const hash = await bcrypt.hash(password, 10);
    await conn.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hash, role]);
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

function logout(req, res) {
  res.json({ message: 'Sesión cerrada' });
}

module.exports = { login, register, logout };
