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
            tel,
            aadres,
            status: status || "ACTIVE",
        });

        res.status(201).json(newKlient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating client." });
    }
};

exports.getAllKlients = async (req, res) => {
    try {
        const klients = await models.klient.findAll();
        res.status(200).json(klients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching clients." });
    }
};

const { Op } = require("sequelize"); // Импортируем Op для операторов like

exports.searchKlients = async (req, res) => {
    const { nimi, perekonnanimi, kood } = req.query;

    try {
        const whereClause = {};

        if (nimi) {
            whereClause.nimi = { [Op.iLike]: `%${nimi}%` }; // регистронезависимый поиск
        }
        if (perekonnanimi) {
            whereClause.perekonnanimi = { [Op.iLike]: `%${perekonnanimi}%` };
        }
        if (kood) {
            whereClause.kood = { [Op.like]: `%${kood}%` }; // коды обычно точные, но можно частично
        }

        if (Object.keys(whereClause).length === 0) {
            return res.status(400).json({
                message:
                    "Please provide at least one search parameter (nimi, perekonnanimi, or kood).",
            });
        }

        const klients = await models.klient.findAll({ where: whereClause });

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
    const { nimi, perekonnanimi, tel, aadres, status } = req.body;

    try {
        const klient = await models.klient.findByPk(id);
        if (!klient) {
            return res.status(404).json({ message: "Client not found." });
        }

        if (nimi) klient.nimi = nimi;
        if (perekonnanimi) klient.perekonnanimi = perekonnanimi;
        if (tel) klient.tel = tel;
        if (aadres) klient.aadres = aadres;
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
