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

/**
 * @swagger
 * /api/tootaja/{id}:
 *   delete:
 *     summary: Удалить работника по ID (только для admin)
 *     tags: [Tootaja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID работника
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Работник успешно удалён
 *       404:
 *         description: Работник не найден
 *       500:
 *         description: Ошибка сервера
 */

router.delete("/:id", verifyToken, isAdmin, tootajaController.deleteTootaja);

/**
 * @swagger
 * /api/tootaja/search:
 *   get:
 *     summary: Поиск работников по имени, фамилии или коду (только для администратора или работника)
 *     tags: [Tootaja]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nimi
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Имя работника (поиск по части имени)
 *       - name: perekonnanimi
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Фамилия работника (поиск по части фамилии)
 *       - name: kood
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Идентификационный код работника (поиск по части кода)
 *     responses:
 *       200:
 *         description: Найденные работники
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
 *       400:
 *         description: Не указан параметр поиска
 *       500:
 *         description: Ошибка сервера при поиске
 */

router.get(
    "/search",
    verifyToken,
    isUserOrAdmin,
    tootajaController.searchTootajad
);

module.exports = router;
