const sequelize = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

exports.createKlient = async (req, res) => {
    const { nimi, perekonnanimi, kood, tel, aadres, status } = req.body;

    if (!nimi || !perekonnanimi || !kood) {
        return res
            .status(400)
            .json({ message: "Name, surname and kood are required." });
    }

    // Валидация kood
    if (!/^[1-6][0-9]{10}$/.test(kood)) {
        return res
            .status(400)
            .json({ message: "Kood must be 11 digits and start with 1–6." });
    }

    const genderCode = parseInt(kood[0]);
    const yearPart = kood.substring(1, 3);
    const month = parseInt(kood.substring(3, 5));
    const day = parseInt(kood.substring(5, 7));

    let year;
    if (genderCode === 1 || genderCode === 2) year = 1800 + parseInt(yearPart);
    else if (genderCode === 3 || genderCode === 4)
        year = 1900 + parseInt(yearPart);
    else if (genderCode === 5 || genderCode === 6)
        year = 2000 + parseInt(yearPart);
    else {
        return res
            .status(400)
            .json({ message: "Invalid gender/century code in kood." });
    }

    const dateValid = !isNaN(
        Date.parse(
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
                2,
                "0"
            )}`
        )
    );
    if (!dateValid) {
        return res.status(400).json({ message: "Invalid birthdate in kood." });
    }

    // Проверка телефона
    const cleanTel = !tel || tel.trim() === "" ? null : tel.trim();
    if (cleanTel && !/^\+?[0-9]+$/.test(cleanTel)) {
        return res.status(400).json({
            message:
                "Phone number must contain only digits and optional leading +.",
        });
    }

    try {
        const existingKlient = await models.klient.findOne({ where: { kood } });
        if (existingKlient) {
            return res
                .status(400)
                .json({ message: "Client with this kood already exists." });
        }

        const newKlient = await models.klient.create({
            nimi,
            perekonnanimi,
            kood,
            tel: cleanTel,
            aadres: aadres?.trim() || null,
            status: status || "ACTIVE",
        });

        res.status(201).json(newKlient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating client." });
    }
};

const { Op } = require("sequelize");

exports.getAllKlients = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
        return res
            .status(400)
            .json({ message: "Invalid pagination parameters." });
    }

    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await models.klient.findAndCountAll({
            limit,
            offset,
            order: [["klient_id", "DESC"]],
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
        res.status(500).json({ message: "Error fetching clients." });
    }
};

exports.searchKlients = async (req, res) => {
    const { nimi, perekonnanimi, kood } = req.query;
    const searchTerm = nimi || perekonnanimi || kood;

    try {
        if (!searchTerm) {
            return res.status(400).json({
                message:
                    "Please provide a search parameter (nimi, perekonnanimi, or kood).",
            });
        }

        const klients = await models.klient.findAll({
            where: {
                [Op.or]: [
                    { nimi: { [Op.iLike]: `%${searchTerm}%` } },
                    { perekonnanimi: { [Op.iLike]: `%${searchTerm}%` } },
                    { kood: { [Op.like]: `%${searchTerm}%` } },
                ],
            },
        });

        res.status(200).json(klients);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while searching for clients.",
        });
    }
};

exports.getKlientById = async (req, res) => {
    const { id } = req.params;
    try {
        const klient = await models.klient.findByPk(id);
        if (!klient) {
            return res.status(404).json({ message: "Client not found." });
        }
        res.status(200).json(klient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching client." });
    }
};

exports.updateKlient = async (req, res) => {
    const { id } = req.params;
    const { nimi, perekonnanimi, tel, aadres, status, kood } = req.body;

    try {
        const klient = await models.klient.findByPk(id);
        if (!klient) {
            return res.status(404).json({ message: "Client not found." });
        }

        if (kood) {
            if (!/^[1-6][0-9]{10}$/.test(kood)) {
                return res.status(400).json({
                    message: "Kood must be 11 digits and start with 1–6.",
                });
            }

            const genderCode = parseInt(kood[0]);
            const yearPart = kood.substring(1, 3);
            const month = parseInt(kood.substring(3, 5));
            const day = parseInt(kood.substring(5, 7));

            let year;
            if (genderCode === 1 || genderCode === 2)
                year = 1800 + parseInt(yearPart);
            else if (genderCode === 3 || genderCode === 4)
                year = 1900 + parseInt(yearPart);
            else if (genderCode === 5 || genderCode === 6)
                year = 2000 + parseInt(yearPart);
            else {
                return res
                    .status(400)
                    .json({ message: "Invalid gender/century code in kood." });
            }

            const dateValid = !isNaN(
                Date.parse(
                    `${year}-${String(month).padStart(2, "0")}-${String(
                        day
                    ).padStart(2, "0")}`
                )
            );
            if (!dateValid) {
                return res
                    .status(400)
                    .json({ message: "Invalid birthdate in kood." });
            }

            const existing = await models.klient.findOne({ where: { kood } });
            if (existing && existing.klient_id !== klient.klient_id) {
                return res.status(400).json({
                    message: "Another client with this kood already exists.",
                });
            }

            klient.kood = kood;
        }

        if (nimi) klient.nimi = nimi;
        if (perekonnanimi) klient.perekonnanimi = perekonnanimi;

        const cleanTel = !tel || tel.trim() === "" ? null : tel.trim();
        if (cleanTel && !/^\+?[0-9]+$/.test(cleanTel)) {
            return res.status(400).json({
                message:
                    "Phone number must contain only digits and optional leading +.",
            });
        }
        klient.tel = cleanTel;

        if (aadres !== undefined) klient.aadres = aadres?.trim() || null;
        if (status) klient.status = status;

        await klient.save();

        res.status(200).json({
            message: "Client updated successfully.",
            klient,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating client." });
    }
};

exports.autocompleteKlients = async (req, res) => {
    const { search } = req.query;
    if (!search) {
        return res.status(400).json({ message: "Search query is required." });
    }

    try {
        const results = await models.klient.findAll({
            where: {
                [Op.or]: [
                    { klient_id: isNaN(search) ? -1 : parseInt(search) },
                    { nimi: { [Op.iLike]: `%${search}%` } },
                    { perekonnanimi: { [Op.iLike]: `%${search}%` } },
                    { kood: { [Op.iLike]: `%${search}%` } },
                ],
            },
            limit: 10,
        });

        res.json(results);
    } catch (err) {
        console.error("Autocomplete klient search error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
