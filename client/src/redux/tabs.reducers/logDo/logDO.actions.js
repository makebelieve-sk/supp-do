// Инициализация экшенов для раздела "Журнал дефектов и отказов"
import {
    CREATE_LOGDO,
    EDIT_LOGDO,
    DELETE_LOGDO,
    GET_ALL_LOGDO,
    SET_ROW_DATA_LOGDO,
    SET_DATE,
    SET_DATE_FROM_ANALYTIC,
    ADD_FILE,
    DELETE_FILE,
    GET_ALL_FILES,
    SET_LEGEND,
    SET_ALERT,
    SET_ERROR_RECORD_LOGDO,
    SET_ERROR_TABLE_LOGDO,
} from "./logDO.constants";

const ActionCreatorLogDO = {
    // Добавление записи в журнал
    createLogDO: (logDO) => {
        return {
            type: CREATE_LOGDO,
            payload: logDO
        }
    },
    // Изменение записи в журнале
    editLogDO: (index, editTab) => {
        return {
            type: EDIT_LOGDO,
            payload: editTab,
            index: index
        }
    },
    // Удаление записи из журнала
    deleteLogDO: (index) => {
        return {
            type: DELETE_LOGDO,
            payload: index
        }
    },
    // Получение всех записей журнала
    getAllLogDO: (logsDO) => {
        return {
            type: GET_ALL_LOGDO,
            payload: logsDO
        }
    },
    // Установка данных для строки раздела "Журнал дефектов и отказов"
    setRowDataLogDO: (rowData) => {
        return {
            type: SET_ROW_DATA_LOGDO,
            payload: rowData
        }
    },
    // Установка даты
    setDate: (date) => {
        return {
            type: SET_DATE,
            payload: date
        }
    },
    // Установка даты
    setDateFromAnalytic: (date) => {
        return {
            type: SET_DATE_FROM_ANALYTIC,
            payload: date
        }
    },
    // Добавление файла во вкладку "Файлы"
    addFile: (file) => {
        return {
            type: ADD_FILE,
            payload: file
        }
    },
    // Удаление файла во вкладке "Файлы"
    deleteFile: (index) => {
        return {
            type: DELETE_FILE,
            payload: index
        }
    },
    // Получение всех файлов во вкладке "Файлы"
    getAllFiles: (files) => {
        return {
            type: GET_ALL_FILES,
            payload: files
        }
    },
    // Установка легенды статусов
    setLegend: (legend) => {
        return {
            type: SET_LEGEND,
            payload: legend
        }
    },
    // Установка фильтра таблицы после перехода с раздела аналитики
    setAlert: (alert) => {
        return {
            type: SET_ALERT,
            payload: alert
        }
    },
    // Установка ошибки для записи
    setErrorRecordLogDO: (error) => {
        return {
            type: SET_ERROR_RECORD_LOGDO,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTableLogDO: (error) => {
        return {
            type: SET_ERROR_TABLE_LOGDO,
            payload: error
        }
    },
}

export default ActionCreatorLogDO;