const express = require("express");
const router = express.Router();
const lepingController = require("../controllers/lepingController");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Leping
 *   description: Contract (Leping) management
 */

/**
 * @swagger
 * /api/leping:
 *   post:
 *     summary: Create a new contract
 *     tags: [Leping]
 *     security:
 *       - bearerAuth: []
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
 *               - pant_hind
 *               - müügihind
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
 *     responses:
 *       201:
 *         description: Contract successfully created
 *       403:
 *         description: Blocked client or forbidden
 *       500:
 *         description: Server error
 */
router.post("/", verifyToken, isUserOrAdmin, lepingController.createLeping);

/**
 * @swagger
 * /api/leping:
 *   get:
 *     summary: Get all contracts
 *     tags: [Leping]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contracts
 *       500:
 *         description: Error fetching contracts
 */
router.get("/", verifyToken, isUserOrAdmin, lepingController.getAllLepingud);

/**
 * @swagger
 * /api/leping/{id}:
 *   get:
 *     summary: Get contract by ID
 *     tags: [Leping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contract found
 *       404:
 *         description: Contract not found
 */
router.get("/:id", verifyToken, isUserOrAdmin, lepingController.getLepingById);

/**
 * @swagger
 * /api/leping/{id}:
 *   put:
 *     summary: Update contract
 *     tags: [Leping]
 *     security:
 *       - bearerAuth: []
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
 *               toode_id:
 *                 type: integer
 *               tootaja_id:
 *                 type: integer
 *               pant_hind:
 *                 type: number
 *               valja_ostud_hind:
 *                 type: number
 *               müügihind:
 *                 type: number
 *               leping_type:
 *                 type: string
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
 *     summary: Delete contract
 *     tags: [Leping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted successfully
 *       404:
 *         description: Contract not found
 */
router.delete(
    "/:id",
    verifyToken,
    isUserOrAdmin,
    lepingController.deleteLeping
);

module.exports = router;
