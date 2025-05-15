const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API для создания работников и верификации
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового сотрудника (только для администратора)
 *     tags: [Auth]
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
 *               kood:
 *                 type: string
 *               tel:
 *                 type: string
 *               aadres:
 *                 type: string
 *               pass:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка запроса
 */
// Роут для регистрации нового пользователя, только под админом!!!
router.post("/register", verifyToken, isAdmin, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Логин пользователя (получение токена)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kood
 *               - pass
 *             properties:
 *               kood:
 *                 type: string
 *                 description: Личный код пользователя
 *               pass:
 *                 type: string
 *                 description: Пароль пользователя
 *     responses:
 *       200:
 *         description: Успешный логин, возвращает токен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT токен для авторизации
 *       400:
 *         description: Неверные данные логина
 */
// Роут для логирования
router.post("/login", authController.login);

module.exports = router;
