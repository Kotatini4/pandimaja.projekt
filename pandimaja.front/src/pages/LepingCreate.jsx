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
        tootaja_id: "",
        date: "",
        date_valja_ostud: "",
        pant_hind: "",
        valja_ostud_hind: "",
        ostuhind: "",
        müügihind: "",
        leping_type: "",
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
            await api.post("/leping", form);
            alert("Contract created!");
            navigate("/leping");
        } catch (err) {
            console.error("Error creating contract:", err);
            alert(err.response?.data?.message || "Failed to create contract.");
        }
    };

    const lepingTypes = ["sale", "rent", "pawn"];

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
                            required
                            fullWidth
                        >
                            {klients.map((k) => (
                                <MenuItem key={k.klient_id} value={k.klient_id}>
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
                            required
                            fullWidth
                        >
                            {tooded.map((t) => (
                                <MenuItem key={t.toode_id} value={t.toode_id}>
                                    {t.nimetus}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Employee ID"
                            name="tootaja_id"
                            type="number"
                            value={form.tootaja_id}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        <TextField
                            label="Contract Date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />

                        <TextField
                            label="Buyback Date"
                            name="date_valja_ostud"
                            type="date"
                            value={form.date_valja_ostud}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />

                        <TextField
                            label="Pawn Value (€)"
                            name="pant_hind"
                            type="number"
                            value={form.pant_hind}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Buyback Value (€)"
                            name="valja_ostud_hind"
                            type="number"
                            value={form.valja_ostud_hind}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Purchase Price (€)"
                            name="ostuhind"
                            type="number"
                            value={form.ostuhind}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            label="Selling Price (€)"
                            name="müügihind"
                            type="number"
                            value={form.müügihind}
                            onChange={handleChange}
                            fullWidth
                        />

                        <TextField
                            select
                            label="Contract Type"
                            name="leping_type"
                            value={form.leping_type}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {lepingTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Button type="submit" variant="contained">
                            Submit
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
