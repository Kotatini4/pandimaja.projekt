const express = require("express");
const router = express.Router();
const {
    verifyToken,
    isAdmin,
    isUserOrAdmin,
} = require("../middleware/authMiddleware");
const tootajaController = require("../controllers/tootajaController");

/**
 * @swagger
 * /api/tootaja/{id}:
 *   patch:
 *     summary: Изменение данных работника (только для администратора или работника)
 *     tags: [Tootaja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID работника
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nimi:
 *                 type: string
 *               perekonnanimi:
 *                 type: string
 *               tel:
 *                 type: string
 *               aadres:
 *                 type: string
 *               role_id:
 *                 type: integer
 *                 enum: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Работник обновлен
 *       404:
 *         description: Работник не найден
 */

router.patch("/:id", verifyToken, isAdmin, tootajaController.updateTootaja);

/**
 * @swagger
 * /api/tootaja:
 *   get:
 *     summary: Получить список всех работников (только для администратора или работника)
 *     tags: [Tootaja]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список всех работников
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tootaja_id:
 *                     type: integer
 *                   nimi:
 *                     type: string
 *                   perekonnanimi:
 *                     type: string
 *                   kood:
 *                     type: string
 *                   tel:
 *                     type: string
 *                   aadres:
 *                     type: string
 *                   role_id:
 *                     type: integer
 */
// Получить список всех работников
router.get("/", verifyToken, isUserOrAdmin, tootajaController.getAllTootajad);

module.exports = router;
