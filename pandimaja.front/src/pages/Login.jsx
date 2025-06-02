import React, { useState, useContext } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Stack,
} from "@mui/material";
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
            setUser(res.data.user);
            navigate("/");
        } catch (err) {
            alert(" Login error: incorrect code or password.");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign In
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Kood"
                            variant="outlined"
                            value={kood}
                            onChange={(e) => setKood(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
}
