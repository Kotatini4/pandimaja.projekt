const express = require("express");
const router = express.Router();
const toodeController = require("../controllers/toodeController");
const multer = require("multer");
const path = require("path");
const { verifyToken, isUserOrAdmin } = require("../middleware/authMiddleware");

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
 * /api/toode/{id}/buyout:
 *   post:
 *     summary: Mark product as bought out (update status)
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product status updated to 'bought out'
 *       404:
 *         description: Product not found
 */
router.post(
    "/:id/buyout",
    verifyToken,
    isUserOrAdmin,
    toodeController.buyoutToode
);


/**
 * @swagger
 * /api/toode/autocomplete:
 *   get:
 *     summary: Autocomplete products by ID, name or description
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword to match against ID, name, or description
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional contract type to filter products
 *     responses:
 *       200:
 *         description: Matched products
 */
router.get(
    "/autocomplete",
    verifyToken,
    isUserOrAdmin,
    toodeController.autocompleteTooded
);



/**
 * @swagger
 * tags:
 *   name: Toode
 *   description: API for managing products
 */

/**
 * @swagger
 * /api/toode/laos:
 *   get:
 *     summary: Get all products with status "Laos"
 *     tags: [Toode]
 *     responses:
 *       200:
 *         description: List of available products
 */
router.get("/laos", toodeController.getToodedLaos);

/**
 * @swagger
 * /api/toode:
 *   post:
 *     summary: Create a new product (requires auth)
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
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
 *               kirjeldus:
 *                 type: string
 *               status_id:
 *                 type: integer
 *               hind:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
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
 *     summary: Get paginated list of products
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated product list
 */
router.get("/", verifyToken, isUserOrAdmin, toodeController.getAllTooded);

/**
 * @swagger
 * /api/toode/search:
 *   get:
 *     summary: Search products by name, description or status
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: nimetus
 *         in: query
 *         schema:
 *           type: string
 *       - name: kirjeldus
 *         in: query
 *         schema:
 *           type: string
 *       - name: status_id
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", verifyToken, isUserOrAdmin, toodeController.searchTooded);

/**
 * @swagger
 * /api/toode/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Not found
 */
router.get("/:id", verifyToken, isUserOrAdmin, toodeController.getToodeById);

/**
 * @swagger
 * /api/toode/{id}:
 *   patch:
 *     summary: Update product partially
 *     tags: [Toode]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nimetus:
 *                 type: string
 *               kirjeldus:
 *                 type: string
 *               status_id:
 *                 type: integer
 *               hind:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Not found
 */
router.patch(
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
 *     summary: Delete product by ID
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", verifyToken, isUserOrAdmin, toodeController.deleteToode);

/**
 * @swagger
 * /api/toode/status/{status_id}:
 *   get:
 *     summary: Get products by status
 *     tags: [Toode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products with given status
 *       404:
 *         description: Not found
 */
router.get(
    "/status/:status_id",
    verifyToken,
    isUserOrAdmin,
    toodeController.getToodedByStatus
);

module.exports = router;
