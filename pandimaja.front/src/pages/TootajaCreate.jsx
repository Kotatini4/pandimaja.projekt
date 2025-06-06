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
        const { nimi, perekonnanimi, kood, pass } = form;

        if (!nimi || !perekonnanimi || !kood || !pass) {
            alert("Name, surname, ID and password are required.");
            return;
        }

        if (!/^[1-6][0-9]{10}$/.test(kood)) {
            alert("Kood must be 11 digits and start with 1–6.");
            return;
        }

        // Проверка даты рождения из kood
        const genderCode = parseInt(kood[0]);
        const yearPart = kood.substring(1, 3);
        const month = parseInt(kood.substring(3, 5));
        const day = parseInt(kood.substring(5, 7));

        let year;
        if (genderCode === 1 || genderCode === 2)
            year = 1800 + parseInt(yearPart);
        else if (genderCode === 3 || genderCode === 4)
            year = 1900 + parseInt(yearPart);
        else if (genderCode === 5 || genderCode === 6)
            year = 2000 + parseInt(yearPart);
        else {
            alert("Invalid gender/century code in kood.");
            return;
        }

        const dateValid = !isNaN(
            Date.parse(
                `${year}-${String(month).padStart(2, "0")}-${String(
                    day
                ).padStart(2, "0")}`
            )
        );
        if (!dateValid) {
            alert("Invalid birthdate in kood.");
            return;
        }

        if (pass.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        try {
            await api.post("/auth/register", form);
            alert("User registered successfully!");
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
            const msg =
                err.response?.data?.message ||
                "Unknown error while adding user.";
            alert(msg);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Employee
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="First Name"
                            name="nimi"
                            value={form.nimi}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="perekonnanimi"
                            value={form.perekonnanimi}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Isikukood (11 digits)"
                            name="kood"
                            value={form.kood}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Password"
                            name="pass"
                            type="password"
                            value={form.pass}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone"
                            name="tel"
                            value={form.tel}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Address"
                            name="aadres"
                            value={form.aadres}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Role"
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
                            Add Employee
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
