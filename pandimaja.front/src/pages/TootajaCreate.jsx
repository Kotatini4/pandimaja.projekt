import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper,
    Stack,
} from "@mui/material";
import api from "../services/api";

export default function TootajaCreate() {
    const [form, setForm] = useState({
        nimi: "",
        perekonnanimi: "",
        kood: "",
        tel: "",
        aadres: "",
        pass: "",
        role_id: 2,
    });

    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
        { id: 3, name: "NA" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nimi || !form.perekonnanimi || !form.kood || !form.pass) {
            alert("Имя, фамилия, код и пароль обязательны.");
            return;
        }

        if (!/^[0-9]{11}$/.test(form.kood)) {
            alert("Kood должен содержать ровно 11 цифр.");
            return;
        }

        if (form.pass.length < 6) {
            alert("Пароль должен быть не менее 6 символов.");
            return;
        }

        try {
            await api.post("/auth/register", form);
            alert("Пользователь успешно добавлен!");
            setForm({
                nimi: "",
                perekonnanimi: "",
                kood: "",
                tel: "",
                aadres: "",
                pass: "",
                role_id: 2,
            });
        } catch (err) {
            if (err.response?.data?.message) {
                const msg = err.response.data.message;

                if (msg.includes("User with this kood already exists")) {
                    alert("❗ Такой пользователь уже существует.");
                } else {
                    alert("Ошибка: " + msg);
                }
            } else {
                alert("Неизвестная ошибка при добавлении пользователя.");
            }
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Добавить нового работника
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Имя"
                            name="nimi"
                            value={form.nimi}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Фамилия"
                            name="perekonnanimi"
                            value={form.perekonnanimi}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Kood (11 цифр)"
                            name="kood"
                            value={form.kood}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Пароль"
                            name="pass"
                            type="password"
                            value={form.pass}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Телефон"
                            name="tel"
                            value={form.tel}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Адрес"
                            name="aadres"
                            value={form.aadres}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Роль"
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                            fullWidth
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button type="submit" variant="contained">
                            Добавить
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
