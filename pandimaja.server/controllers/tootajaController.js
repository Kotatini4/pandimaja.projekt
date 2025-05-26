const sequelize = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

const bcrypt = require("bcrypt");

exports.updateTootaja = async (req, res) => {
    const { id } = req.params;
    const { nimi, perekonnanimi, tel, aadres, role_id, pass, kood } = req.body;

    try {
        const tootaja = await models.tootaja.findByPk(id);

        if (!tootaja) {
            return res.status(404).json({ message: "Employee not found." });
        }

        // Проверка и установка kood
        if (kood) {
            if (kood.length !== 11 || !/^[0-9]+$/.test(kood)) {
                return res
                    .status(400)
                    .json({ message: "Kood must be exactly 11 digits." });
            }

            // Проверка уникальности
            const existing = await models.tootaja.findOne({
                where: { kood },
            });

            if (existing && existing.tootaja_id !== tootaja.tootaja_id) {
                return res.status(400).json({
                    message: "Another user with this kood already exists.",
                });
            }

            tootaja.kood = kood;
        }

        // Проверка и установка пароля
        if (pass) {
            if (pass.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters long.",
                });
            }
            const hashedPassword = await bcrypt.hash(pass, 10);
            tootaja.pass = hashedPassword;
        }

        // Проверка и установка роли
        if (role_id) {
            if (![1, 2, 3].includes(role_id)) {
                return res
                    .status(400)
                    .json({ message: "role_id must be 1, 2 or 3." });
            }
            tootaja.role_id = role_id;
        }

        // Проверка телефона
        const cleanTel = !tel || tel.trim() === "" ? null : tel.trim();
        if (cleanTel && !/^\+?[0-9]+$/.test(cleanTel)) {
            return res.status(400).json({
                message:
                    "Phone number must contain only digits and optional leading +.",
            });
        }

        // Установка остальных полей
        if (nimi) tootaja.nimi = nimi;
        if (perekonnanimi) tootaja.perekonnanimi = perekonnanimi;
        tootaja.tel = cleanTel;
        if (aadres !== undefined) {
            tootaja.aadres = aadres?.trim() || null;
        }

        await tootaja.save();

        res.status(200).json({
            message: "Employee updated successfully.",
            tootaja,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while updating the employee.",
        });
    }
};

exports.getAllTootajad = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res
            .status(400)
            .json({ message: "Invalid pagination parameters." });
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await models.tootaja.findAndCountAll({
            attributes: [
                "tootaja_id",
                "nimi",
                "perekonnanimi",
                "kood",
                "tel",
                "aadres",
                "role_id",
            ],
            limit,
            offset,
            order: [["tootaja_id", "ASC"]],
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
        res.status(500).json({
            message: "Server error while fetching employees.",
        });
    }
};

exports.deleteTootaja = async (req, res) => {
    const { id } = req.params;

    try {
        const worker = await models.tootaja.findByPk(id);

        if (!worker) {
            return res.status(404).json({ message: "Employee not found." });
        }

        await worker.destroy();

        res.status(200).json({ message: "Employee deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during deletion." });
    }
};
