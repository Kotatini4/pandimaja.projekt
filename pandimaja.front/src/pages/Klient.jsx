import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    TablePagination,
    Select,
    MenuItem,
    Stack,
} from "@mui/material";
import api from "../services/api";

export default function Klient() {
    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({});
    const [toggledEditId, setToggledEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                fetchClients();
            } else {
                setPage(0);
                fetchClients();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchClients = async () => {
        try {
            if (search.trim()) {
                const res = await api.get("/klient/search", {
                    params: {
                        nimi: search.trim(),
                        perekonnanimi: search.trim(),
                        kood: search.trim(),
                    },
                });
                setClients(res.data);
                setTotal(res.data.length);
            } else {
                const res = await api.get(
                    `/klient?page=${page + 1}&limit=${rowsPerPage}`
                );
                setClients(res.data.data);
                setTotal(res.data.total);
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
            setClients([]);
            setTotal(0);
            alert(err.response?.data?.message || "Failed to fetch clients");
        }
    };

    useEffect(() => {
        if (page === 0) {
            fetchClients();
        } else {
            setPage(0);
        }
    }, [search]);

    useEffect(() => {
        fetchClients();
    }, [page]);

    const handleSave = async () => {
        try {
            await api.patch(`/klient/${form.klient_id}`, form);
            setToggledEditId(null);
            fetchClients();
        } catch (err) {
            const msg = err.response?.data?.message || "Error saving client.";
            alert(msg);
        }
    };

    const handleDelete = async (id) => {
        const confirm1 = window.confirm("Delete this client?");
        if (!confirm1) return;
        try {
            await api.delete(`/klient/${id}`);
            fetchClients();
        } catch (err) {
            alert("Error deleting client");
        }
    };

    const handleEdit = (client) => {
        setForm(client);
        setToggledEditId(client.klient_id);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    const statusOptions = ["active", "blocked"];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Clients
            </Typography>

            <TextField
                label="Search by name or ID code"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>ID Code</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map((c) => (
                            <TableRow key={c.klient_id}>
                                <TableCell>{c.klient_id}</TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <TextField
                                            value={form.nimi || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    nimi: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        c.nimi
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <TextField
                                            value={form.perekonnanimi || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    perekonnanimi:
                                                        e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        c.perekonnanimi
                                    )}
                                </TableCell>
                                <TableCell>{c.kood}</TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <TextField
                                            value={form.tel || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    tel: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        c.tel
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <TextField
                                            value={form.aadres || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    aadres: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        c.aadres
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <Select
                                            value={form.status || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    status: e.target.value,
                                                })
                                            }
                                            size="small"
                                        >
                                            {statusOptions.map((s) => (
                                                <MenuItem key={s} value={s}>
                                                    {s}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        c.status
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === c.klient_id ? (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    setToggledEditId(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEdit(c)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(c.klient_id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Container>
    );
}
