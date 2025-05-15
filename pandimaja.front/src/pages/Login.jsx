// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [kood, setKood] = useState("");
    const [pass, setPass] = useState("");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { kood, pass });
            localStorage.setItem("token", res.data.token);
            setUser({ kood });
            navigate("/");
        } catch (err) {
            alert("Ошибка входа: неверный код или пароль");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <h2>Вход в систему</h2>
            <div>
                <label>Kood:</label>
                <br />
                <input
                    type="text"
                    value={kood}
                    onChange={(e) => setKood(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Пароль:</label>
                <br />
                <input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Войти</button>
        </form>
    );
}
