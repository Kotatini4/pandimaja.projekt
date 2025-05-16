import React, { createContext, useState, useContext, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwt_decode(token);
                // если в токене есть роль, кикод и имя — восстанавливаем
                setUser({
                    roleId: decoded.roleId,
                    kood: decoded.kood,
                    name: decoded.name,
                });
            } catch (e) {
                console.error("Ошибка при декодировании токена", e);
                localStorage.removeItem("token");
            }
        }
    }, []);

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

export function useAuth() {
    return useContext(AuthContext);
}
