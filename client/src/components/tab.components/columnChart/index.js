// Компонент, отрисовывающий столбчатую диаграмму
import React from "react";
import {Col, Row} from "antd";
import {Column} from "@ant-design/charts";

import {useWindowWidth} from "../../../hooks/windowWidth.hook";

import "./columnChart.css";

export const ColumnChartComponent = ({title, goToLogDO, data}) => {
    // Определяем название класса, получая текущее значение ширины окна браузера
    const screenClass = useWindowWidth();

    // Объект настроек графика
    const config = {
        data: data,
        xField: "month",
        yField: "value",
        label: {
            position: "middle",
            style: {
                fill: "#FFFFFF",
                opacity: 0.6,
            },
            offset: 10,
        },
        meta: { value: { alias: "Количество" } },
        columnStyle: {
            cursor: "pointer"
        },
        height: 200,
    };

    /**
     * Функция клика на диаграмму
     * @param event - событие мыши
     */
    const onClick = (event) => {
        if (event.type === "click" && event.data) {
            const type = title === "Продолжительность простоев, мин" ? "downtime" : "failure";

            goToLogDO(`/column/${type}`, event.data.data);
        }
    };

    return (
        <div className={screenClass}>
            <Row className="column-chart-title title">
                <Col span={24}>
                    <div className="title">{title}</div>
                </Col>
            </Row>

            <Row>
                <Col span={24} className="column-chart">
                    <Column {...config} onEvent={(chart, event) => onClick(event)} />
                </Col>
            </Row>
        </div>
    );
}