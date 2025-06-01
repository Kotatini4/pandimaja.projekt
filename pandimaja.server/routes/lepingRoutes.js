// lepingRoutes.js
const express = require("express");
const router = express.Router();
const lepingController = require("../controllers/lepingController");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/leping/print/{id}:
 *   get:
 *     summary: Get printable version of contract by ID (no auth)
 *     tags: [Leping]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: HTML printable contract
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       404:
 *         description: Not found
 */
router.get("/print/:id", lepingController.getPrintableLeping);


/**
 * @swagger
 * /api/leping/search:
 *   get:
 *     summary: Search contracts by client name, ID code, or contract type
 *     tags: [Leping]
 *     parameters:
 *       - name: klient_nimi
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: klient_perekonnanimi
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: klient_kood
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *       - name: leping_type
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pant, ost, väljaost, müük]
 *     responses:
 *       200:
 *         description: Filtered list of contracts
 */
router.get(
    "/search",
    verifyToken,
    isUserOrAdmin,
    lepingController.searchLepingud
);


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
 *               muugihind:
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
