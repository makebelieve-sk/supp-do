// Компонент формы записи раздела "Оборудование"
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Card, Form, Input, Select, Tabs} from "antd";

import store from "../../redux/store";
import {ActionCreator} from "../../redux/combineActions";
import {DeleteTabContext} from "../../context/deleteTab.context";
import {EquipmentRoute} from "../../routes/route.Equipment";
import {CharacteristicComponent} from "../../components/tab.components/characteristic/characteristic.component";
import {UploadComponent} from "../../components/tab.components/upload/upload.component";
import {dropdownRender, getOptions, onFailed, TabButtons} from "../tab.functions";
import {getParents} from "../../helpers/functions/general.functions/replaceField";

export const EquipmentForm = ({item}) => {
    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении выпадающих списков
    // и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingEquipment, setLoadingEquipment] = useState(false);
    const [loadingSelectCharacteristics, setLoadingSelectCharacteristics] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);

    // Пустое значение выпадающего списка
    const emptyDropdown = useMemo(() => [{label: "Не выбрано", value: null}], []);

    const equipment = store.getState().reducerEquipment.equipment;
    const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

    // Создание стейта для значений в выпадающих списках
    const [options, setOptions] = useState(item.parent ? [{label: getParents(item.parent, equipment) + item.parent.name, value: item.parent._id}] : emptyDropdown);
    const [equipmentPropertyToOptions, setEquipmentPropertyToOptions] = useState(getOptions(equipmentProperties));

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // Получаем функцию удаления вкладки onRemove из контекста
    const onRemove = useContext(DeleteTabContext);

    // Создание заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание оборудования" : "Редактирование оборудования";

    // Изменение значений формы
    useEffect(() => {
        const equipment = store.getState().reducerEquipment.equipment;
        const equipmentProperties = store.getState().reducerEquipmentProperty.equipmentProperties;

        // Обновление выпадающих списков
        setOptions(item.parent ? [{label: getParents(item.parent, equipment) + item.parent.name, value: item.parent._id}] : emptyDropdown);
        setEquipmentPropertyToOptions(getOptions(equipmentProperties));

        let characteristicArr = [];

        // Начальное значение выбранного элемента в выпадающих списках на вкладке Характеристики
        if (item.properties && item.properties.length) {
            item.properties.forEach(property => {
                const obj = {
                    equipmentProperty: property && property.equipmentProperty ? property.equipmentProperty._id : null,
                    value: property ? property.value : ""
                };

                characteristicArr.push(obj);
            });
        }

        // Установка значений формы
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name,
            notes: item.notes,
            parent: item.parent ? item.parent._id : null,
            properties: item.properties && item.properties.length ? characteristicArr : [{equipmentProperty: null, value: ""}]
        });
    }, [form, item, emptyDropdown]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => {
        // Устанавливаем спиннер загрузки
        setLoadingSave(true);

        const equipment = store.getState().reducerEquipment.equipment;
        const files = store.getState().reducerEquipment.files;

        values.parent = equipment.find(eq => eq._id === values.parent);

        // Проверяем, выбраны ли значения в выпадающих списках на вкладке Характеристики
        if (values.properties && values.properties.length) {
            values.properties = values.properties.filter(select => select.equipmentProperty);
        } else if (!values.properties && item.properties && item.properties.length) {
            values.properties = item.properties;
        } else {
            values.properties = [];
        }

        values.files = files;

        await EquipmentRoute.save(values, setLoadingSave, onRemove, equipment);
    };

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await EquipmentRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm, onRemove);
    };

    const cancelHandler = () => EquipmentRoute.cancel(onRemove, setLoadingCancel);

    // Настройка компонента CharacteristicComponent (вкладка "Характеристики")
    const characteristicProps = {
        equipmentPropertyToOptions,
        dropdownRender,
        loadingSelectCharacteristics,
        setLoadingSelectCharacteristics,
        setEquipmentPropertyToOptions,
        form
    };

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        model: "equipment",
        item,
        actionCreatorAdd: ActionCreator.ActionCreatorEquipment.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorEquipment.deleteFile
    };

    console.log("Ререндер вкладки Equipment");

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="equipment-item"
                    layout="vertical"
                    onFinish={saveHandler}
                    onFinishFailed={onFailed}
                >
                    <Tabs defaultActiveKey="name">
                        <Tabs.TabPane tab="Наименование" key="name" className="tabPane-styles">
                            <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                            <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                            <Form.Item name="parent" label="Принадлежит">
                                <Select
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={options}
                                    onDropdownVisibleChange={async open => {
                                        await dropdownRender(open, setLoadingEquipment, setOptions, "equipment");
                                    }}
                                    loading={loadingEquipment}
                                    onChange={(value) => {
                                        const equipment = store.getState().reducerEquipment.equipment;

                                        const foundEquipment = equipment.find(eq => eq._id === value);

                                        form.setFieldsValue({parent: foundEquipment ? foundEquipment._id : null});
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Наименование"
                                name="name"
                                rules={[{required: true, message: "Введите название подразделения!"}]}
                            >
                                <Input onChange={e => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                            </Form.Item>

                            <Form.Item label="Примечание" name="notes">
                                <Input onChange={e => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                            </Form.Item>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Характеристики" key="characteristics" className="tabPane-styles">
                            <CharacteristicComponent {...characteristicProps} />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Дополнительно" key="files" className="tabPane-styles">
                            <Form.Item name="files" wrapperCol={{span: 24}}>
                                <UploadComponent {...uploadProps}/>
                            </Form.Item>
                        </Tabs.TabPane>
                    </Tabs>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={cancelHandler}
                        loadingCancel={loadingCancel}
                        specKey="equipmentItem"
                    />
                </Form>
            }
        />
    )
}