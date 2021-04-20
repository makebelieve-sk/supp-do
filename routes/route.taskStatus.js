// Маршруты для раздела "Состояния заявок"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");
const TaskStatus = require("../schemes/TaskStatus");

const router = Router();

// Валидация полей раздела "Состояния заявок"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({ min: 1, max: 255 }),
    check("color", "Поле 'Цвет' должно содержать 7 символов")
        .isString()
        .notEmpty()
        .isLength({ min: 7, max: 7 }),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({ max: 255 }),
    check("isFinish", "Поле 'Завершено' должно быть булевым").isBoolean()
];

// Возвращает запись по коду
router.get("/taskStatus/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        let item, isNewItem = true;

        if (_id === "-1") {
            item = new TaskStatus({name: "", color: "#FFFFFF", notes: "", isFinish: false});    // Создание новой записи
        } else {
            item = await TaskStatus.findById({_id});    // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не существует`});

        res.status(201).json({isNewItem, task: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/taskStatus", async (req, res) => {
    try {
        const items = await TaskStatus.find({});    // Получаем все записи раздела "Состояния заявок"

        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о состоянии заявок"})
    }
});

// Сохраняет новую запись
router.post("/taskStatus", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {name, color, notes, isFinish} = req.body;    // Получаем объект записи с фронтенда

        let item = await TaskStatus.findOne({name});    // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item) return res.status(400).json({message: `Запись с именем ${name} уже существует`});

        // Создаем новый экземпляр записи
        item = new TaskStatus({name: name, color: color, notes: notes, isFinish: isFinish});

        await item.save();  // Сохраняем запись в базе данных

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/taskStatus", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({errors: errors.array(), message: "Некоректные данные при создании записи"});

        const {_id, name, color, notes, isFinish} = req.body;   // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await TaskStatus.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});

        item.name = name;
        item.color = color;
        item.notes = notes;
        item.isFinish = isFinish;

        await item.save();  // Сохраняем запись в базу данных

        res.status(201).json({message: "Запись о состоянии заявки сохранена", item});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи о состоянии заявки"})
    }
});

// Удаляет запись
router.delete("/taskStatus/:id", async (req, res) => {
    const _id = req.params.id;  // Получение id записи

    try {
        await TaskStatus.deleteOne({_id});  // Удаление записи из базы данных по id записи

        res.status(201).json({message: "Запись о состоянии заявки успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;