// Компонент отображающий раздел "Аналитика"
import React from "react";
import {useSelector} from "react-redux";
import {Col, Row} from "antd";

import {LineChartComponent} from "../../tab.components/lineChart/lineChart.component";
import {BarChartComponent} from "../../tab.components/barChart/barChart.component";
import {ColumnChartComponent} from "../../tab.components/columnChart/columnChart.component";
import {CircleComponent} from "../../tab.components/Circle/circle.component";
import {RatingComponent} from "../../tab.components/rating/rating.component";

import {AnalyticRoute} from "../../../routes/route.Analytic";
import store from "../../../redux/store";
import {ActionCreator} from "../../../redux/combineActions";
import emptyTab from "../../../helpers/functions/tabs.functions/emptyTab";
import {BodyManager} from "../body/body.component";

import "./analytic.css";

export const AnalyticComponent = () => {
    // Получаем из хранилища объект текущий аналитики, предыдущий объект аналитики (для сравнения)
    const {analytic, prevAnalyticData} = useSelector(state => ({
        analytic: state.reducerAnalytic.analytic,
        prevAnalyticData: state.reducerAnalytic.prevAnalyticData,
    }));

    // Единицы измерения ср. время реагирования
    const unitsAverageResponseTime = analytic && analytic.averageResponseTime
        ? analytic.averageResponseTime.toString().length === 2
            ? "мин"
            : analytic.averageResponseTime.toString().length === 5
                ? "час"
                : "сут"
        : "сут";

    /**
     * Функция обработки перехода в раздел ЖДО
     * url - адрес
     * filter - объект фильтр
     */
    const goToLogDO = async (url, filter) => {
        try {
            // Устанавливаем показ спиннера загрузки при открытии вкладки раздела
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(true));

            // Создаем пустую вкладку
            emptyTab("Журнал дефектов и отказов", BodyManager, "logDO");

            await AnalyticRoute.goToLogDO(url, filter);

            // Останавливаем показ спиннера загрузки при открытии вкладки раздела
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        } catch (e) {
            // Останавливаем показ спиннера загрузки при появлении ошибки
            store.dispatch(ActionCreator.ActionCreatorLoading.setLoadingSkeleton(false));
        }
    };

    console.log("Обновление вкладки 'Аналитика' с данными: ", analytic);

    return (
        <div className="analytic">
            <Row>
                {/*Неназначенные заявки*/}
                <Col
                    span={4}
                    className="col-circle-1"
                    onClick={() => goToLogDO("/circle", {unassignedTasks: true, inWorkTasks: false})}
                >
                    <CircleComponent
                        title="Неназначенные заявки"
                        value={analytic && analytic.unassignedTasks ? analytic.unassignedTasks.length : 0}
                        borderColor={analytic && prevAnalyticData && analytic.unassignedTasks && analytic.unassignedTasks.length
                        && prevAnalyticData.unassignedTasks && prevAnalyticData.unassignedTasks.length
                        && prevAnalyticData.unassignedTasks.length > analytic.unassignedTasks.length ? "red" : "green"}
                    />
                </Col>

                {/*Заявки в работе*/}
                <Col
                    span={4}
                    className="col-circle-2"
                    onClick={() => goToLogDO("/circle", {unassignedTasks: false, inWorkTasks: true})}
                >
                    <CircleComponent
                        title="Заявки в работе"
                        value={analytic && analytic.inWorkTasks ? analytic.inWorkTasks.length : 0}
                        borderColor={analytic && prevAnalyticData && analytic.inWorkTasks && analytic.inWorkTasks.length
                        && prevAnalyticData.inWorkTasks && prevAnalyticData.inWorkTasks.length
                        && prevAnalyticData.inWorkTasks.length > analytic.inWorkTasks.length ? "red" : "green"}
                    />
                </Col>

                {/*Непринятые заявки*/}
                <Col
                    span={4}
                    className="col-circle-3"
                    onClick={() => goToLogDO("/circle", {unassignedTasks: false, inWorkTasks: false})}
                >
                    <CircleComponent
                        title="Непринятые заявки"
                        value={analytic && analytic.notAccepted ? analytic.notAccepted.length : 0}
                        borderColor={analytic && prevAnalyticData && analytic.notAccepted && analytic.notAccepted.length
                        && prevAnalyticData.notAccepted && prevAnalyticData.notAccepted.length
                        && prevAnalyticData.notAccepted.length > analytic.notAccepted.length ? "red" : "green"}
                    />
                </Col>

                {/*Загруженность подразделений*/}
                <Col span={12} className="bar-char-border">
                    <BarChartComponent
                        data={analytic && analytic.workloadDepartments ?
                            analytic.workloadDepartments : [{department: "0", value: "0"}]}
                        goToLogDO={goToLogDO}
                    />
                </Col>
            </Row>

            <Row className="row-2">
                {/*Динамика отказов*/}
                <Col span={18} className="block-1">
                    <LineChartComponent
                        data={analytic && analytic.failureDynamics ?
                            analytic.failureDynamics : [{data: "0", value: "0"}]}
                        goToLogDO={goToLogDO}
                    />
                </Col>

                {/*Ср. время реагирования, Ср. время выполнения*/}
                <Col span={6} className="block-2">
                    <CircleComponent
                        title={"Ср. время реагирования, " + unitsAverageResponseTime}
                        value={analytic && analytic.averageResponseTime ? analytic.averageResponseTime : 0}
                        borderColor={analytic && prevAnalyticData && analytic.averageResponseTime
                        && analytic.averageResponseTime.length
                        && prevAnalyticData.averageResponseTime && prevAnalyticData.averageResponseTime.length
                        && prevAnalyticData.averageResponseTime.length > analytic.averageResponseTime.length ? "red" : "green"}
                        upBorder={false}
                        size={true}
                    />
                    <CircleComponent
                        title="Ср. время выполнения, сут."
                        value={analytic && analytic.averageClosingTime ? analytic.averageClosingTime : 0}
                        borderColor={analytic && prevAnalyticData && analytic.averageClosingTime
                        && analytic.averageClosingTime.length
                        && prevAnalyticData.averageClosingTime && prevAnalyticData.averageClosingTime.length
                        && prevAnalyticData.averageClosingTime.length > analytic.averageClosingTime.length ? "red" : "green"}
                        upBorder={true}
                        size={true}
                    />
                </Col>
            </Row>

            <Row>
                {/*Продолжительность простоев*/}
                <Col span={6} className="col-column-1">
                    <ColumnChartComponent
                        title="Продолжительность простоев, мин"
                        data={analytic && analytic.changeDowntime ? analytic.changeDowntime : [{
                            month: "0",
                            value: "0"
                        }]}
                    />
                </Col>

                {/*Количество отказов*/}
                <Col span={6} className="col-column-2">
                    <ColumnChartComponent
                        title="Количество отказов, шт."
                        data={analytic && analytic.changeRefusal ? analytic.changeRefusal : [{month: "0", value: "0"}]}
                    />
                </Col>

                {/*Рейтинг отказов за 12 месяцев (Топ-5)*/}
                <Col
                    span={6}
                    className="col-rating-1"
                    onClick={() => goToLogDO("/rating/bounceRating")}
                >
                    <RatingComponent
                        title="Рейтинг отказов за 12 месяцев (Топ-5)"
                        param="Кол-во заявок, шт."
                        data={analytic && analytic.bounceRating ? analytic.bounceRating : null}
                    />
                </Col>

                {/*Рейтинг незакрытых заявок (Топ-5)*/}
                <Col
                    span={6}
                    className="col-rating-2"
                    onClick={() => goToLogDO("/rating/ratingOrders")}
                >
                    <RatingComponent
                        title="Рейтинг незакрытых заявок (Топ-5)"
                        param="Продол-ть, сут."
                        data={analytic && analytic.ratingOrders ? analytic.ratingOrders : null}
                    />
                </Col>
            </Row>
        </div>
    )
}