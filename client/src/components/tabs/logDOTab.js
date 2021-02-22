// Раздел "Журнал дефектов и отказов"
import React, {useState} from 'react';
import {Button, Card, Form, Input, Row, Col, Select, Skeleton, Tabs, DatePicker, Checkbox} from 'antd';
import {CheckOutlined, StopOutlined,} from "@ant-design/icons";
import {useSelector} from "react-redux";
import moment from "moment";

import {UploadComponent} from "../contentComponent/tab.components/uploadComponent";
import {ActionCreator} from "../../redux/combineActions";
import {CheckTypeTab, onFailed} from "../helpers/tab.helpers/tab.functions";
import {HOCFunctions} from "../helpers/tab.helpers/tab.HOC.functions";
import TabOptions from "../../options/tab.options/tab.options";

const {Meta} = Card;
const {TabPane} = Tabs;
const {TextArea} = Input;

export const LogDOTab = ({specKey, onRemove}) => {
    // Получение списка подразделений и загрузки записи из хранилища redux
    const {loadingSkeleton, logDO, rowData, departments, people, equipment, tasks, files} = useSelector((state) => ({
        loadingSkeleton: state.reducerLoading.loadingSkeleton,
        logDO: state.reducerLogDO.logDO,
        rowData: state.reducerLogDO.rowDataLogDO,
        departments: state.reducerDepartment.departments,
        people: state.reducerPerson.people,
        equipment: state.reducerEquipment.equipment,
        tasks: state.reducerTask.tasks,
        files: state.reducerLogDO.files,
    }));

    // Инициализация стейта для показа спиннера загрузки при сохранении/удалении записи, обновлении
    // выпадающих списков и списка файлов
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [loadingSelectDep, setLoadingSelectDep] = useState(false);
    const [loadingSelectPeople, setLoadingSelectPeople] = useState(false);
    const [loadingSelectEquipment, setLoadingSelectEquipment] = useState(false);
    const [loadingSelectResponsible, setLoadingSelectResponsible] = useState(false);
    const [loadingSelectState, setLoadingSelectState] = useState(false);
    const [loadingSelectAcceptTask, setLoadingSelectAcceptTask] = useState(false);

    // Инициализация значений для выпадающих списков
    const [departmentsToOptions, setDepartmentsToOptions] = useState([]);
    const [peopleToOptions, setPeopleToOptions] = useState([]);
    const [equipmentToOptions, setEquipmentToOptions] = useState([]);
    const [responsibleToOptions, setResponsibleToOptions] = useState([]);
    const [stateToOptions, setStateToOptions] = useState([]);
    const [acceptTaskToOptions, setAcceptTaskToOptions] = useState([]);

    // Инициализация выбранного элемента из выпадающих списков
    const [selectDep, setSelectDep] = useState(null);
    const [selectPeople, setSelectPeople] = useState(null);
    const [selectEquipment, setSelectEquipment] = useState(null);
    const [selectResponsible, setSelectResponsible] = useState(null);
    const [selectState, setSelectState] = useState(null);
    const [selectAcceptTask, setSelectAcceptTask] = useState(null);

    // Инициализация хука useForm() от Form antd
    const [form] = Form.useForm();

    // Инициализация начлаьного значения в выпадающем списке
    let initialApplicant = null, initialEquipment = null, initialDepartment = null, initialResponsible = null,
        initialState = null, initialAcceptTask = null;

    // Если вкладка редактирования, то устанавливаем начальные значения для выпадающих списков
    if (rowData) {
        initialApplicant = rowData.applicant;
        initialEquipment = rowData.equipment;
        initialDepartment = rowData.department;
        initialResponsible = rowData.responsible;
        initialState = rowData.state;
        initialAcceptTask = rowData.acceptTask;
    }

    // Создание заголовка раздела и наименования формы
    const title = rowData ? 'Редактирование записи' : 'Создание записи';
    const name = rowData ? `control-ref-log-do-${rowData.name}` : "control-ref-log-do";

    // Обработка нажатия на кнопку "Сохранить"
    const saveHandler = (values) => {
        const selectOptions = {
            selectPeople, initialApplicant, selectEquipment, initialEquipment, selectDep, initialDepartment, selectResponsible,
            initialResponsible, selectState, initialState, selectAcceptTask, initialAcceptTask
        };

        const onSaveOptions = {
            url: "log-do", setLoadingSave, actionCreatorEdit: ActionCreator.ActionCreatorLogDO.editLogDO, rowData,
            actionCreatorCreate: ActionCreator.ActionCreatorLogDO.createLogDO, dataStore: logDO, onRemove, specKey,
        };

        HOCFunctions.onSave.onSaveHOCLogDO(values, files, selectOptions, onSaveOptions);
    }

    // Обработка нажатия на кнопку "Удалить"
    const deleteHandler = (setLoadingDelete, setVisiblePopConfirm) => {
        const onSaveOptions = {
            url: "log-do", setLoadingDelete, actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteLogDO, rowData,
            dataStore: logDO, onRemove, specKey, setVisiblePopConfirm
        };

        HOCFunctions.onDelete(setLoadingDelete, "logDO", onSaveOptions).then(null);
    }

    // Обработка нажатия на кнопку "Отмена"
    const cancelHandler = () => {
        const onCancelOptions = { onRemove, specKey };

        HOCFunctions.onCancel(setLoadingCancel, onCancelOptions).then(null);
    }

    // Изменение значения в выпадающих списках
    const changeHandler = (value, data) => {
        const dataStore = {departments, people, equipment, responsible: "responsible", tasks, acceptTask: "acceptTask"};

        const setSelect = {setSelectDep, setSelectPeople, setSelectEquipment, setSelectResponsible, setSelectState,
            setSelectAcceptTask};

        HOCFunctions.onChange(form, value, data, dataStore, setSelect);
    }

    // Обновление выпадающих списков
    const dropDownRenderHandler = (open, data) => {
        const dataStore = {departments, people, equipment, responsible: "responsible", tasks, acceptTask: "acceptTask"};
        const setLoading = {setLoadingSelectDep, setLoadingSelectPeople, setLoadingSelectEquipment,
            setLoadingSelectResponsible, setLoadingSelectState, setLoadingSelectAcceptTask};
        const setOptions = {setDepartmentsToOptions, setPeopleToOptions, setEquipmentToOptions, setResponsibleToOptions,
            setStateToOptions, setAcceptTaskToOptions};

        HOCFunctions.onDropDownRender(open, data, dataStore, setLoading, setOptions);
    }

    // Настройка компонента UploadComponent (вкладка "Файлы")
    const uploadProps = {
        files,
        model: "logDO",
        rowData,
        actionCreatorAdd: ActionCreator.ActionCreatorLogDO.addFile,
        actionCreatorDelete: ActionCreator.ActionCreatorLogDO.deleteFile
    }

    return (
        <Row className="container-tab" justify="center">
            <Col sm={{span: 24}} md={{span: 20}} lg={{span: 16}} xl={{span: 12}}>
                <Card className="card-style" bordered>
                    <Skeleton loading={loadingSkeleton} active>
                        <Meta
                            title={title}
                            description={
                                <Form
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 18}}
                                    style={{marginTop: "5%"}}
                                    form={form}
                                    name={name}
                                    onFinish={saveHandler}
                                    onFinishFailed={onFailed}
                                    initialValues={{
                                        _id: rowData ? rowData._id : "",
                                        numberLog: rowData ? rowData.numberLog : "",
                                        date: rowData && rowData.date ? moment(rowData.date, TabOptions.dateFormat) : moment(),
                                        applicant: rowData && rowData.applicant ? rowData.applicant.name : "Не выбрано",
                                        equipment: rowData && rowData.equipment ? rowData.equipment.name : "Не выбрано",
                                        notes: rowData ? rowData.notes : "",
                                        sendEmail: rowData ? rowData.sendEmail : false,
                                        department: rowData && rowData.department ? rowData.department.name : "Не выбрано",
                                        responsible: rowData && rowData.responsible ? rowData.responsible.name : "Не выбрано",
                                        task: rowData ? rowData.task : "",
                                        state: rowData && rowData.state ? rowData.state.name : "Не выбрано",
                                        dateDone: rowData && rowData.dateDone ? moment(rowData.dateDone, TabOptions.dateFormat) : null,
                                        content: rowData ? rowData.content : "",
                                        acceptTask: rowData && rowData.acceptTask ? rowData.acceptTask.name : "Не выбрано",
                                    }}
                                >
                                    <Tabs defaultActiveKey="name">
                                        <TabPane tab="Заявка" key="request" style={{paddingTop: '5%'}}>
                                            <Form.Item
                                                label="Дата заявки"
                                                name="date"
                                                rules={[{required: true, message: "Введите дату заявки!"}]}
                                            >
                                                <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat}/>
                                            </Form.Item>

                                            <Form.Item
                                                label="Заявитель"
                                                name="applicant"
                                                rules={[{
                                                    required: true,
                                                    transform: value => value === "Не выбрано" ? "" : value,
                                                    message: "Выберите заявителя!"
                                                }]}
                                            >
                                                <Select
                                                    options={peopleToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, people)}
                                                    loading={loadingSelectPeople}
                                                    onChange={(value) => changeHandler(value, people)}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Оборудование"
                                                name="equipment"
                                                rules={[{
                                                    required: true,
                                                    transform: value => value === "Не выбрано" ? "" : value,
                                                    message: "Выберите оборудование!"
                                                }]}
                                            >
                                                <Select
                                                    options={equipmentToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, equipment)}
                                                    loading={loadingSelectEquipment}
                                                    onChange={(value) => changeHandler(value, equipment)}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label="Описание"
                                                name="notes"
                                                rules={[{required: true, message: 'Введите описание заявки!'}]}
                                            >
                                                <TextArea rows={4}/>
                                            </Form.Item>

                                            <Form.Item
                                                label=""
                                                name="sendEmail"
                                                valuePropName="checked"
                                                wrapperCol={{offset: 6}}
                                            >
                                                <Checkbox>Уведомить исполнителей по электронной почте</Checkbox>
                                            </Form.Item>

                                            <Form.Item name="_id" hidden={true}>
                                                <Input/>
                                            </Form.Item>

                                            <Form.Item name="numberLog" hidden={true}>
                                                <Input/>
                                            </Form.Item>
                                        </TabPane>

                                        <TabPane tab="Выполнение" key="done" style={{paddingTop: '5%'}}>
                                            <Form.Item label="Подразделение" name="department">
                                                <Select
                                                    options={departmentsToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, departments)}
                                                    loading={loadingSelectDep}
                                                    onChange={(value) => changeHandler(value, departments)}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Ответственный" name="responsible">
                                                <Select
                                                    options={responsibleToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "responsible")}
                                                    loading={loadingSelectResponsible}
                                                    onChange={(value) => changeHandler(value, "responsible")}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Задание" name="task">
                                                <TextArea rows={4}/>
                                            </Form.Item>

                                            <Form.Item label="Состояние" name="state">
                                                <Select
                                                    options={stateToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, tasks)}
                                                    loading={loadingSelectState}
                                                    onChange={(value) => changeHandler(value, tasks)}
                                                />
                                            </Form.Item>

                                            <Form.Item label="Дата выполнения" name="dateDone">
                                                <DatePicker showTime={{format: "HH:mm"}} format={TabOptions.dateFormat}/>
                                            </Form.Item>

                                            <Form.Item label="Содержание работ" name="content">
                                                <TextArea rows={4}/>
                                            </Form.Item>

                                            <Form.Item label="Работа принята" name="acceptTask">
                                                <Select
                                                    options={acceptTaskToOptions}
                                                    onDropdownVisibleChange={(open) => dropDownRenderHandler(open, "acceptTask")}
                                                    loading={loadingSelectAcceptTask}
                                                    onChange={(value) => changeHandler(value, "acceptTask")}
                                                />
                                            </Form.Item>
                                        </TabPane>

                                        <TabPane tab="Файлы" key="files" style={{paddingTop: '5%'}}>
                                            <Form.Item name="files" wrapperCol={{span: 24}}>
                                                <UploadComponent {...uploadProps}/>
                                            </Form.Item>
                                        </TabPane>
                                    </Tabs>

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

                                        {CheckTypeTab(rowData, deleteHandler)}

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
                                </Form>
                            }
                        />
                    </Skeleton>
                </Card>
            </Col>
        </Row>
    )
}