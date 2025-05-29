import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
} from "@mui/material";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Leping() {
    const [contracts, setContracts] = useState([]);
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        api.get("/leping")
            .then((res) => setContracts(res.data))
            .catch((err) => console.error("Error fetching contracts:", err));
    }, []);

    const sorted = [...contracts].sort((a, b) => {
        if (sortBy === "date") {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "pant_hind") {
            return b.pant_hind - a.pant_hind;
        }
        return 0;
    });

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contracts
            </Typography>

            <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="pant_hind">Deposit Price</MenuItem>
                </Select>
            </FormControl>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Client</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Employee</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Deposit</TableCell>
                            <TableCell>Buyout</TableCell>
                            <TableCell>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.map((c) => (
                            <TableRow key={c.leping_id}>
                                <TableCell>{c.leping_id}</TableCell>
                                <TableCell>{c.klient_id}</TableCell>
                                <TableCell>{c.toode_id}</TableCell>
                                <TableCell>{c.tootaja_id}</TableCell>
                                <TableCell>{c.date}</TableCell>
                                <TableCell>{c.pant_hind}</TableCell>
                                <TableCell>{c.valja_ostud_hind}</TableCell>
                                <TableCell>{c.leping_type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                component={Link}
                to="/leping/create"
            >
                Create Contract
            </Button>
        </Container>
    );
}
