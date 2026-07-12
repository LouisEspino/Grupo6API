const pool = require('../config/authDb');

async function listUsers(req, res) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    res.json(rows.map(r => ({ ...r, id: Number(r.id) })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  if (Number(id) === req.user.id)
    return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { listUsers, deleteUser };
