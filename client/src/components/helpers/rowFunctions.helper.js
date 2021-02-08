import {ProfessionTab} from "../tabs/professionTab";
import {DepartmentTab} from "../tabs/departmentTab";
import {PersonTab} from "../tabs/personTab";
import {TaskTab} from "../tabs/taskTab";
import {EquipmentPropertyTab} from "../tabs/EquipmentPropertyTab";

import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";

import {request} from "./request.helper";
import {getEmptyTabWithLoading} from "./getEmptyTab.helper";

/**
 * Добавление и заполнение вкладки "Профессии"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getProfession = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание профессии', ProfessionTab, 'newProfession'
        );

        // Обнуляем данные в редактируемой строчке
        store.dispatch(ActionCreator.ActionCreatorProfession.setRowDataProfession(null));
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование профессии', ProfessionTab, 'updateProfession'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/professions/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.ActionCreatorProfession.setRowDataProfession(data.profession));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Подразделения"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getDepartment = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание подразделения', DepartmentTab, 'newDepartment'
        );

        // Обнуляем данные в редактируемой строчке
        store.dispatch(ActionCreator.ActionCreatorDepartment.setRowDataDepartment(null));
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование подразделения', DepartmentTab, 'updateDepartment'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/departments/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.ActionCreatorDepartment.setRowDataDepartment(data.department));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Запись о сотруднике"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getPerson = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о сотруднике', PersonTab, 'newPerson'
        );

        // Обнуляем данные в редактируемой строчке
        store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(null));
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о сотруднике', PersonTab, 'updatePerson'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/people/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.ActionCreatorPerson.setRowDataPerson(data.person));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Состояние заявок"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getTask = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о состоянии заявки', TaskTab, 'newTask'
        );

        // Обнуляем данные в редактируемой строчке
        store.dispatch(ActionCreator.ActionCreatorTask.setRowDataTask(null));
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о состоянии заявки', TaskTab, 'updateTask'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/taskStatus/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.ActionCreatorTask.setRowDataTask(data.task));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

/**
 * Добавление и заполнение вкладки "Характеристики оборудования"
 * @param rowData - редактируемая строка
 * @constructor
 */
const getEquipmentProperty = async (rowData) => {
    // Устанавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

    if (rowData === null) {
        // Вызываем пустую вкладку новой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Создание записи о характеристике оборудования', EquipmentPropertyTab, 'newEquipmentProperty'
        );

        // Обнуляем данные в редактируемой строчке
        store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setRowDataEquipmentProperty(null));
    } else {
        // Вызываем пустую вкладку редактируемой записи для показа спиннера загрузки
        getEmptyTabWithLoading(
            'Редактирование записи о характеристике оборудования', EquipmentPropertyTab, 'updateEquipmentProperty'
        );

        // Получаем данные для записи
        let data = await request('/api/directory/equipment-property/' + rowData._id);

        // Если есть данные о записи, то записываем полученные данные в хранилище
        if (data) {
            store.dispatch(ActionCreator.ActionCreatorEquipmentProperty.setRowDataEquipmentProperty(data.equipmentProperty));
        }
    }

    // Останавливаем показ спиннера загрузки при открытии вкладки с записью
    store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
};

export {
    getProfession, getDepartment, getPerson, getTask, getEquipmentProperty
}