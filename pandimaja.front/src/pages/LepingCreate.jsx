import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    MenuItem,
    Button,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LepingCreate() {
    const [klients, setKlients] = useState([]);
    const [tooded, setTooded] = useState([]);
    const [form, setForm] = useState({
        klient_id: "",
        toode_id: "",
        hind: "",
        kuupaev: "",
        kestvus: "",
        tootaja_id: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        api.get("/klient")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.data;
                setKlients(data);
            })
            .catch((err) => {
                console.error("Error fetching klients:", err);
            });

        api.get("/toode")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.data;
                setTooded(data);
            })
            .catch((err) => {
                console.error("Error fetching tooded:", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/leping", form);
            alert("Contract created!");
            navigate("/leping");
        } catch (err) {
            console.error("Error creating contract:", err);
            alert(err.response?.data?.message || "Failed to create contract.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Create Contract
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Client"
                            name="klient_id"
                            value={form.klient_id}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {Array.isArray(klients) &&
                                klients.map((k) => (
                                    <MenuItem
                                        key={k.klient_id}
                                        value={k.klient_id}
                                    >
                                        {k.nimi} {k.perekonnanimi} ({k.kood})
                                    </MenuItem>
                                ))}
                        </TextField>

                        <TextField
                            select
                            label="Product"
                            name="toode_id"
                            value={form.toode_id}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {Array.isArray(tooded) &&
                                tooded.map((t) => (
                                    <MenuItem
                                        key={t.toode_id}
                                        value={t.toode_id}
                                    >
                                        {t.nimetus}
                                    </MenuItem>
                                ))}
                        </TextField>

                        <TextField
                            label="Price (€)"
                            name="hind"
                            type="number"
                            value={form.hind}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Date"
                            name="kuupaev"
                            type="date"
                            value={form.kuupaev}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Duration (months)"
                            name="kestvus"
                            type="number"
                            value={form.kestvus}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="Employee ID"
                            name="tootaja_id"
                            type="number"
                            value={form.tootaja_id}
                            onChange={handleChange}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
