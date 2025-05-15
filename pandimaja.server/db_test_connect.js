const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        schema: process.env.DB_SCHEMA,
        logging: console.log, // можно поставить false чтобы не спамило
    }
);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("✅ Подключение к базе прошло успешно!");
    } catch (error) {
        console.error("❌ Ошибка подключения к базе данных:", error);
    } finally {
        await sequelize.close();
    }
}

testConnection();
