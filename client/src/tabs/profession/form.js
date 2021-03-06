// Компонент формы записи раздела "Профессии"
import React, {useEffect, useState} from "react";
import {Card, Form, Input} from "antd";

import {onFailed, TabButtons} from "../tab.functions";
import {ProfessionRoute} from "../../routes/route.profession";
import onRemove from "../../helpers/functions/general.functions/removeTab";

export const ProfessionForm = ({item}) => {
    // Инициализация состояния для показа спиннера загрузки при сохранении и удалении записи
    const [loadingSave, setLoadingSave] = useState(false);

    // Инициализация заголовка раздела и имени формы
    const title = item.isNewItem ? "Создание профессии" : "Редактирование профессии";

    // Инициализируем хук состояния формы от AntDesign
    const [form] = Form.useForm();

    // При обновлении item устанавливаем форме начальные значения
    useEffect(() => {
        form.setFieldsValue({
            _id: item._id,
            isNewItem: item.isNewItem,
            name: item.name.trim(),
            notes: item.notes.trim(),
        });
    }, [item, form]);

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = async (values) => await ProfessionRoute.save(values, setLoadingSave);

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = async (setLoadingDelete, setVisiblePopConfirm) => {
        await ProfessionRoute.delete(item._id, setLoadingDelete, setVisiblePopConfirm);
    };

    return (
        <Card.Meta
            title={title}
            description={
                <Form
                    form={form}
                    className="form-styles"
                    name="profession-item"
                    layout="vertical"
                    onFinishFailed={onFailed}
                    onFinish={saveHandler}
                >
                    <Form.Item name="_id" hidden={true}><Input/></Form.Item>
                    <Form.Item name="isNewItem" hidden={true}><Input/></Form.Item>

                    <Form.Item label="Профессия" name="name" rules={[
                        {
                            required: true,
                            transform: value => value.trim(),
                            message: "Введите название профессии!"
                        }]}>
                        <Input onChange={(e) => form.setFieldsValue({name: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <Form.Item label="Примечание" name="notes">
                        <Input onChange={(e) => form.setFieldsValue({notes: e.target.value})} maxLength={255} type="text"/>
                    </Form.Item>

                    <TabButtons
                        loadingSave={loadingSave}
                        item={item}
                        deleteHandler={deleteHandler}
                        cancelHandler={() => onRemove("professionItem", "remove")}
                    />
                </Form>
            }
        />
    )
}