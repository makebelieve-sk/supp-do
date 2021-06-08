// Компонент, отрисовывающий таблицу
import React, {useState, useMemo} from "react";
import {useSelector} from "react-redux";
import {Row, Table, Col} from "antd";

import store from "../../redux/store";
import {getColumns, getFilterFunction, openRecordTab} from "../../helpers/mappers/tabs.mappers/table.helper";
import {createTreeData} from "../../helpers/functions/general.functions/createTreeData.helper";
import tableSettings from "../../options/tab.options/table.options/settings";
import {goToLogDO} from "../analytic";
import {TableHeaderComponent} from "../../components/tab.components/tableHeader";
import {TableAlertComponent} from "../../components/tab.components/tableAlert";
import {TableBadgeComponent} from "../../components/tab.components/tableBadge";

import "./table.css";

export const TableComponent = ({specKey}) => {
    // Получение данных таблиц
    const stateObject = useSelector(state => ({
        loadingTable: state.reducerLoading.loadingTable,
        professions: state.reducerProfession.professions,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipmentProperties: state.reducerEquipmentProperty.equipmentProperties,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        logDO: state.reducerLogDO.logDO,
        help: state.reducerHelp.help,
        users: state.reducerUser.users,
        roles: state.reducerRole.roles,
        statisticRating: state.reducerStatistic.statisticRating,
        statisticList: state.reducerStatistic.statisticList,
        logs: state.reducerLog.logs,
        legend: state.reducerLogDO.legend,
        alert: state.reducerLogDO.alert,
        activeKey: state.reducerTab.activeKey,
        pageSizeOptions: state.reducerMain.pageSizeOptions,
        columnsOptions: state.reducerMain.columnsOptions,
    }));

    // Получение колонок таблицы
    const columns = useMemo(() => getColumns(specKey), [specKey]);

    // Создание состояний для текстового поля, колонок таблицы и скрытия/раскрытия строк
    const [filterText, setFilterText] = useState("");
    const [columnsTable, setColumnsTable] = useState(columns);
    const [expand, setExpand] = useState(true);

    // Получение данных таблицы
    const data = specKey === "equipment" || specKey === "departments"
        ? createTreeData(stateObject[specKey])
        : stateObject[specKey];

    // Получение отфильтрованных данных таблицы
    const filterData = getFilterFunction(specKey, data.slice(0), filterText.toLowerCase());

    return (
        <>
            {/*Поиск, Дата с ... по ..., Кнопки таблицы*/}
            <TableHeaderComponent
                data={data}
                specKey={specKey}
                filterText={filterText}
                setFilterText={setFilterText}
                setColumnsTable={setColumnsTable}
                expand={expand}
                setExpand={setExpand}
            />

            {/*Легенда статусов*/}
            <TableBadgeComponent legend={stateObject.legend} specKey={specKey}/>

            {/*Блок фильтров таблицы*/}
            <TableAlertComponent alert={stateObject.alert} specKey={specKey}/>

            {/*Таблица*/}
            <Row>
                <Col span={24}>
                    <Table
                        bordered
                        size={tableSettings.size}
                        scroll={tableSettings.scroll}
                        pagination={{
                            ...tableSettings.pagination,
                            pageSize: stateObject.pageSizeOptions && stateObject.pageSizeOptions[specKey]
                                ? stateObject.pageSizeOptions[specKey]
                                : 10
                        }}
                        expandable={{
                            defaultExpandAllRows: true,
                            expandedRowKeys: expand
                                ? specKey === "departments"
                                    ? stateObject.departments.map(object => object._id)
                                    : stateObject.equipment.map(object => object._id)
                                : []
                        }}
                        dataSource={columnsTable && columnsTable.length ? filterData : null}
                        columns={stateObject.columnsOptions && stateObject.columnsOptions[specKey]
                            ? stateObject.columnsOptions[specKey]
                            : columnsTable}
                        rowKey={record => record._id.toString()}
                        onRow={row => ({
                            onClick: async () => {
                                if (specKey === "statisticRating" || specKey === "statisticList") {
                                    specKey === "statisticRating"
                                        ? await goToLogDO("/rating", {
                                            satisfies: row.satisfies,
                                            equipment: row.equipment,
                                            date: store.getState().reducerStatistic.dateRating
                                        })

                                        : await goToLogDO("/list", {
                                            date: store.getState().reducerStatistic.dateList
                                        });
                                } else {
                                    openRecordTab(specKey, row._id);
                                }
                            }
                        })}
                        loading={stateObject.loadingTable}
                        className={specKey === "logDO" ? "table-logDo" : "table-usual"}
                    />
                </Col>
            </Row>
        </>
    );
}