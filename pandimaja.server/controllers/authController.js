const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const initModels = require("../models/init-models");

const models = initModels(sequelize);

exports.register = async (req, res) => {
    const { nimi, perekonnanimi, kood, tel, aadres, pass, role_id } = req.body;

    if (!nimi || !perekonnanimi || !kood || !pass || !role_id) {
        return res
            .status(400)
            .json({ message: "Please fill all required fields." });
    }

    // Проверка длины kood
    if (kood.length !== 11) {
        return res
            .status(400)
            .json({ message: "Kood must be exactly 11 characters long." });
    }

    // Проверка длины пароля
    if (pass.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long." });
    }

    // Проверка допустимых ролей
    if (![1, 2].includes(role_id)) {
        return res.status(400).json({
            message: "Invalid role_id. Only 1 (admin) or 2 (user) allowed.",
        });
    }

    try {
        const existingUser = await models.tootaja.findOne({ where: { kood } });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User with this kood already exists." });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);

        const newUser = await models.tootaja.create({
            nimi,
            perekonnanimi,
            kood,
            tel,
            aadres,
            pass: hashedPassword,
            role_id,
        });

        res.status(201).json({
            message: "User registered successfully!",
            userId: newUser.tootaja_id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during registration." });
    }
};

exports.login = async (req, res) => {
    const { kood, pass } = req.body;

    if (!kood || !pass) {
        return res.status(400).json({ message: "Please fill all fields." });
    }

    try {
        const user = await models.tootaja.findOne({ where: { kood } });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Проверка если работник не активный (NA роль)
        if (user.role_id === 3) {
            return res.status(403).json({ message: "User is deactivated." });
        }

        const isPasswordValid = await bcrypt.compare(pass, user.pass);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { userId: user.tootaja_id, roleId: user.role_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};
