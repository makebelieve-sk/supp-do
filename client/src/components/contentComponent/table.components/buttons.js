import React, {useState, useMemo} from 'react';
import {Button, Row, Menu, Dropdown, Checkbox} from 'antd';
import {PlusOutlined, FileExcelOutlined, PrinterOutlined, EditOutlined} from '@ant-design/icons';

import {getColumns, openRecordTab} from "../../helpers/table.helpers/table.helper";

export const ButtonsComponent = ({specKey, onExport, checkedColumns, setCheckedColumns, setColumnsTable, initialColumns}) => {
    // Получение колонок для таблицы
    let columns = useMemo(() => getColumns(specKey), [specKey]);

    // Стейт для отображения выпадающего меню для колонок
    const [visible, setVisible] = useState(false);

    // Функция для изменения стейта отображения выпадающего списка колонок
    const handleVisibleChange = flag => {
        setVisible(flag);
    };

    return useMemo(() => {
        // Фукнция изменения видимости колонок
        const onChange = (e) => {
            let checkedColumnsTable = checkedColumns;

            if (e.target.checked) {
                checkedColumnsTable = checkedColumnsTable.filter(id => {
                    return id !== e.target.id;
                });
            } else if (!e.target.checked) {
                if (Array.isArray(e.target.id)) {
                    let arr = ['name'];
                    arr.unshift(e.target.id);
                    checkedColumnsTable.push(arr);
                } else {
                    checkedColumnsTable.push(e.target.id);
                }
            }

            let filtered = initialColumns;

            for (let i = 0; i < checkedColumnsTable.length; i++)
                filtered = filtered.filter(el => {
                    let dataIndex = el.dataIndex;

                    if (Array.isArray(dataIndex)) {
                        dataIndex = dataIndex[0];
                    }
                    return dataIndex !== checkedColumnsTable[i];
                });

            setColumnsTable(filtered)
            setCheckedColumns(checkedColumnsTable);
        }

        // Создание переменной для отображения выпадающего списка для колонок
        let component = <>
            <Menu>
                <Menu.ItemGroup title="Колонки">
                    {columns.map((column) => {
                        return (
                            <Menu.Item key={column.key + '-checkbox'}>
                                <Checkbox
                                    id={column.key}
                                    onChange={onChange}
                                    defaultChecked>{column.title}
                                </Checkbox>
                            </Menu.Item>
                        )
                    })}
                </Menu.ItemGroup>
            </Menu>
        </>;

        return (
            <Row align="middle">
                <Button className="button-style" icon={<PlusOutlined/>} type="primary"
                        onClick={() => openRecordTab(specKey, "-1")}>Добавить</Button>
                <Button className="button-style" icon={<FileExcelOutlined/>} size="middle"
                        onClick={e => onExport(e.target.value)}>Экспорт</Button>
                <Button className="button-style" icon={<PrinterOutlined/>} size="middle"
                        onClick={() => alert("Печать")}>Печать</Button>
                <Dropdown
                    overlay={component}
                    onVisibleChange={handleVisibleChange}
                    visible={visible}
                >
                    <Button className="button-style" icon={<EditOutlined/>} size="middle">Колонки</Button>
                </Dropdown>
            </Row>
        );
    }, [specKey, onExport, visible, columns, checkedColumns, initialColumns, setCheckedColumns, setColumnsTable]);
};