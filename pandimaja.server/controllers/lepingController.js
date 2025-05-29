const sequelize = require("../config/database");
const initModels = require("../models/init-models");

const models = initModels(sequelize);

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
        müügihind,
        leping_type,
    } = req.body;

    try {
        const klient = await models.klient.findByPk(klient_id);
        if (!klient)
            return res.status(404).json({ message: "Client not found." });

        if (klient.status.toLowerCase() === "blocked") {
            return res
                .status(403)
                .json({
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
            müügihind,
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
    try {
        const lepingud = await models.leping.findAll({
            include: [
                {
                    model: models.klient,
                    attributes: ["nimi", "perekonnanimi", "kood"],
                },
                {
                    model: models.toode,
                    attributes: ["nimetus", "image", "hind"],
                },
                {
                    model: models.tootaja,
                    attributes: ["nimi", "perekonnanimi"],
                },
            ],
        });
        res.status(200).json(lepingud);
    } catch (err) {
        console.error(err);
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
