const sequelize = require("../config/database");
const initModels = require("../models/init-models");

const models = initModels(sequelize);

// Создать новый статус
exports.createStatus = async (req, res) => {
    const { nimetus } = req.body;

    if (!nimetus) {
        return res
            .status(400)
            .json({ message: "Field 'nimetus' is required." });
    }

    try {
        const newStatus = await models.status_toode.create({ nimetus });
        res.status(201).json(newStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating status." });
    }
};

// Получить все статусы
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await models.status_toode.findAll();
        res.status(200).json(statuses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching statuses." });
    }
};

// Получить статус по ID
exports.getStatusById = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await models.status_toode.findByPk(id);
        if (!status) {
            return res.status(404).json({ message: "Status not found." });
        }
        res.status(200).json(status);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching status." });
    }
};

// Обновить статус по ID
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { nimetus } = req.body;

    try {
        const status = await models.status_toode.findByPk(id);

        if (!status) {
            return res.status(404).json({ message: "Status not found." });
        }

        if (nimetus) status.nimetus = nimetus;

        await status.save();

        res.status(200).json({
            message: "Status updated successfully.",
            status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating status." });
    }
};

// Удалить статус по ID
exports.deleteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await models.status_toode.findByPk(id);

        if (!status) {
            return res.status(404).json({ message: "Status not found." });
        }

        await status.destroy();

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting status." });
    }
};
