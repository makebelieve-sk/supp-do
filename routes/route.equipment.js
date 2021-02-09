// Маршруты для "Перечень оборудования"
const {Router} = require("express");
const Equipment = require("../models/Equipment");
const router = Router();

// Возвращает запись по коду
router.get('/equipment/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const item = await Equipment.findById({_id: id}).populate('parent').populate("properties");

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${id} не существует`});
        }

        res.status(201).json({equipment: item});
    } catch (e) {
        res.status(500).json({message: `Ошибка при открытии записи с кодом ${id}`})
    }
});

// Возвращает все записи
router.get("/equipment", async (req, res) => {
    try {
        const items = await Equipment.find({}).populate('parent').populate("properties");
        res.json(items);
    } catch (e) {
        res.status(500).json({message: "Ошибка при получении данных"})
    }
});

// Сохраняет новую запись
router.post('/equipment', async (req, res) => {
    try {
        const {name, notes, parent, properties} = req.body;

        const newItem = new Equipment({parent, name, notes, properties});

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Объект не может принадлежать сам себе"});
            }
        }

        await newItem.save();

        let currentEquipment = await Equipment.findOne({name}).populate('parent').populate("properties");

        res.status(201).json({message: "Подразделение сохранено", item: currentEquipment});
    } catch (e) {
        res.status(500).json({message: "Ошибка при создании записи"})
    }
});

// Изменяет запись
router.put('/equipment', async (req, res) => {
    try {
        const {_id, name, notes, parent, properties} = req.body;
        const item = await Equipment.findById({_id});

        if (!item) {
            return res.status(400).json({message: `Запись с кодом ${_id} не найдена`});
        }

        if (parent) {
            if (name === parent.name) {
                return res.status(400).json({message: "Объект не может принадлежать сам себе"});
            }
        }

        item.parent = parent;
        item.name = name;
        item.notes = notes;
        item.properties = properties;

        await item.save();

        let savedItem = await Equipment.findById({_id}).populate('parent').populate("properties");

        res.status(201).json({message: "Запись сохранена", item: savedItem});
    } catch (e) {
        res.status(500).json({message: "Ошибка при обновлении записи"})
    }
});

// Удаляет запись
router.delete('/equipment/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Equipment.deleteOne({_id: id});

        res.status(201).json({message: "Запись успешно удалена"});
    } catch (e) {
        res.status(500).json({message: `Ошибка при удалении записи с кодом ${id}`})
    }
});

module.exports = router;