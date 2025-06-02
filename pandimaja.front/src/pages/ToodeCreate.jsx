import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ToodeCreate() {
    const [form, setForm] = useState({
        nimetus: "",
        kirjeldus: "",
        hind: "",
        image: null,
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.nimetus || form.hind === "") {
            alert("Please fill out the required fields: name and price.");
            return;
        }

        const data = new FormData();
        data.append("nimetus", form.nimetus);
        data.append("kirjeldus", form.kirjeldus);
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
