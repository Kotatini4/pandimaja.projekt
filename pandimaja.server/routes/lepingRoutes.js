const express = require("express");
const router = express.Router();
const lepingController = require("../controllers/lepingController");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: Leping
 *   description: API для управления договорами
 */

/**
 * @swagger
 * /api/leping:
 *   post:
 *     summary: Создать новый договор (только для администратора или работника)
 *              если клиент имеет статус "blocked ", тогда создание договора невозможно
 *     tags: [Leping]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - klient_id
 *               - toode_id
 *               - tootaja_id
 *             properties:
 *               klient_id:
 *                 type: integer
 *               toode_id:
 *                 type: integer
 *               tootaja_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               date_valja_ostud:
 *                 type: string
 *                 format: date
 *               pant_hind:
 *                 type: number
 *               valja_ostud_hind:
 *                 type: number
 *               ostuhind:
 *                 type: number
 *               müügihind:
 *                 type: number
 *               leping_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Договор создан
 */
router.post("/", verifyToken, isUserOrAdmin, lepingController.createLeping);

/**
 * @swagger
 * /api/leping:
 *   get:
 *     summary: Получить все договоры (только для администратора или работника)
 *     tags: [Leping]
 *     responses:
 *       200:
 *         description: Список договоров
 */
router.get("/", verifyToken, isUserOrAdmin, lepingController.getAllLepingud);

/**
 * @swagger
 * /api/leping/{id}:
 *   get:
 *     summary: Получить договор по ID (только для администратора или работника)
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о договоре
 *       404:
 *         description: Договор не найден
 */
router.get("/:id", verifyToken, isUserOrAdmin, lepingController.getLepingById);

/**
 * @swagger
 * /api/leping/{id}:
 *   put:
 *     summary: Обновить договор (только для администратора или работника)
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               pant_hind:
 *                 type: number
 *               müügihind:
 *                 type: number
 *     responses:
 *       200:
 *         description: Договор обновлён
 *       404:
 *         description: Договор не найден
 */
router.put("/:id", verifyToken, isUserOrAdmin, lepingController.updateLeping);

/**
 * @swagger
 * /api/leping/{id}:
 *   delete:
 *     summary: Удалить договор (только для администратора или работника)
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Успешно удалён
 *       404:
 *         description: Договор не найден
 */
router.delete(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    lepingController.deleteLeping
);

module.exports = router;
