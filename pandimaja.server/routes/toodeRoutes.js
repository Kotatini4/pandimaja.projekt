const express = require("express");
const router = express.Router();
const toodeController = require("../controllers/toodeController");
const multer = require("multer");
const path = require("path");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");

// Сначала создаём storage и upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueName =
            "toode_" + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/toode/laos:
 *   get:
 *     summary: Получить все товары со статусом "Laos" Это для просмотра товара продающегося в магазине, для всех!
 *     tags: [Toode]
 *     responses:
 *       200:
 *         description: Список товаров на складе
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   toode_id:
 *                     type: integer
 *                   nimetus:
 *                     type: string
 *                   kirjaldus:
 *                     type: string
 *                   status_id:
 *                     type: integer
 *                   image:
 *                     type: string
 *                   hind:
 *                     type: number
 *       500:
 *         description: Ошибка при получении данных
 */

router.get("/laos", toodeController.getToodedLaos);

/**
 * @swagger
 * /api/toode:
 *   post:
 *     summary: Создать новый товар с изображением (только для администратора или работника)
 *     tags: [Toode]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nimetus
 *               - status_id
 *               - hind
 *             properties:
 *               nimetus:
 *                 type: string
 *               kirjaldus:
 *                 type: string
 *               status_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               hind:
 *                 type: number
 *     responses:
 *       201:
 *         description: Товар успешно создан
 */
router.post(
    "/",
    verifyToken,
    isUserOrAdmin,
    upload.single("image"),
    toodeController.createToode
);

/**
 * @swagger
 * /api/toode:
 *   get:
 *     summary: Получить список всех товаров (только для администратора или работника)
 *     tags: [Toode]
 *     responses:
 *       200:
 *         description: Список товаров
 */
router.get("/", verifyToken, isUserOrAdmin, toodeController.getAllTooded);

/**
 * @swagger
 * /api/toode/search:
 *   get:
 *     summary: Поиск товара по наименованию (только для администратора или работника)
 *     tags: [Toode]
 *     parameters:
 *       - name: nimetus
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список найденных товаров
 */
router.get("/search", verifyToken, isUserOrAdmin, toodeController.searchTooded);

/**
 * @swagger
 * /api/toode/{id}:
 *   get:
 *     summary: Получить товар по ID (только для администратора или работника)
 *     tags: [Toode]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Информация о товаре
 *       404:
 *         description: Товар не найден
 */
router.get("/:id", verifyToken, isUserOrAdmin, toodeController.getToodeById);

/**
 * @swagger
 * /api/toode/{id}:
 *   put:
 *     summary: Обновить товар и/или изображение (только для администратора или работника)
 *     tags: [Toode]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nimetus:
 *                 type: string
 *               kirjaldus:
 *                 type: string
 *               status_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               hind:
 *                 type: number
 *     responses:
 *       200:
 *         description: Товар обновлён
 *       404:
 *         description: Товар не найден
 */
router.put(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    upload.single("image"),
    toodeController.updateToode
);

/**
 * @swagger
 * /api/toode/{id}:
 *   delete:
 *     summary: Удалить товар по ID (только для администратора или работника)
 *     tags: [Toode]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Товар успешно удалён
 *       404:
 *         description: Товар не найден
 */
router.delete("/:id", verifyToken, isUserOrAdmin, toodeController.deleteToode);

/**
 * @swagger
 * /api/toode/status/{status_id}:
 *   get:
 *     summary: Получить список товаров по статусу (только для администратора или работника)
 *     tags: [Toode]
 *     parameters:
 *       - name: status_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список товаров с указанным статусом
 *       404:
 *         description: Товары с таким статусом не найдены
 */
router.get(
    "/status/:status_id",
    verifyToken,
    isUserOrAdmin,
    toodeController.getToodedByStatus
);

module.exports = router;
