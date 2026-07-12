const express = require('express');
const router = express.Router({ mergeParams: true });
const { getGrades, createGrade, updateGrade } = require('../controllers/gradeController');
const verifyToken = require('../middlewares/verifyToken');
const verifyRole = require('../middlewares/verifyRole');

/**
 * @swagger
 * /students/{id}/grades:
 *   get:
 *     summary: Ver calificaciones de un estudiante (solo user)
 *     tags: [Grades]
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
 *         description: Lista de calificaciones
 */
router.get('/', verifyToken, verifyRole('user'), getGrades);

/**
 * @swagger
 * /students/{id}/grades:
 *   post:
 *     summary: Registrar calificación (solo user)
 *     tags: [Grades]
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
 *             required: [materia, calificacion]
 *             properties:
 *               materia:
 *                 type: string
 *                 enum:
 *                   - Metodología para el Desarrollo de Sistemas
 *                   - Arquitectura de Software
 *                   - Bases de Datos Avanzadas
 *               calificacion:
 *                 type: number
 *     responses:
 *       201:
 *         description: Calificación registrada
 */
router.post('/', verifyToken, verifyRole('user'), createGrade);

module.exports = router;
