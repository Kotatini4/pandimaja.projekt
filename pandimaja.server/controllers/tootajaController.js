const sequelize = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

exports.updateTootaja = async (req, res) => {
    const { id } = req.params;
    const { nimi, perekonnanimi, tel, aadres, role_id } = req.body;

    try {
        const tootaja = await models.tootaja.findByPk(id);

        if (!tootaja) {
            return res.status(404).json({ message: "Employee not found." });
        }

        if (nimi) tootaja.nimi = nimi;
        if (perekonnanimi) tootaja.perekonnanimi = perekonnanimi;
        if (tel) tootaja.tel = tel;
        if (aadres) tootaja.aadres = aadres;
        if (role_id) {
            if (![1, 2, 3].includes(role_id)) {
                return res
                    .status(400)
                    .json({ message: "role_id must be 1, 2 or 3." });
            }
            tootaja.role_id = role_id;
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
    try {
        const workers = await models.tootaja.findAll({
            attributes: [
                "tootaja_id",
                "nimi",
                "perekonnanimi",
                "kood",
                "tel",
                "aadres",
                "role_id",
            ],
            order: [["tootaja_id", "ASC"]],
        });

        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error while fetching employees.",
        });
    }
};
