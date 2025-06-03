import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Stack,
    Select,
    MenuItem,
    useMediaQuery,
} from "@mui/material";
import api from "../services/api";
import { useTheme } from "@mui/material/styles";

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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
            const res =
                nameFilter || descFilter || statusFilter
                    ? await api.get("/toode/search", {
                          params: {
                              nimetus: nameFilter,
                              kirjeldus: descFilter,
                              status_id: statusFilter,
                          },
                      })
                    : await api.get(
                          `/toode?page=${page + 1}&limit=${rowsPerPage}`
                      );
            setProducts(res.data.data || res.data);
            setTotal(res.data.total || res.data.length);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    const handleEdit = (p) => {
        setForm({
            toode_id: p.toode_id,
            nimetus: p.nimetus || "",
            kirjeldus: p.kirjeldus || "",
            hind: p.hind || "",
            status_id: p.status_id || "",
            image: p.image || null,
        });
        setToggledEditId(p.toode_id);
    };

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSave = async () => {
        try {
            const data = new FormData();
            data.append("nimetus", form.nimetus);
            data.append("kirjeldus", form.kirjeldus);
            data.append("hind", form.hind);
            data.append("status_id", form.status_id);
            if (form.image && typeof form.image !== "string") {
                data.append("image", form.image);
            }

            await api.patch(`/toode/${form.toode_id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setToggledEditId(null);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save changes.");
        }
    };

    const handleDelete = async (id) => {
        const confirms = [
            "Are you sure you want to delete this product?",
            "Are you REALLY sure?",
            "This action is irreversible. Delete anyway?",
        ];

        for (const msg of confirms) {
            if (!window.confirm(msg)) return;
        }

        try {
            await api.delete(`/toode/${id}`);
            fetchProducts();
        } catch {
            alert("Error deleting product.");
        }
    };

    const handleChangePage = (e, newPage) => setPage(newPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Products
            </Typography>

            <Stack direction="row" rowGap={2} sx={{ mb: 4 }} flexWrap="wrap">
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

            {isMobile ? (
                <Stack spacing={2}>
                    {products.map((p) => (
                        <Paper key={p.toode_id} sx={{ p: 2 }}>
                            <Typography variant="subtitle1">
                                ID: {p.toode_id}
                            </Typography>
                            <Typography>
                                Name:{" "}
                                {toggledEditId === p.toode_id ? (
                                    <TextField
                                        size="small"
                                        value={form.nimetus}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                nimetus: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    p.nimetus
                                )}
                            </Typography>
                            <Typography>
                                Description:{" "}
                                {toggledEditId === p.toode_id ? (
                                    <TextField
                                        size="small"
                                        value={form.kirjeldus}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                kirjeldus: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    p.kirjeldus
                                )}
                            </Typography>
                            <Typography>
                                Price:{" "}
                                {toggledEditId === p.toode_id ? (
                                    <TextField
                                        size="small"
                                        value={form.hind}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                hind: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    `${p.hind} €`
                                )}
                            </Typography>
                            <Typography>
                                Status:{" "}
                                {toggledEditId === p.toode_id ? (
                                    <Select
                                        size="small"
                                        value={form.status_id}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                status_id: e.target.value,
                                            })
                                        }
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
                            </Typography>
                            <Typography>
                                Image:{" "}
                                {toggledEditId === p.toode_id ? (
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                    />
                                ) : p.image ? (
                                    <img
                                        src={`http://localhost:3000${p.image}`}
                                        alt="product"
                                        style={{ width: "100%", marginTop: 10 }}
                                    />
                                ) : (
                                    "No image"
                                )}
                            </Typography>

                            <Stack direction="row" spacing={1} mt={2}>
                                {toggledEditId === p.toode_id ? (
                                    <>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="contained"
                                            onClick={handleSave}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            onClick={() =>
                                                setToggledEditId(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            onClick={() => handleEdit(p)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            onClick={() =>
                                                handleDelete(p.toode_id)
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
                                                value={form.nimetus}
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
                                                value={form.kirjeldus}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        kirjeldus:
                                                            e.target.value,
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
                                                value={form.hind}
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
                                                value={form.status_id}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        status_id:
                                                            e.target.value,
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
                                                (s) =>
                                                    s.status_id === p.status_id
                                            )?.nimetus
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {toggledEditId === p.toode_id ? (
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                        ) : p.image ? (
                                            <img
                                                src={`http://localhost:3000${p.image}`}
                                                alt="product"
                                                width={50}
                                            />
                                        ) : (
                                            "No image"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="column" spacing={1}>
                                            {toggledEditId === p.toode_id ? (
                                                <>
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
                                                            setToggledEditId(
                                                                null
                                                            )
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
                                                            handleEdit(p)
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
                                                                p.toode_id
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
