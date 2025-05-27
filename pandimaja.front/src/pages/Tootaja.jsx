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
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import api from "../services/api";

export default function Tootaja() {
    const [toggledEditId, setToggledEditId] = useState(null);
    const [form, setForm] = useState({});
    const [search, setSearch] = useState("");
    const [workers, setWorkers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
        { id: 3, name: "NA" },
    ];

    const fetchWorkers = async () => {
        try {
            if (search.trim()) {
                const res = await api.get("/tootaja/search", {
                    params: {
                        nimi: search.trim(),
                        perekonnanimi: search.trim(),
                        kood: search.trim(),
                    },
                });
                setWorkers(res.data);
                setTotal(res.data.length);
            } else {
                const res = await api.get(
                    `/tootaja?page=${page + 1}&limit=${rowsPerPage}`
                );
                setWorkers(res.data.data);
                setTotal(res.data.total);
            }
        } catch (err) {
            console.error("Error loading employees", err);
            setWorkers([]);
            setTotal(0);
            alert(err.response?.data?.message || "Error loading employees");
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, [page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                fetchWorkers();
            } else {
                setPage(0);
                fetchWorkers();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleEdit = (worker) => {
        setToggledEditId(worker.tootaja_id);
        setForm({ ...worker, pass: "" });
    };

    const handleDelete = async (id) => {
        if (
            window.confirm("Are you sure you want to delete this employee?") &&
            window.confirm("This action cannot be undone. Proceed?") &&
            window.confirm("Final confirmation: Delete permanently?")
        ) {
            try {
                await api.delete(`/tootaja/${id}`);
                fetchWorkers();
                alert("Employee deleted.");
            } catch (err) {
                const msg =
                    err.response?.data?.message ||
                    "Unknown error while deleting.";
                alert(msg);
            }
        }
    };

    const handleSave = async () => {
        if (!form.nimi || !form.perekonnanimi || !form.kood) {
            alert("Name, surname, and kood are required.");
            return;
        }

        if (!/^[0-9]{11}$/.test(form.kood)) {
            alert("Kood must be exactly 11 digits.");
            return;
        }

        if (form.pass && form.pass.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (form.tel && !/^\+?[0-9]+$/.test(form.tel)) {
            alert("Phone must contain only numbers and optional leading +.");
            return;
        }

        if (form.role_id && ![1, 2, 3].includes(Number(form.role_id))) {
            alert("Role must be 1 (admin), 2 (user), or 3 (NA).");
            return;
        }

        try {
            await api.patch(`/tootaja/${form.tootaja_id}`, form);
            setToggledEditId(null);
            fetchWorkers();
        } catch (err) {
            const msg =
                err.response?.data?.message || "Unknown error while saving.";
            alert(msg);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Employee List
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
                            <TableCell>Password</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workers.map((w) => (
                            <TableRow key={w.tootaja_id}>
                                <TableCell>{w.tootaja_id}</TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
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
                                        w.nimi
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
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
                                        w.perekonnanimi
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
                                        <TextField
                                            value={form.kood || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    kood: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        w.kood
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
                                        <TextField
                                            value={form.pass || ""}
                                            type="password"
                                            placeholder="New password"
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    pass: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            ••••••
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
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
                                        w.tel
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
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
                                        w.aadres
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
                                        <Select
                                            value={form.role_id || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    role_id: e.target.value,
                                                })
                                            }
                                            size="small"
                                            fullWidth
                                        >
                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        roles.find((r) => r.id === w.role_id)
                                            ?.name || "?"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === w.tootaja_id ? (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                onClick={handleSave}
                                                variant="contained"
                                                size="small"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setToggledEditId(null)
                                                }
                                                variant="outlined"
                                                size="small"
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    ) : (
                                        <Stack direction="column" spacing={1}>
                                            <Button
                                                onClick={() => handleEdit(w)}
                                                size="small"
                                                variant="outlined"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDelete(w.tootaja_id)
                                                }
                                                size="small"
                                                color="error"
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
