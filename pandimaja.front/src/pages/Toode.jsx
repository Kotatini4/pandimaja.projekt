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
    Stack,
    Select,
    MenuItem,
} from "@mui/material";
import api from "../services/api";

export default function Toode() {
    const [products, setProducts] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [form, setForm] = useState({});
    const [toggledEditId, setToggledEditId] = useState(null);
    const [nameFilter, setNameFilter] = useState("");
    const [descFilter, setDescFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchStatuses();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [nameFilter, descFilter, statusFilter]);

    const fetchStatuses = async () => {
        try {
            const res = await api.get("/status_toode");
            setStatuses(res.data);
        } catch (err) {
            console.error("Failed to load statuses:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            if (nameFilter || descFilter || statusFilter) {
                const res = await api.get("/toode/search", {
                    params: {
                        nimetus: nameFilter,
                        kirjeldus: descFilter,
                        status_id: statusFilter,
                    },
                });
                setProducts(res.data);
                setTotal(res.data.length);
            } else {
                const res = await api.get(
                    `/toode?page=${page + 1}&limit=${rowsPerPage}`
                );
                setProducts(res.data.data);
                setTotal(res.data.total);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setToggledEditId(product.toode_id);
    };

    const handleSave = async () => {
        try {
            await api.patch(`/toode/${form.toode_id}`, form);
            setToggledEditId(null);
            fetchProducts();
        } catch (err) {
            const msg =
                err.response?.data?.message || "Failed to save changes.";
            alert(msg);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            await api.delete(`/toode/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Error deleting product.");
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Products
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                    label="Name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={descFilter}
                    onChange={(e) => setDescFilter(e.target.value)}
                    fullWidth
                />
                <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    fullWidth
                >
                    <MenuItem value="">All statuses</MenuItem>
                    {statuses.map((s) => (
                        <MenuItem key={s.status_id} value={s.status_id}>
                            {s.nimetus}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((p) => (
                            <TableRow key={p.toode_id}>
                                <TableCell>{p.toode_id}</TableCell>
                                <TableCell>
                                    {toggledEditId === p.toode_id ? (
                                        <TextField
                                            value={form.nimetus || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    nimetus: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        p.nimetus
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === p.toode_id ? (
                                        <TextField
                                            value={form.kirjeldus || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    kirjeldus: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        p.kirjeldus
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === p.toode_id ? (
                                        <TextField
                                            type="number"
                                            value={form.hind || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    hind: e.target.value,
                                                })
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        `${p.hind} €`
                                    )}
                                </TableCell>
                                <TableCell>
                                    {toggledEditId === p.toode_id ? (
                                        <Select
                                            value={form.status_id || ""}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    status_id: e.target.value,
                                                })
                                            }
                                            size="small"
                                        >
                                            {statuses.map((s) => (
                                                <MenuItem
                                                    key={s.status_id}
                                                    value={s.status_id}
                                                >
                                                    {s.nimetus}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        statuses.find(
                                            (s) => s.status_id === p.status_id
                                        )?.nimetus || "-"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {p.image ? (
                                        <a
                                            href={`http://localhost:3000${p.image}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(
                                                    `http://localhost:3000${p.image}`,
                                                    "popup",
                                                    "width=600,height=400"
                                                );
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:3000${p.image}`}
                                                alt="product"
                                                width={50}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </a>
                                    ) : (
                                        "No image"
                                    )}
                                </TableCell>

                                <TableCell>
                                    {toggledEditId === p.toode_id ? (
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
                                                onClick={() => handleEdit(p)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    handleDelete(p.toode_id)
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
