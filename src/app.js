const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const verifyToken = require('./middlewares/verifyToken');
const verifyRole = require('./middlewares/verifyRole');
const { updateGrade } = require('./controllers/gradeController');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/students', studentRoutes);
app.use('/students/:id/grades', gradeRoutes);

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Editar calificación (solo user)
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
 *             required: [calificacion]
 *             properties:
 *               calificacion:
 *                 type: number
 *     responses:
 *       200:
 *         description: Calificación actualizada
 */
app.put('/grades/:id', verifyToken, verifyRole('user'), updateGrade);

module.exports = app;
