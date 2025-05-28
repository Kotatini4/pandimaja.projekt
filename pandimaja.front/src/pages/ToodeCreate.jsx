import React, { useState, useEffect } from "react";
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

export default function ToodeCreate() {
    const [form, setForm] = useState({
        nimetus: "",
        kirjeldus: "",
        status_id: "",
        hind: "",
        image: null,
    });
    const [statuses, setStatuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Load product statuses
        api.get("/status_toode")
            .then((res) => setStatuses(res.data))
            .catch((err) => console.error("Error loading statuses:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nimetus || !form.status_id || form.hind === "") {
            alert("Please fill out the required fields: name, status, price.");
            return;
        }

        const data = new FormData();
        data.append("nimetus", form.nimetus);
        data.append("kirjeldus", form.kirjeldus);
        data.append("status_id", form.status_id);
        data.append("hind", form.hind);
        if (form.image) {
            data.append("image", form.image);
        }

        try {
            await api.post("/toode", data);
            alert("Product added successfully!");
            navigate("/toode");
        } catch (err) {
            console.error("Error creating product:", err);
            alert("Failed to create product.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Product
                </Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            name="nimetus"
                            value={form.nimetus}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            name="kirjeldus"
                            value={form.kirjeldus}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <TextField
                            label="Price"
                            name="hind"
                            type="number"
                            value={form.hind}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Status"
                            name="status_id"
                            value={form.status_id}
                            onChange={handleChange}
                            fullWidth
                            required
                        >
                            {statuses.map((status) => (
                                <MenuItem
                                    key={status.status_id}
                                    value={status.status_id}
                                >
                                    {status.nimetus}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button variant="contained" component="label">
                            Upload Image
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {form.image && (
                            <Typography variant="body2">
                                Selected file: {form.image.name}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Add Product
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}
