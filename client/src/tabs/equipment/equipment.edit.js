// Вкладка записи раздела "Оборудование"
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {Card, Row, Col, Skeleton} from "antd";

import {EquipmentForm} from "./equipment.form";

export const EquipmentTab = () => {
    // Получение списка подразделений и загрузки записи
    const {item, loadingSkeleton} = useSelector((state) => ({
        item: state.reducerEquipment.rowDataEquipment,
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
    }));

    const display = loadingSkeleton ? "none" : "block";

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 24}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active/>

                    <div style={{display}}>
                        {useMemo(() => item ? <EquipmentForm item={item} /> : null, [item])}
                    </div>
                </Card>
            </Col>
        </Row>
    )
}