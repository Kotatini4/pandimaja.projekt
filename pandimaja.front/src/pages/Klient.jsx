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
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const statusOptions = ["active", "blocked"];

    // Загрузка списка
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
            console.error(err);
            alert(err.response?.data?.message || "Error fetching clients");
        }
    };

    useEffect(() => {
        fetchClients();
    }, [page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchClients();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Начало редактирования
    const handleEdit = (c) => {
        setForm(c);
        setEditingId(c.klient_id);
    };

    // Удаление
    const handleDelete = async (id) => {
        if (!window.confirm("Really delete this client?")) return;
        try {
            await api.delete(`/klient/${id}`);
            fetchClients();
            alert("Client deleted");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error deleting client");
        }
    };

    // Сохранение
    const handleSave = async () => {
        // Клиентская валидация
        if (!form.nimi || !form.perekonnanimi || !form.kood) {
            alert("First name, last name and kood are required.");
            return;
        }
        if (!/^[1-6][0-9]{10}$/.test(form.kood)) {
            alert("Kood must be 11 digits and start with 1–6.");
            return;
        }
        if (form.tel && !/^\+?[0-9]+$/.test(form.tel)) {
            alert("Phone must contain only digits and optional leading +.");
            return;
        }

        try {
            await api.patch(`/klient/${form.klient_id}`, form);
            setEditingId(null);
            fetchClients();
            alert("Client updated successfully");
        } catch (err) {
            console.error(err);
            // сообщение от сервера
            alert(err.response?.data?.message || "Error saving client");
        }
    };

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

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
                            <TableCell>Kood</TableCell>
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
                                    {editingId === c.klient_id ? (
                                        <TextField
                                            size="small"
                                            value={form.nimi || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    nimi: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        c.nimi
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === c.klient_id ? (
                                        <TextField
                                            size="small"
                                            value={form.perekonnanimi || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    perekonnanimi:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        c.perekonnanimi
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === c.klient_id ? (
                                        <TextField
                                            size="small"
                                            value={form.kood || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    kood: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        c.kood
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === c.klient_id ? (
                                        <TextField
                                            size="small"
                                            value={form.tel || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    tel: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        c.tel
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === c.klient_id ? (
                                        <TextField
                                            size="small"
                                            value={form.aadres || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    aadres: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        c.aadres
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === c.klient_id ? (
                                        <Select
                                            size="small"
                                            value={form.status || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    status: e.target.value,
                                                })
                                            }
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
                                    {editingId === c.klient_id ? (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleEdit(c)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
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
