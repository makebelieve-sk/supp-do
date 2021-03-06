// Маршруты для раздела "Профессии"
const {Router} = require("express");
const {check, validationResult} = require("express-validator");

const Profession = require("../schemes/Profession");
const Log = require("../schemes/Log");
const {getUser} = require("./helper");

const router = Router();

// Валидация полей раздела "Профессии"
const checkMiddleware = [
    check("name", "Поле 'Наименование' должно содержать от 1 до 255 символов")
        .isString()
        .notEmpty()
        .isLength({min: 1, max: 255}),
    check("notes", "Поле 'Примечание' не должно превышать 255 символов")
        .isString()
        .isLength({max: 255})
];

/**
 * Функция логирования действий пользователея
 * @param req - объект req запроса
 * @param res - объект res запроса
 * @param action - действие пользователя
 * @param body - удаляемая запись
 * @returns {Promise<*>} - возвращаем промис (сохранение записи в бд)
 */
const logUserActions = async (req, res, action, body = null) => {
    if (!req.cookies) return res.status(500).json({message: "Ошибка чтения файлов cookies"});

    let {name, notes} = req.body;

    if (body) {
        name = body.name;
        notes = body.notes;
    }

    const username = await getUser(req.cookies.token);

    const log = new Log({
        date: Date.now(),
        action,
        username,
        content: `Раздел: Профессии, Наименование: ${name}, Примечание: ${notes}`
    });

    await log.save();   // Сохраняем запись в Журнал действий пользователя
}

// Возвращает запись по коду
router.get("/professions/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        let item, isNewItem = true;

        if (_id === "-1") {
            item = new Profession({name: "", notes: ""});   // Создание новой записи
        } else {
            item = await Profession.findById({_id});    // Получение существующей записи
            isNewItem = false;
        }

        if (!item) return res.status(404).json({message: `Запись с кодом ${_id} не существует`});

        return res.status(200).json({isNewItem, profession: item});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при открытии записи: ${err}`});
    }
});

// Возвращает все записи
router.get("/professions", async (req, res) => {
    try {
        const items = await Profession.find({});    // Получаем все записи раздела "Характеристики оборудования"

        return res.status(200).json(items);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при получении записей: " + err});
    }
});

// Сохраняет новую запись
router.post("/professions", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Профессии"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при создании записи"
            });

        const {name, notes} = req.body; // Получаем объект записи с фронтенда

        let item = await Profession.findOne({name});    // Ищем запись в базе данных по наименованию

        // Проверяем на существование записи с указанным именем
        if (item) return res.status(400).json({message: `Профессия с именем ${name} уже существует`});

        item = new Profession({name, notes});   // Создаем новый экземпляр записи

        await item.save();  // Сохраняем запись в базе данных

        await logUserActions(req, res, "Сохранение");   // Логируем действие пользвателя

        return res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при создании записи: " + err});
    }
});

// Изменяет запись
router.put("/professions", checkMiddleware, async (req, res) => {
    try {
        // Проверка валидации полей раздела "Характеристики оборудования"
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({
                errors: errors.array(),
                message: "Некоректные данные при изменении записи"
            });

        const {_id, name, notes} = req.body;    // Получаем объект записи с фронтенда

        // Ищем запись в базе данных по уникальному идентификатору
        const item = await Profession.findById({_id});

        // Проверяем на существование записи с уникальным идентификатором
        if (!item) return res.status(404).json({message: `Профессия с именем ${name} (${_id}) не существует`});

        const items = await Profession.find({});    // Ищем все записи профессий

        if (items && items.length) {
            try {
                items.forEach(item => {
                    if (item.name === name && item._id.toString() !== _id.toString()) {
                        throw new Error("Запись с таким именем уже существует");
                    }
                })
            } catch (e) {
                return res.status(400).json({message: e.message});
            }
        }

        item.name = name;
        item.notes = notes;

        await item.save();  // Сохраняем запись в базу данных

        await logUserActions(req, res, "Редактирование");   // Логируем действие пользвателя

        return res.status(201).json({message: "Запись сохранена", item});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Ошибка при обновлении записи: " + err});
    }
});

// Удаляет запись
router.delete("/professions/:id", async (req, res) => {
    try {
        const _id = req.params.id;  // Получение id записи

        const item = await Profession.findById({_id});  // Ищем текущую запись

        if (item) {
            await Profession.deleteOne({_id});  // Удаление записи из базы данных по id записи
            await logUserActions(req, res, "Удаление", item);   // Логируем действие пользвателя
            return res.status(200).json({message: "Запись успешно удалена"});
        } else {
            return res.status(404).json({message: "Данная запись уже была удалена"});
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: `Ошибка при удалении записи: ${err}`});
    }
});

module.exports = router;