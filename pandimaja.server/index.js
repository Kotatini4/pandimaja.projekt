const express = require("express");
require("dotenv").config();
const app = express();

const sequelize = require("./config/database");
const initModels = require("./models/init-models");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const authRoutes = require("./routes/authRoutes");
const tootajaRoutes = require("./routes/tootajaRoutes");
const klientRoutes = require("./routes/klientRoutes");
const toodeRoutes = require("./routes/toodeRoutes");
const statusToodeRoutes = require("./routes/statusToodeRoutes");
const lepingRoutes = require("./routes/lepingRoutes");
const models = initModels(sequelize);

// Middleware
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("public/uploads"));

// Маршруты
app.use("/api/leping", lepingRoutes);
app.use("/api/status_toode", statusToodeRoutes);
app.use("/api/toode", toodeRoutes);
app.use("/api/klient", klientRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tootaja", tootajaRoutes);

// Базовый обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Порт
const PORT = process.env.PORT || 3000;

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

module.exports = { app, models };
