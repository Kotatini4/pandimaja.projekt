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

    // Isikukood: 11 digits, valid structure and date
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

    // Password check
    if (pass.length < 6) {
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters long." });
    }

    // Role check
    if (![1, 2, 3].includes(role_id)) {
        return res.status(400).json({
            message:
                "Invalid role_id. Only 1 (admin), 2 (user), or 3 (NA) allowed.",
        });
    }

    // Phone validation
    const cleanTel = !tel || tel.trim() === "" ? null : tel.trim();
    if (cleanTel && !/^\+?[0-9]+$/.test(cleanTel)) {
        return res.status(400).json({
            message:
                "Phone number must contain only digits and optional leading +.",
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
            tel: cleanTel,
            aadres: aadres?.trim() || null,
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
            {
                userId: user.tootaja_id,
                roleId: user.role_id,
                kood: user.kood,
                name: user.nimi,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
        );

        res.json({
            token,
            user: {
                kood: user.kood,
                name: user.nimi,
                perekonnanimi: user.perekonnanimi,
                roleId: user.role_id,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};
