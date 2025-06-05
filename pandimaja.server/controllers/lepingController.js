const sequelize = require("../config/database");
const initModels = require("../models/init-models");

const models = initModels(sequelize);
const { Op } = require("sequelize");
// Create new contract
exports.createLeping = async (req, res) => {
    const {
        klient_id,
        toode_id,
        tootaja_id,
        date,
        date_valja_ostud,
        pant_hind,
        valja_ostud_hind,
        ostuhind,
        muugihind,
        leping_type,
    } = req.body;

    try {
        const klient = await models.klient.findByPk(klient_id);
        if (!klient)
            return res.status(404).json({ message: "Client not found." });

        if (klient.status.toLowerCase() === "blocked") {
            return res.status(403).json({
                message: "Cannot create contract: client is blocked.",
            });
        }

        const newLeping = await models.leping.create({
            klient_id,
            toode_id,
            tootaja_id,
            date,
            date_valja_ostud,
            pant_hind,
            valja_ostud_hind,
            ostuhind,
            muugihind,
            leping_type,
        });

        res.status(201).json(newLeping);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating contract." });
    }
};

// Get all contracts
exports.getAllLepingud = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await models.leping.findAndCountAll({
            limit,
            offset,
            distinct: true, // обязательно при использовании include
            include: [
                {
                    model: models.klient,
                    as: "klient",
                    attributes: ["nimi", "perekonnanimi", "kood"],
                },
                {
                    model: models.toode,
                    as: "toode",
                    attributes: ["nimetus", "image", "hind"],
                },
                {
                    model: models.tootaja,
                    as: "tootaja",
                    attributes: ["nimi", "perekonnanimi"],
                },
            ],
            order: [["leping_id", "DESC"]],
        });

        res.status(200).json({
            data: rows,
            total: count,
        });
    } catch (err) {
        console.error("Error fetching contracts:", err);
        res.status(500).json({ message: "Error fetching contracts." });
    }
};

// Get contract by ID
exports.getLepingById = async (req, res) => {
    try {
        const leping = await models.leping.findByPk(req.params.id);
        if (!leping)
            return res.status(404).json({ message: "Contract not found." });
        res.status(200).json(leping);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching contract." });
    }
};

// Update contract
exports.updateLeping = async (req, res) => {
    try {
        const leping = await models.leping.findByPk(req.params.id);
        if (!leping)
            return res.status(404).json({ message: "Contract not found." });

        await leping.update(req.body);
        res.status(200).json({
            message: "Contract updated successfully.",
            leping,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating contract." });
    }
};

// Delete contract
exports.deleteLeping = async (req, res) => {
    try {
        const leping = await models.leping.findByPk(req.params.id);
        if (!leping)
            return res.status(404).json({ message: "Contract not found." });

        await leping.destroy();
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting contract." });
    }
};

// Search contracts
exports.searchLepingud = async (req, res) => {
    const { search, leping_type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const whereClause = {};
        if (leping_type) {
            whereClause.leping_type = {
                [Op.iLike]: `%${leping_type}%`,
            };
        }

        const klientWhere = search
            ? {
                  [Op.or]: [
                      { nimi: { [Op.iLike]: `%${search}%` } },
                      { perekonnanimi: { [Op.iLike]: `%${search}%` } },
                      { kood: { [Op.like]: `%${search}%` } },
                  ],
              }
            : undefined;

        const { count, rows } = await models.leping.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            include: [
                {
                    model: models.klient,
                    as: "klient",
                    attributes: ["nimi", "perekonnanimi", "kood"],
                    where: klientWhere,
                    required: true,
                },
                {
                    model: models.toode,
                    as: "toode",
                    attributes: ["nimetus", "image", "hind"],
                },
                {
                    model: models.tootaja,
                    as: "tootaja",
                    attributes: ["nimi", "perekonnanimi"],
                },
            ],
        });

        res.status(200).json({
            data: rows,
            total: count,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error searching contracts." });
    }
};

exports.getPrintableLeping = async (req, res) => {
    const { id } = req.params;

    try {
        const leping = await models.leping.findByPk(id, {
            include: [
                {
                    model: models.klient,
                    as: "klient",
                    attributes: [
                        "klient_id",
                        "nimi",
                        "perekonnanimi",
                        "kood",
                        "tel",
                        "aadres",
                    ],
                },
                {
                    model: models.toode,
                    as: "toode",
                    attributes: ["toode_id", "nimetus", "hind"],
                },
            ],
        });

        if (!leping) {
            return res.status(404).json({ message: "Leping not found" });
        }

        const response = {
            leping_id: leping.leping_id,
            date: leping.date,
            date_valja_ostud: leping.date_valja_ostud,
            pant_hind: leping.pant_hind,
            valja_ostud_hind: leping.valja_ostud_hind,
            ostuhind: leping.ostuhind,
            muugihind: leping.muugihind,
            leping_type: leping.leping_type,
            klient: {
                klient_id: leping.klient.klient_id,
                nimi: leping.klient.nimi,
                perekonnanimi: leping.klient.perekonnanimi,
                kood: leping.klient.kood,
                tel: leping.klient.tel,
                aadres: leping.klient.aadres,
            },
            toode: {
                toode_id: leping.toode.toode_id,
                nimetus: leping.toode.nimetus,
                hind: leping.toode.hind,
            },
        };

        res.json(response);
    } catch (error) {
        console.error("Error fetching printable contract:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
