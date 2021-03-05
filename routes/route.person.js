// Маршруты для персонала
const {Router} = require("express");
const Person = require("../models/Person");
const router = Router();

// Возвращает запись по коду
router.get("/people/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        let item;

        if (_id === "-1") {
            // Создание новой записи
            item = new Person({isCreated: true, tabNumber: null, name: "", notes: "", department: null, profession: null});
        } else {
            // Редактирование существующей записи
            item = await Person.findById({_id}).populate("department").populate("profession");
        }

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не существует`});
        }

        res.status(201).json({person: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${_id}`})
    }
});

// Возвращает все записи
router.get("/people", async (req, res) => {
    try {
        const items = await Person.find({}).populate("department").populate("profession");
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении записей о сотрудниках"})
    }
});

// Сохраняет новую запись
router.post("/people", async (req, res) => {
    try {
        const {name, notes, department, profession, tabNumber} = req.body;

        const item = await Person.findOne({name});

        if (item) {
            return res.status(400).json({message: `Запись о сотруднике с именем ${name} уже существует`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        const newItem = new Person({isCreated: false, tabNumber, name, department, profession, notes});

        await newItem.save();

        const currentPerson = await Person.findOne({name}).populate("department").populate("profession");

        if (!department || !profession) {
            return res.status(400).json({message: "Заполните обязательные поля"});
        }

        res.status(201).json({message: "Запись о сотруднике сохранена", item: currentPerson});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put("/people", async (req, res) => {
    try {
        const {_id, isCreated, name, notes, department, profession, tabNumber} = req.body;
        const item = await Person.findById({_id}).populate("department").populate("profession");

        if (!item) {
            return res.status(400).json({message: `Запись о сотруднике с кодом ${_id} не найдена`});
        }

        if (name === "" || !name) {
            return res.status(400).json({message: "Поле 'Наименование' должно быть заполнено"});
        }

        item.isCreated = isCreated;
        item.tabNumber = tabNumber;
        item.name = name;
        item.department = department;
        item.profession = profession;
        item.notes = notes;

        await item.save();

        let savedItem = await Person.findById({_id}).populate("department").populate("profession");

        res.status(201).json({message: "Запись о сотруднике успешно изменена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи о сотруднике"})
    }
});

// Удаляет запись
router.delete('/people/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        await Person.deleteOne({_id});

        res.status(201).json({message: "Запись о сотруднике успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${_id}`})
    }
});

module.exports = router;