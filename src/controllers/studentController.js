const pool = require('../config/academicDb');

async function listStudents(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM students ORDER BY apellido, nombre');
    res.json(rows.map(r => ({ ...r, id: Number(r.id) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function getStudent(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ ...rows[0], id: Number(rows[0].id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function createStudent(req, res) {
  const { nombre, apellido, cedula, email } = req.body;
  if (!nombre || !apellido || !cedula || !email)
    return res.status(400).json({ error: 'nombre, apellido, cedula y email son requeridos' });

  let conn;
  try {
    conn = await pool.getConnection();
    const existing = await conn.query('SELECT id FROM students WHERE cedula = ?', [cedula]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'Ya existe un estudiante con esa cédula' });

    const result = await conn.query(
      'INSERT INTO students (nombre, apellido, cedula, email) VALUES (?, ?, ?, ?)',
      [nombre, apellido, cedula, email]
    );
    res.status(201).json({ id: Number(result.insertId), message: 'Estudiante creado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function updateStudent(req, res) {
  const { nombre, apellido, cedula, email } = req.body;
  if (!nombre || !apellido || !cedula || !email)
    return res.status(400).json({ error: 'nombre, apellido, cedula y email son requeridos' });

  let conn;
  try {
    conn = await pool.getConnection();
    const existing = await conn.query('SELECT id FROM students WHERE cedula = ? AND id != ?', [cedula, req.params.id]);
    if (existing.length > 0)
      return res.status(409).json({ error: 'Esa cédula ya pertenece a otro estudiante' });

    const result = await conn.query(
      'UPDATE students SET nombre=?, apellido=?, cedula=?, email=? WHERE id=?',
      [nombre, apellido, cedula, email, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    res.json({ message: 'Estudiante actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { listStudents, getStudent, createStudent, updateStudent };
