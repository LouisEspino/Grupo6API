const express = require('express');
const router = express.Router();
const { listStudents, getStudent, createStudent, updateStudent } = require('../controllers/studentController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Listar estudiantes (solo user)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 */
router.get('/', verifyToken, verifyRole('user'), listStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Detalle de estudiante (solo user)
 *     tags: [Students]
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
 *         description: Datos del estudiante
 *       404:
 *         description: No encontrado
 */
router.get('/:id', verifyToken, verifyRole('user'), getStudent);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Crear estudiante (solo user)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, cedula, email]
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               cedula:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Estudiante creado
 */
router.post('/', verifyToken, verifyRole('user'), createStudent);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Editar estudiante (solo user)
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 */
router.put('/:id', verifyToken, verifyRole('user'), updateStudent);

module.exports = router;
