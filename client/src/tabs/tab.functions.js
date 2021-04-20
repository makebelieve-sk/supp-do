// Помощник по созданию вкладки записи
import React, {useState} from "react";
import {Button, message, Popconfirm, Row} from "antd";
import {CheckOutlined, DeleteOutlined, QuestionCircleOutlined, StopOutlined} from "@ant-design/icons";

import store from "../redux/store";
import PrintButtonRecord from "./printButtonRecord";

// Получение выпадающего списка
const getOptions = (items) => {
    let valuesToOptions = [];

    if (items && items.length) {
        items.forEach(item => {
            valuesToOptions.push({
                label: item.nameWithParent ?? item.name,
                value: item._id
            });
        })
    }

    valuesToOptions.sort((a, b) => a.label > b.label ? 1 : -1);

    valuesToOptions.unshift({label: "Не выбрано", value: null});

    return valuesToOptions;
};

// Компонент кнопок записи
const TabButtons = ({loadingSave, item, deleteHandler, cancelHandler, loadingCancel = false, specKey = null}) => (
    <Row justify="end" style={{marginTop: 20}} xs={{gutter: [8, 8]}}>
        <Button
            className="button-style"
            type="primary"
            htmlType="submit"
            loading={loadingSave}
            icon={<CheckOutlined/>}
        >
            Сохранить
        </Button>

        {CheckTypeTab(item, deleteHandler, specKey)}

        <Button
            className="button-style"
            type="secondary"
            onClick={cancelHandler}
            loading={loadingCancel}
            icon={<StopOutlined/>}
        >
            Отмена
        </Button>
    </Row>
)

// Компонент кнопок редактирования записи
const CheckTypeTab = (item, deleteHandler, specKey = null) => {
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [visiblePopConfirm, setVisiblePopConfirm] = useState(false);

    return !item.isNewItem ?
        <>
            <Popconfirm
                title="Вы уверены, что хотите удалить запись?"
                okText="Удалить"
                visible={visiblePopConfirm}
                onConfirm={() => deleteHandler(setLoadingDelete, setVisiblePopConfirm)}
                onCancel={() => setVisiblePopConfirm(false)}
                okButtonProps={{loading: loadingDelete}}
                icon={<QuestionCircleOutlined style={{color: "red"}}/>}
            >
                <Button
                    className="button-style"
                    type="danger"
                    icon={<DeleteOutlined/>}
                    onClick={() => setVisiblePopConfirm(true)}
                >
                    Удалить
                </Button>
            </Popconfirm>

            {specKey ? <PrintButtonRecord specKey={specKey} /> : null}
        </> : null;
}

// Вывод сообщения валидации формы
const onFailed = () => message.error("Заполните обязательные поля").then(null);

// Обновление выпадающего списка
const dropdownRender = (open, setLoadingSelect, setOptions, key) => {
    if (open) {
        setLoadingSelect(true);

        let items = [];

        const map = new Map([
            ["professions", store.getState().reducerProfession.professions],
            ["departments", store.getState().reducerDepartment.departments],
            ["people", store.getState().reducerPerson.people],
            ["equipment", store.getState().reducerEquipment.equipment],
            ["equipmentProperty", store.getState().reducerEquipmentProperty.equipmentProperties],
            ["taskStatus", store.getState().reducerTask.tasks],
        ]);

        if (map.has(key)) {
            items = map.get(key);
        } else {
            message.error(`Раздел с ключём ${key} не существует (заполнение выпадающих списков)`).then(null);
        }

        setOptions(getOptions(items));

        setLoadingSelect(false);
    }
}

export {getOptions, TabButtons, onFailed, dropdownRender}