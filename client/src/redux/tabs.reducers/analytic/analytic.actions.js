// Инициализация экшенов для раздела "Аналитика"
import {
    GET_ALL_ANALYTIC,
    GET_PREV_ANALYTIC_DATA,
    SET_ERROR_ANALYTIC,
} from "./analytic.constants";

const ActionCreatorAnalytic = {
    // Получение данных аналитики
    getAllAnalytic: (analytic) => {
        return {
            type: GET_ALL_ANALYTIC,
            payload: analytic
        }
    },
    // Запись прошлых данных аналитики
    getPrevAnalyticData: (prevAnalytic) => {
        return {
            type: GET_PREV_ANALYTIC_DATA,
            payload: prevAnalytic
        }
    },
    // Установка ошибки
    setErrorAnalytic: (error) => {
        return {
            type: SET_ERROR_ANALYTIC,
            payload: error
        }
    },
}

export default ActionCreatorAnalytic;