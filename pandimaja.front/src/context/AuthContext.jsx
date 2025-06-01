import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null); // 👈 добавляем token
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                const now = Date.now() / 1000;
                if (decoded.exp && decoded.exp < now) {
                    console.log("Token expired");
                    localStorage.removeItem("token");
                    setUser(null);
                    setToken(null);
                } else {
                    setUser({
                        roleId: decoded.roleId,
                        kood: decoded.kood,
                        name: decoded.name,
                    });
                    setToken(storedToken); // 👈 сохраняем token
                }
            } catch (e) {
                console.error("Ошибка декодирования токена", e);
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, token, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
