import {
    CREATE_DEPARTMENT,
    EDIT_DEPARTMENT,
    DELETE_DEPARTMENT,
    GET_ALL_DEPARTMENTS,
    SET_ROW_DATA_DEPARTMENT
} from "./department.constants";

const ActionCreatorDepartment = {
    // Добавление подразделения
    createDepartment: (department) => {
        return {
            type: CREATE_DEPARTMENT,
            payload: department
        }
    },
    // Изменение подразделения
    editDepartment: (index, editTab) => {
        return {
            type: EDIT_DEPARTMENT,
            payload: editTab,
            index: index
        }
    },
    // Удаление подразделения
    deleteDepartment: (index) => {
        return {
            type: DELETE_DEPARTMENT,
            payload: index
        }
    },
    // Добавление всех подразделений
    getAllDepartments: (departments) => {
        return {
            type: GET_ALL_DEPARTMENTS,
            payload: departments
        }
    },
    // Установка данных для строки раздела "Подразделения"
    setRowDataDepartment: (rowData) => {
        return {
            type: SET_ROW_DATA_DEPARTMENT,
            payload: rowData
        }
    }
}

export default ActionCreatorDepartment;