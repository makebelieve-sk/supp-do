// Определение типа контента вкладки
import React from "react";
import {message} from "antd";

import {TableComponent} from "../../../tabs/table/table";
import {AnalyticComponent} from "../../../components/content.components/analytic/analytic.component";
import {StatisticComponent} from "../../../components/content.components/statistic/statistic.component";

/**
 * Функция определения типа контента вкладки
 * @param key - ключ выбранного раздела
 */
export default function getContentToTab(key) {
    // Карта соответствия ключа вкладки и версткой контента вкладки
    const map = new Map([
        ["professions", <TableComponent specKey={key}/>],
        ["departments", <TableComponent specKey={key}/>],
        ["people", <TableComponent specKey={key}/>],
        ["tasks", <TableComponent specKey={key}/>],
        ["equipmentProperties", <TableComponent specKey={key}/>],
        ["equipment", <TableComponent specKey={key}/>],
        ["logDO", <TableComponent specKey={key}/>],
        ["analytic", <AnalyticComponent />],
        ["statistic", <StatisticComponent />],
    ]);

    if (map.has(key)) {
        return map.get(key);
    } else {
        message.error(`Раздел с ключём ${key} не существует (определение типа контента вкладки)`).then(null);
    }
};