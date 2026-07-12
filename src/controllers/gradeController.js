const pool = require('../config/academicDb');

const MATERIAS = [
  'Metodología para el Desarrollo de Sistemas',
  'Arquitectura de Software',
  'Bases de Datos Avanzadas',
];

async function getGrades(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      'SELECT * FROM grades WHERE student_id = ? ORDER BY materia',
      [req.params.id]
    );
    res.json(rows.map(r => ({ ...r, id: Number(r.id), student_id: Number(r.student_id) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function createGrade(req, res) {
  const { materia, calificacion } = req.body;
  const { id: student_id } = req.params;

  if (!materia || calificacion === undefined)
    return res.status(400).json({ error: 'materia y calificacion son requeridos' });

  if (!MATERIAS.includes(materia))
    return res.status(400).json({ error: 'Materia inválida' });

  const nota = parseFloat(calificacion);
  if (isNaN(nota) || nota < 0 || nota > 20)
    return res.status(400).json({ error: 'Calificación debe ser entre 0 y 20' });

  let conn;
  try {
    conn = await pool.getConnection();
    const student = await conn.query('SELECT id FROM students WHERE id = ?', [student_id]);
    if (student.length === 0)
      return res.status(404).json({ error: 'Estudiante no encontrado' });

    const existing = await conn.query(
      'SELECT id FROM grades WHERE student_id = ? AND materia = ?',
      [student_id, materia]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: 'Ya existe una calificación para esa materia' });

    const result = await conn.query(
      'INSERT INTO grades (student_id, materia, calificacion) VALUES (?, ?, ?)',
      [student_id, materia, nota]
    );
    res.status(201).json({ id: Number(result.insertId), message: 'Calificación registrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function updateGrade(req, res) {
  const { calificacion } = req.body;
  if (calificacion === undefined)
    return res.status(400).json({ error: 'calificacion es requerida' });

  const nota = parseFloat(calificacion);
  if (isNaN(nota) || nota < 0 || nota > 20)
    return res.status(400).json({ error: 'Calificación debe ser entre 0 y 20' });

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE grades SET calificacion = ? WHERE id = ?',
      [nota, req.params.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Calificación no encontrada' });
    res.json({ message: 'Calificación actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { getGrades, createGrade, updateGrade };
