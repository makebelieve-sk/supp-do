import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import './App.css';

import {useRoutes} from './hooks/routes.hook';
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/authContext";

export const App = () => {
    // Определяем контексту начальные значения, полученные из хука useAuth
    const {login, logout, token, userId, user} = useAuth();
    // Инициализируем флаг авторизации
    const isAuthenticated = !!token;
    // Определяем роутинг приложения
    const routes = useRoutes(isAuthenticated);

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthenticated, user
        }}>
            <Router>
                {routes}
            </Router>
        </AuthContext.Provider>
    )
};
