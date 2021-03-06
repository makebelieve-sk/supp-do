// Глобальные переменные приложения
// Инициализация разделов проекта
const sections = [
    {label: "Не выбрано", value: null},
    {label: "Профессии", value: "professions"},
    {label: "Подразделения", value: "departments"},
    {label: "Персонал", value: "people"},
    {label: "Характеристики оборудования", value: "equipmentProperties"},
    {label: "Оборудование", value: "equipment"},
    {label: "Состояние заявок", value: "tasks"},
    {label: "Журнал дефектов и отказов", value: "logDO"},
    {label: "Аналитика", value: "analytic"},
    {label: "Статистика", value: "statistic"},
    {label: "Помощь", value: "help"},
    {label: "Пользователи", value: "users"},
    {label: "Роли", value: "roles"},
    {label: "Журнал действий пользователя", value: "logs"},
    {label: "Информация о предприятии", value: "companiesInfo"},
];

// Переменные для хранения данных в куки
const StorageVars = {
    user: "user",
    jwt: "token",
    pageSize: "pageSize",
    tableTotal: "tableTotal",
}

// Почтовый адрес нашей компании
const emailAddressCompany = "info@itprom.org";

export {sections, StorageVars, emailAddressCompany};