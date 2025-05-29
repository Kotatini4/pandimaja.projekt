// lepingRoutes.js
const express = require("express");
const router = express.Router();
const lepingController = require("../controllers/lepingController");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Leping
 *   description: Contract management
 */

/**
 * @swagger
 * /api/leping:
 *   post:
 *     summary: Create a new contract
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
 *               - date
 *               - leping_type
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
 *                 enum: [pant, ost, väljaost, müük]
 *     responses:
 *       201:
 *         description: Contract created
 */
router.post("/", verifyToken, isUserOrAdmin, lepingController.createLeping);

/**
 * @swagger
 * /api/leping:
 *   get:
 *     summary: Get all contracts
 *     tags: [Leping]
 *     responses:
 *       200:
 *         description: List of contracts
 */
router.get("/", verifyToken, isUserOrAdmin, lepingController.getAllLepingud);

/**
 * @swagger
 * /api/leping/{id}:
 *   get:
 *     summary: Get contract by ID
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contract data
 *       404:
 *         description: Not found
 */
router.get("/:id", verifyToken, isUserOrAdmin, lepingController.getLepingById);

/**
 * @swagger
 * /api/leping/{id}:
 *   put:
 *     summary: Update contract by ID
 *     tags: [Leping]
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
 *               date:
 *                 type: string
 *               pant_hind:
 *                 type: number
 *     responses:
 *       200:
 *         description: Contract updated
 *       404:
 *         description: Not found
 */
router.put("/:id", verifyToken, isUserOrAdmin, lepingController.updateLeping);

/**
 * @swagger
 * /api/leping/{id}:
 *   delete:
 *     summary: Delete contract by ID
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Contract deleted
 *       404:
 *         description: Not found
 */
router.delete(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    lepingController.deleteLeping
);

module.exports = router;
