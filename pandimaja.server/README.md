![TalTech Logo](images/tal-tech.png)

# TALLINNA TEHNIKAÜLIKOOL

### INSENERITEADUSKOND

**Virumaa kolledž**  
**RAM0541 Veebiprogrammeerimine** _(N. Ivleva)_

---

## 📚 Проект: REST API — Pandimaja (Ломбард)

API-сервер для управления клиентами, товарами, сотрудниками и договорами в системе ломбарда.

---

### 🛠️ Используемые технологии

-   **Node.js** — среда выполнения JavaScript
-   **Express.js** — фреймворк для создания REST API
-   **Sequelize** — ORM для работы с PostgreSQL
-   **PostgreSQL** — реляционная база данных
-   **JWT** — авторизация пользователей
-   **Swagger** — документация API
-   **Multer** — загрузка изображений
-   **dotenv** — переменные окружения

---

### 🗂️ Структура проекта

📁 **controllers**  
  📄 `authController.js`, `klientController.js`, `toodeController.js`, `tootajaController.js`, `lepingController.js`

📁 **routes**  
  📄 `authRoutes.js`, `klientRoutes.js`, `toodeRoutes.js`, `tootajaRoutes.js`, `lepingRoutes.js`

📁 **models**  
  📄 `init-models.js` — инициализация моделей  
  📄 модели: `klient.js`, `toode.js`, `leping.js`, `tootaja.js`, `status_toode.js`, `role.js`

📁 **config**  
  📄 `database.js` — подключение к PostgreSQL

📁 **public/uploads**  
  📄 Хранилище загруженных изображений товаров

📄 `index.js` — основной файл сервера  
📄 `swagger.js` — генерация Swagger-документации  
📄 `package.json`, `.env`, `README.md`

---

### 🚀 Запуск проекта

```bash

node index.js                       # Запуск сервера (по умолчанию на http://localhost:3000)

http://localhost:3000/api-docs/     # Документация API для проекта Pandimaja
```

Логирование для тестов: используется ID код работника и пароль.

login:38303123718
pass: admin123
