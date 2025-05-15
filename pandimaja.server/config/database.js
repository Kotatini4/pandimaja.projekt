const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT, // Используем process.env.DB_DIALECT
        pool: {
            max: 10, // Максимальное количество соединений
            min: 0, // Минимальное количество соединений
            acquire: 30000, // Максимальное время в миллисекундах для получения соединения
            idle: 10000, // Максимальное время в миллисекундах, в течение которого соединение может быть в пуле
        },
    }
);

// Подключение к базе данных
sequelize
    .authenticate()
    .then(() => {
        console.log(
            "Connection to the database has been established successfully."
        );
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

module.exports = sequelize;
