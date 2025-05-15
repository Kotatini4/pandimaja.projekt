import React, { createContext, useState, useContext } from "react";

// Создание контекста
export const AuthContext = createContext();

// Провайдер, оборачивает всё приложение
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Функция выхода
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Хук для использования в компонентах
export function useAuth() {
    return useContext(AuthContext);
}
