const express = require("express");
const router = express.Router();
const statusToodeController = require("../controllers/statusToodeController");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");
/**
 * @swagger
 * tags:
 *   name: StatusToode
 *   description: API для управления статусами товаров
 */

/**
 * @swagger
 * /api/status_toode:
 *   post:
 *     summary: Создать новый статус (только для администратора или работника)
 *     tags: [StatusToode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nimetus
 *             properties:
 *               nimetus:
 *                 type: string
 *     responses:
 *       201:
 *         description: Статус успешно создан
 */
router.post(
    "/",
    verifyToken,
    isUserOrAdmin,
    statusToodeController.createStatus
);

/**
 * @swagger
 * /api/status_toode:
 *   get:
 *     summary: Получить список всех статусов (только для администратора или работника)
 *     tags: [StatusToode]
 *     responses:
 *       200:
 *         description: Список статусов
 */
router.get(
    "/",
    verifyToken,
    isUserOrAdmin,
    statusToodeController.getAllStatuses
);

/**
 * @swagger
 * /api/status_toode/{id}:
 *   get:
 *     summary: Получить статус по ID (только для администратора или работника)
 *     tags: [StatusToode]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о статусе
 *       404:
 *         description: Статус не найден
 */
router.get(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    statusToodeController.getStatusById
);

/**
 * @swagger
 * /api/status_toode/{id}:
 *   put:
 *     summary: Обновить статус по ID (только для администратора или работника)
 *     tags: [StatusToode]
 *     parameters:
 *       - name: id
 *         in: path
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
 *               nimetus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Статус успешно обновлён
 *       404:
 *         description: Статус не найден
 */
router.put(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    statusToodeController.updateStatus
);

/**
 * @swagger
 * /api/status_toode/{id}:
 *   delete:
 *     summary: Удалить статус по ID (только для администратора или работника)
 *     tags: [StatusToode]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Статус успешно удалён
 *       404:
 *         description: Статус не найден
 */
router.delete(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    statusToodeController.deleteStatus
);

module.exports = router;
