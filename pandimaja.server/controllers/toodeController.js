const sequelize = require("../config/database");
const initModels = require("../models/init-models");
const { Op } = require("sequelize");

const models = initModels(sequelize); // импорт всех моделей

exports.createToode = async (req, res) => {
    const { nimetus, kirjeldus, status_id, hind } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!nimetus || !status_id || hind === undefined) {
        return res.status(400).json({
            message: "Required fields missing (nimetus, status_id, hind).",
        });
    }

    try {
        const newToode = await models.toode.create({
            nimetus,
            kirjeldus,
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

exports.autocompleteTooded = async (req, res) => {
    const { search, type } = req.query;

    if (!search) {
        return res.status(400).json({ message: "Search query is required." });
    }

    try {
        const whereCondition = {
            [Op.or]: [
                { toode_id: isNaN(search) ? -1 : parseInt(search) },
                { nimetus: { [Op.iLike]: `%${search}%` } },
                { kirjeldus: { [Op.iLike]: `%${search}%` } },
            ],
        };

        if (type === "pant" || type === "ost") {
            whereCondition.status_id = 5;
        } else if (type === "müük") {
            whereCondition.status_id = 1;
        }

        const results = await models.toode.findAll({
            where: whereCondition,
            limit: 10,
        });

        res.json(results);
    } catch (err) {
        console.error("Autocomplete search error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllTooded = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res.status(400).json({ message: "Invalid pagination parameters." });
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
    const { nimetus, kirjeldus, status_id } = req.query;

    try {
        const filters = [];

        if (nimetus) {
            filters.push({ nimetus: { [Op.iLike]: `%${nimetus}%` } });
        }

        if (kirjeldus) {
            filters.push({ kirjeldus: { [Op.iLike]: `%${kirjeldus}%` } });
        }

        if (status_id) {
            filters.push({ status_id });
        }

        if (filters.length === 0) {
            return res.status(400).json({
                message: "Please provide at least one search parameter (nimetus, kirjeldus, status_id).",
            });
        }

        const tooded = await models.toode.findAll({
            where: {
                [Op.or]: filters,
            },
        });

        res.status(200).json(tooded);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while searching for products." });
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
    const { nimetus, kirjeldus, status_id, hind } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const toode = await models.toode.findByPk(id);
        if (!toode) {
            return res.status(404).json({ message: "Product not found." });
        }

        if (nimetus !== undefined) toode.nimetus = nimetus;
        if (kirjeldus !== undefined) toode.kirjeldus = kirjeldus;
        if (status_id !== undefined) toode.status_id = status_id;
        if (hind !== undefined) toode.hind = hind;
        if (image) toode.image = image;

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
            return res.status(404).json({ message: "No products found with this status." });
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
        console.error("Error:", err);
        res.status(500).json({ message: "Error fetching products with status 'Laos'." });
    }
};

exports.buyoutToode = async (req, res) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();

    try {
        const foundToode = await models.toode.findByPk(id, { transaction });
        if (!foundToode) {
            await transaction.rollback();
            return res.status(404).json({ message: "Product not found." });
        }

        // Статус 4 — выкуплен
        foundToode.status_id = 4;
        await foundToode.save({ transaction });

        const foundLeping = await models.leping.findOne({
            where: { toode_id: id },
            order: [["leping_id", "DESC"]],
            transaction,
        });

        if (foundLeping) {
            foundLeping.date_valja_ostud = new Date();
            foundLeping.leping_type = "väljaost";
            await foundLeping.save({ transaction });
        }

        await transaction.commit();
        res.status(200).json({ message: "Product marked as bought out and contract updated." });
    } catch (error) {
        await transaction.rollback();
        console.error("Buyout error:", error);
        res.status(500).json({ message: "Server error while buying out product." });
    }
};
