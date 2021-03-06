// Инициализация экшенов для раздела "Персонал"
import {
    CREATE_PERSON,
    EDIT_PERSON,
    DELETE_PERSON,
    GET_ALL_PEOPLE,
    SET_ROW_DATA_PERSON,
    SET_ERROR_RECORD_PERSON,
    SET_ERROR_TABLE_PERSON,
} from "./person.constants";

const ActionCreatorPerson = {
    // Добавление сотрудника
    createPerson: (person) => {
        return {
            type: CREATE_PERSON,
            payload: person
        }
    },
    // Изменение сотрудника
    editPerson: (index, editTab) => {
        return {
            type: EDIT_PERSON,
            payload: editTab,
            index: index
        }
    },
    // Удаление сотрудника
    deletePerson: (index) => {
        return {
            type: DELETE_PERSON,
            payload: index
        }
    },
    // Добавление всех записей о сотрудниках
    getAllPeople: (people) => {
        return {
            type: GET_ALL_PEOPLE,
            payload: people
        }
    },
    // Установка данных для строки раздела "Персонал"
    setRowDataPerson: (rowData) => {
        return {
            type: SET_ROW_DATA_PERSON,
            payload: rowData
        }
    },
    // Установка ошибки для записи
    setErrorRecordPerson: (error) => {
        return {
            type: SET_ERROR_RECORD_PERSON,
            payload: error
        }
    },
    // Установка ошибки для таблицы
    setErrorTablePerson: (error) => {
        return {
            type: SET_ERROR_TABLE_PERSON,
            payload: error
        }
    },
}

export default ActionCreatorPerson;