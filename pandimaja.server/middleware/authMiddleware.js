const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const initModels = require("../models/init-models");

const models = initModels(sequelize);

const verifyToken = async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(403).send({ message: "No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.roleId = decoded.roleId;
        next();
    } catch {
        return res.status(401).send({ message: "Invalid token." });
    }
};

const isAdmin = async (req, res, next) => {
    if (req.roleId === 1) return next(); // 1 = admin
    return res.status(403).send({ message: "Admin privileges required." });
};

const isUserOrAdmin = async (req, res, next) => {
    if (req.roleId === 1 || req.roleId === 2) return next(); // 1 = admin, 2 = user
    return res.status(403).send({ message: "Access denied." });
};

module.exports = {
    verifyToken,
    isAdmin,
    isUserOrAdmin,
};
