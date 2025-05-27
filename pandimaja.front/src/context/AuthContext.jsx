import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp < now) {
                    console.log("Token expired");
                    localStorage.removeItem("token");
                    setUser(null);
                    return;
                }

                setUser({
                    roleId: decoded.roleId,
                    kood: decoded.kood,
                    name: decoded.name,
                });
            } catch (e) {
                console.error("Ошибка декодирования токена", e);
                localStorage.removeItem("token");
                setUser(null);
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
