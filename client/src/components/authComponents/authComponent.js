import React, {useState, useContext} from 'react';
import {Button, Card, Checkbox, Col, Form, Input, Row} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom";

import {AuthContext} from "../../context/authContext";
import {request} from "../helpers/request.helper";

export const AuthComponent = ({setRegForm, setChangePass}) => {
    const [loadingLogin, setLoadingLogin] = useState(false);

    const auth = useContext(AuthContext);

    // Функция входа пользователя
    const login = async (values) => {
        try {
            setLoadingLogin(true);

            const data = await request('/api/auth/login', 'POST', values);

            setLoadingLogin(false);

            if (data) {
                auth.login(data.token, data.userId, data.user);
            }
        } catch (e) {
            // При ошибке от сервера, останавливаем спиннер загрузки
            setLoadingLogin(false);
        }
    };

    return (
        <Row align="middle" justify="center" style={{height: '100vh'}}>
            <Col>
                <Card title="Авторизация" style={{width: 400}}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={login}
                    >
                        <Form.Item
                            name="login"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите логин',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Логин"/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Введите пароль',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon"/>}
                                type="password"
                                placeholder="Пароль"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Запомнить меня</Checkbox>
                            </Form.Item>

                            <Link className="login-form-forgot" to="/change-password" onClick={() => {
                                setRegForm(false);
                                setChangePass(true);
                            }}>
                                Забыл(а) пароль
                            </Link>
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loadingLogin} type="primary" htmlType="submit" className="login-form-button">
                                Войти
                            </Button>
                            Или <Link to="/registration" onClick={() => {
                            setRegForm(true);
                            setChangePass(false);
                        }}>зарегистрируйтесь сейчас</Link>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}