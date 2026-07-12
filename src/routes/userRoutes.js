const express = require('express');
const router = express.Router();
const { listUsers, deleteUser } = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos los usuarios (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       403:
 *         description: Acceso denegado
 */
router.get('/', verifyToken, verifyRole('admin'), listUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', verifyToken, verifyRole('admin'), deleteUser);

module.exports = router;
