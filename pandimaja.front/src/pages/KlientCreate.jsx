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
import { useNavigate } from "react-router-dom";

export default function KlientCreate() {
    const [form, setForm] = useState({
        nimi: "",
        perekonnanimi: "",
        kood: "",
        tel: "",
        aadres: "",
        status: "active",
    });

    const navigate = useNavigate();

    const statuses = ["active", "blocked"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nimi || !form.perekonnanimi || !form.kood) {
            alert("Name, surname, and ID code are required.");
            return;
        }

        if (!/^[0-9]{11}$/.test(form.kood)) {
            alert("Kood must be exactly 11 digits.");
            return;
        }

        try {
            await api.post("/klient", form);
            alert("Client created successfully!");
            navigate("/klient");
        } catch (err) {
            const msg = err.response?.data?.message || "Error creating client.";
            alert(msg);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Client
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
                            label="Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            fullWidth
                        >
                            {statuses.map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button type="submit" variant="contained">
                            Add Client
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
