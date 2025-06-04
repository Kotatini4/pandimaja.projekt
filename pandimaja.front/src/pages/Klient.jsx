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
    useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import api from "../services/api";

export default function Klient() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [clients, setClients] = useState([]);
    const [form, setForm] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const statusOptions = ["active", "blocked"];

    const fetchClients = async () => {
        try {
            const params = {
                page: page + 1,
                limit: rowsPerPage,
            };

            if (statusFilter !== "all") {
                params.status = statusFilter;
            }

            const trimmed = search.trim();

            if (trimmed.length > 0) {
                const res = await api.get("/klient/search", {
                    params: {
                        ...params,
                        nimi: trimmed,
                        perekonnanimi: trimmed,
                        kood: trimmed,
                    },
                });
                setClients(res.data);
                setTotal(res.data.length);
            } else {
                const res = await api.get("/klient", { params });
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
        }, 300);
        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const handleEdit = (c) => {
        setForm(c);
        setEditingId(c.klient_id);
    };

    const handleDelete = async (id) => {
        const confirms = [
            "Are you sure you want to delete this client?",
            "Are you REALLY sure?",
            "This action is irreversible. Delete anyway?",
        ];

        for (const message of confirms) {
            if (!window.confirm(message)) return;
        }

        try {
            await api.delete(`/klient/${id}`);
            fetchClients();
            alert("Client deleted");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Error deleting client");
        }
    };

    const handleSave = async () => {
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

            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={2}
                sx={{ mb: 2 }}
            >
                <TextField
                    label="Search by name or ID code"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
                <Select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(0);
                    }}
                    displayEmpty
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="all">All statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="blocked">Blocked</MenuItem>
                </Select>
            </Stack>

            {isMobile ? (
                <Stack spacing={2}>
                    {clients.map((c) => (
                        <Paper key={c.klient_id} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">
                                <b>ID:</b> {c.klient_id}
                            </Typography>
                            {[
                                "nimi",
                                "perekonnanimi",
                                "kood",
                                "tel",
                                "aadres",
                                "status",
                            ].map((field) => (
                                <Typography key={field}>
                                    <b>
                                        {field.charAt(0).toUpperCase() +
                                            field.slice(1)}
                                        :
                                    </b>{" "}
                                    {editingId === c.klient_id ? (
                                        field === "status" ? (
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
                                            <TextField
                                                size="small"
                                                value={form[field] || ""}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        [field]: e.target.value,
                                                    })
                                                }
                                            />
                                        )
                                    ) : (
                                        c[field]
                                    )}
                                </Typography>
                            ))}
                            <Stack direction="row" spacing={1} mt={2}>
                                {editingId === c.klient_id ? (
                                    <>
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
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
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
                                            variant="outlined"
                                            onClick={() =>
                                                handleDelete(c.klient_id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            ) : (
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
                                        <Stack direction="column" spacing={1}>
                                            {editingId === c.klient_id ? (
                                                <>
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
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleEdit(c)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        onClick={() =>
                                                            handleDelete(
                                                                c.klient_id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </>
                                            )}
                                        </Stack>
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
            )}
        </Container>
    );
}
