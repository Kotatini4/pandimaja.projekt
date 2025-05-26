const sequelize = require("../config/database");
const initModels = require("../models/init-models");
const { Op } = require("sequelize");

const models = initModels(sequelize);

exports.createToode = async (req, res) => {
    const { nimetus, kirjaldus, status_id, hind } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nimetus || !status_id || hind === undefined) {
        return res.status(400).json({
            message: "Required fields missing (nimetus, status_id, hind).",
        });
    }

    try {
        const newToode = await models.toode.create({
            nimetus,
            kirjaldus,
            status_id,
            image,
            hind,
        });

        res.status(201).json(newToode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product." });
    }
};

exports.getAllTooded = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res
            .status(400)
            .json({ message: "Invalid pagination parameters." });
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await models.toode.findAndCountAll({
            limit,
            offset,
            order: [["toode_id", "ASC"]],
        });

        res.status(200).json({
            total: count,
            page,
            pageSize: limit,
            totalPages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products." });
    }
};

exports.searchTooded = async (req, res) => {
    const { q, status_id, minPrice, maxPrice } = req.query;

    const whereClause = {};

    if (q && typeof q === "string") {
        whereClause[Op.or] = [
            { nimetus: { [Op.iLike]: `%${q.trim()}%` } },
            { kirjeldus: { [Op.iLike]: `%${q.trim()}%` } },
        ];
    }

    if (status_id) {
        whereClause.status_id = status_id;
    }

    if (minPrice || maxPrice) {
        whereClause.hind = {};
        if (minPrice) whereClause.hind[Op.gte] = Number(minPrice);
        if (maxPrice) whereClause.hind[Op.lte] = Number(maxPrice);
    }

    try {
        const result = await models.toode.findAll({ where: whereClause });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error while searching products." });
    }
};

exports.getToodeById = async (req, res) => {
    const { id } = req.params;

    try {
        const toode = await models.toode.findByPk(id);
        if (!toode) {
            return res.status(404).json({ message: "Product not found." });
        }
        res.status(200).json(toode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching product." });
    }
};

exports.updateToode = async (req, res) => {
    const { id } = req.params;
    const { nimetus, kirjaldus, status_id, hind } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const toode = await models.toode.findByPk(id);
        if (!toode) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (nimetus) toode.nimetus = nimetus;
        if (kirjaldus) toode.kirjaldus = kirjaldus;
        if (status_id) toode.status_id = status_id;
        if (hind !== undefined) toode.hind = hind;
        if (image) toode.image = image; // Только если файл отправлен

        await toode.save();

        res.status(200).json({
            message: "Product updated successfully.",
            toode,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product." });
    }
};

exports.deleteToode = async (req, res) => {
    const { id } = req.params;

    try {
        const toode = await models.toode.findByPk(id);

        if (!toode) {
            return res.status(404).json({ message: "Product not found." });
        }

        await toode.destroy();

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product." });
    }
};

exports.getToodedByStatus = async (req, res) => {
    const { status_id } = req.params;

    if (!status_id) {
        return res.status(400).json({ message: "Status ID is required." });
    }

    try {
        const tooded = await models.toode.findAll({
            where: {
                status_id: status_id,
            },
        });

        if (!tooded || tooded.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found with this status." });
        }

        res.status(200).json(tooded);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching products by status." });
    }
};

exports.getToodedLaos = async (req, res) => {
    try {
        const tooded = await models.toode.findAll({
            include: [
                {
                    model: models.status_toode,
                    as: "status",
                    where: { nimetus: "Laos" },
                    attributes: [],
                },
            ],
        });

        res.status(200).json(tooded);
    } catch (err) {
        console.error("Ошибка:", err);
        res.status(500).json({
            message: "Error fetching products with status 'Laos'.",
        });
    }
};
