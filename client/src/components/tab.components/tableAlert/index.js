// Компонент, отрисовывающий блок фильтров таблицы
import React, {useState} from "react";
import {Alert, Col, Row} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import moment from "moment";

import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import TabOptions from "../../../options/tab.options/record.options";
import {LogDORoute} from "../../../routes/route.LogDO";

import "./tableAlert.css";

export const TableAlertComponent = ({alert, specKey}) => {
    // Инициализация состояний для отступа снизу алерта
    const [marginBottomAlert, setMarginBottomAlert] = useState("20px");

    /**
     * Функция закрытия алерта
     * @returns {Promise<void>}
     */
    const closeAlert = async () => {
        setMarginBottomAlert("0px");      // Убираем отступ после алерта

        // Обновляем фильтр таблицы
        store.dispatch(ActionCreator.ActionCreatorLogDO.setAlert({
            alert: null,
            filter: null,
            url: null
        }));

        // Обновляем датапикер
        store.dispatch(ActionCreator.ActionCreatorLogDO.setDate(moment().startOf("month").format(TabOptions.dateFormat) + "/" +
            moment().endOf("month").format(TabOptions.dateFormat)));

        await LogDORoute.getAll();              // Обновляем данные в таблице
    }

    return alert && alert.alert && specKey === "logDO"
        ? <Row style={{marginBottom: marginBottomAlert}}>
            <Col>
                <Alert
                    message={alert.alert}
                    type="warning"
                    icon={<FilterOutlined/>}
                    showIcon
                    closable
                    onClose={closeAlert}
                />
            </Col>
        </Row>
        : null
}