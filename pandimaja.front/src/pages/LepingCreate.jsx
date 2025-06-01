import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Autocomplete,
    Button,
    Typography,
    Paper,
    Stack,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { et } from "date-fns/locale";

function formatForInput(date) {
    return new Date(date).toISOString().split("T")[0];
}

export default function LepingCreate() {
    const [klients, setKlients] = useState([]);
    const [tooded, setTooded] = useState([]);
    const [loadingKlient, setLoadingKlient] = useState(false);
    const [loadingToode, setLoadingToode] = useState(false);

    const today = new Date();
    const datePlus30 = new Date(today);
    datePlus30.setDate(today.getDate() + 30);

    const [form, setForm] = useState({
        klient_id: "",
        toode_id: "",
        tootaja_id: "",
        date: today,
        date_valja_ostud: datePlus30,
        pant_hind: "",
        valja_ostud_hind: "",
        ostuhind: "",
        muugihind: "",
        leping_type: "",
    });

    const navigate = useNavigate();

    const searchKlients = debounce((query) => {
        if (!query) return;
        setLoadingKlient(true);
        api.get(`/klient/autocomplete?search=${encodeURIComponent(query)}&type=${encodeURIComponent(form.leping_type)}`)
            .then((res) => setKlients(res.data))
            .catch((err) => console.error("Error searching klients:", err))
            .finally(() => setLoadingKlient(false));
    }, 300);

    const searchTooded = debounce((query) => {
        if (!query) return;
        setLoadingToode(true);
        api.get(`/toode/autocomplete?search=${encodeURIComponent(query)}&type=${encodeURIComponent(form.leping_type)}`)
            .then((res) => setTooded(res.data))
            .catch((err) => console.error("Error searching tooded:", err))
            .finally(() => setLoadingToode(false));
    }, 300);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                date: formatForInput(form.date),
                date_valja_ostud: formatForInput(form.date_valja_ostud),
            };
            await api.post("/leping", payload);
            alert("Contract created!");
            navigate("/leping");
        } catch (err) {
            console.error("Error creating contract:", err);
            alert(err.response?.data?.message || "Failed to create contract.");
        }
    };

    const lepingTypes = ["pant", "ost", "müük"];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={et}>
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Create Contract
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={2}>
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
                            <Autocomplete
                                options={klients}
                                loading={loadingKlient}
                                getOptionLabel={(option) => `${option.nimi} ${option.perekonnanimi} (${option.kood})`}
                                onInputChange={(e, value) => searchKlients(value)}
                                onChange={(event, newValue) => {
                                    setForm((prev) => ({ ...prev, klient_id: newValue?.klient_id || "" }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Client"
                                        required
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingKlient ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Autocomplete
                                options={tooded}
                                loading={loadingToode}
                                getOptionLabel={(option) => `#${option.toode_id} ${option.nimetus || ""}`}
                                onInputChange={(e, value) => searchTooded(value)}
                                onChange={(event, newValue) => {
                                    setForm((prev) => ({ ...prev, toode_id: newValue?.toode_id || "" }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Product"
                                        required
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingToode ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <TextField
                                label="Employee ID"
                                name="tootaja_id"
                                type="number"
                                value={form.tootaja_id}
                                onChange={handleChange}
                                required
                                fullWidth
                            />

                            <DatePicker
                                label="Contract Date"
                                value={form.date}
                                onChange={(newDate) => {
                                    const nextDate = new Date(newDate);
                                    nextDate.setDate(nextDate.getDate() + 30);
                                    setForm((prev) => ({
                                        ...prev,
                                        date: newDate,
                                        date_valja_ostud: nextDate,
                                    }));
                                }}
                                format="dd.MM.yyyy"
                                slotProps={{ textField: { fullWidth: true } }}
                            />

                            <DatePicker
                                label="Buyback Date"
                                value={form.date_valja_ostud}
                                onChange={(newDate) => {
                                    setForm((prev) => ({ ...prev, date_valja_ostud: newDate }));
                                }}
                                format="dd.MM.yyyy"
                                slotProps={{ textField: { fullWidth: true } }}
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
                                name="muugihind"
                                type="number"
                                value={form.muugihind}
                                onChange={handleChange}
                                fullWidth
                            />



                            <Button type="submit" variant="contained">
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Container>
        </LocalizationProvider>
    );
}
