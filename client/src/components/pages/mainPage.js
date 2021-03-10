// Главная страница
import React, {useState, useEffect, useContext} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Layout, Menu, Button, Tabs, Row, Col, Modal, Dropdown, Avatar} from "antd";
import {MenuUnfoldOutlined, MenuFoldOutlined, QuestionCircleOutlined, DownOutlined} from "@ant-design/icons";

import {LogDORoute} from "../../routes/route.LogDO";
import {menuItems} from "../../options/global.options/global.options";
import {AuthContext} from "../../context/authContext";
import {ActionCreator} from "../../redux/combineActions";
import OpenTableTab from "../helpers/tab.helpers/openTableTab";
import logo from "../../assets/logo.png";

const {Header, Sider, Content, Footer} = Layout;
const {SubMenu} = Menu;
const {TabPane} = Tabs;

export const MainPage = () => {
    // Получаем вкладки из хранилища(текущие, активную и последнюю)
    const {tabs, activeKey, prevActiveTab} = useSelector(state => state.reducerTab);
    const dispatch = useDispatch();

    // Получение контекста авторизации (токен, id пользователя, пользователь, функции входа/выхода, флаг авторизации)
    const auth = useContext(AuthContext);

    // Создание стейтов для скрытия/раскрытия боковой панели, активной вкладки и показа модального окна
    const [collapsed, setCollapsed] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Загрузка главного раздела "Журнал дефектов и отказов"
    useEffect(() => {
        const getItems = async () => {
            await LogDORoute.getAll();
        }

        getItems().then(null);
    }, []);

    // Фукнция удаления вкладки
    const onRemove = (targetKey, action) => {
        if (action === 'remove') {
            let index = 0;
            let lastIndex = -1;

            tabs.forEach((pane, i) => {
                if (pane.key === targetKey) {
                    index = i;
                }
                if (prevActiveTab && pane.key === prevActiveTab) {
                    lastIndex = i;
                }
            });

            const panes = tabs.filter(pane => pane.key !== targetKey);

            if (panes.length && activeKey === targetKey) {
                if (panes[lastIndex] && lastIndex >= 0) {
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[lastIndex].key));
                } else {
                    dispatch(ActionCreator.ActionCreatorTab.setActiveKey(panes[0].key));
                }
            }

            dispatch(ActionCreator.ActionCreatorTab.removeTab(index));
        }
    };

    // Изменяем активную вкладку
    const onChange = activeKey => {
        dispatch(ActionCreator.ActionCreatorTab.setActiveKey(activeKey));
    };

    // Компонент выпадающего списка, содержит действия для управления учетной записью пользователя
    const dropdownMenu = <Menu>
        <Menu.Item key="changePassword">Сменить пароль</Menu.Item>
        <Menu.Item key="logout" onClick={() => {
            auth.logout();
        }}>Выйти</Menu.Item>
    </Menu>;

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={300}>
                <div className="logo">
                    <img src={logo} alt="Лого" className="logo-image" onClick={() => OpenTableTab(
                        'Журнал дефектов и отказов',
                        'logDO',
                        'log-do',
                        ActionCreator.ActionCreatorLogDO.getAllLogDO,
                        LogDORoute
                    )}/>
                    {collapsed ? null : 'СУПП ДО'}
                </div>
                <Menu theme="dark" mode="inline">
                    {
                        menuItems.map(group => (
                            <SubMenu key={group.key} icon={group.icon} title={group.title}>
                                {
                                    group.children.map(subgroup => (
                                        <SubMenu title={subgroup.title} key={subgroup.key}>
                                            {
                                                subgroup.children.map(item => (
                                                    <Menu.Item
                                                        key={item.key}
                                                        onClick={() => OpenTableTab(
                                                            item.title,
                                                            item.key,
                                                            item.url,
                                                            item.dispatchAction,
                                                            item.model
                                                        )}
                                                    >{item.title}</Menu.Item>
                                                ))
                                            }
                                        </SubMenu>
                                    ))
                                }
                            </SubMenu>
                        ))
                    }
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background header-component">
                    <div>
                        <Button type="primary" onClick={() => setCollapsed(!collapsed)} style={{marginLeft: 15}}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </div>
                    <div className="logo">СУПП ДО</div>
                    <div className="user">
                        <Dropdown overlay={dropdownMenu} trigger={['click']}>
                            <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                                <Avatar>{auth.user ? auth.user.login[0] : 'U'}</Avatar> {auth.user ? auth.user.login : ""} <DownOutlined/>
                            </a>
                        </Dropdown>
                    </div>
                </Header>
                <Content className="site-layout-background content-component">
                    {tabs && tabs.length > 0 ?
                        <Tabs
                            hideAdd
                            onChange={onChange}
                            activeKey={activeKey}
                            type="editable-card"
                            onEdit={onRemove}
                        >
                            {tabs.map(tab => (
                                <TabPane tab={tab.title} key={tab.key}>
                                    {<tab.content
                                        specKey={tab.key}
                                        onRemove={onRemove}
                                    />}
                                </TabPane>
                            ))}
                        </Tabs> :
                        <div style={{textAlign: 'center', padding: 10}}>Нет открытых вкладок</div>}
                </Content>
                <Footer>
                    <Row>
                        <Col span={18} className="footer_text">
                            Система управления производственным процессом. Дефекты и отказы. 2021. Версия 1.0.0
                        </Col>
                        <Col span={6}>
                            <p onClick={() => setIsModalVisible(true)} className="footer_text cursor">
                                <QuestionCircleOutlined/> Помощь
                            </p>
                            <Modal
                                title="Помощь"
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                cancelText="Закрыть"
                            >
                                <p>Помощь!</p>
                            </Modal>
                        </Col>
                    </Row>
                </Footer>
            </Layout>
        </Layout>
    );
}