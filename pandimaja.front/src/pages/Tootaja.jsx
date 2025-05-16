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
} from "@mui/material";
import api from "../services/api";

export default function Tootaja() {
    const [toggledEditId, setToggledEditId] = useState(null);
    const [form, setForm] = useState({});
    const [search, setSearch] = useState("");
    const [workers, setWorkers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            const res = await api.get("/tootaja");
            setWorkers(res.data);
        } catch (err) {
            console.error("Ошибка загрузки работников", err);
        }
    };

    const handleEdit = (worker) => {
        setToggledEditId(worker.tootaja_id);
        setForm({ ...worker, pass: "" });
    };

    const handleSave = async () => {
        if (!form.nimi || !form.perekonnanimi || !form.kood) {
            alert("Имя, фамилия и код обязательны для заполнения.");
            return;
        }

        try {
            await api.patch(`/tootaja/${form.tootaja_id}`, form);
            setToggledEditId(null);
            fetchWorkers();
        } catch (err) {
            console.error("Ошибка сохранения", err);
        }
    };

    const filtered = workers.filter((w) =>
        [w.nimi, w.perekonnanimi, w.kood, w.tootaja_id?.toString()].some(
            (field) => field?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const handleChangePage = (event, newPage) => setPage(newPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Список работников
            </Typography>

            <TextField
                label="Поиск по имени, коду или ID"
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
                            <TableCell>Имя</TableCell>
                            <TableCell>Фамилия</TableCell>
                            <TableCell>Kood</TableCell>
                            <TableCell>Пароль</TableCell>
                            <TableCell>Телефон</TableCell>
                            <TableCell>Адрес</TableCell>
                            <TableCell>Роль</TableCell>
                            <TableCell>Действие</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map((w) => (
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
                                                placeholder="Новый пароль"
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
                                            <TextField
                                                type="number"
                                                value={form.role_id || ""}
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        role_id: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                                size="small"
                                            />
                                        ) : (
                                            w.role_id
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {toggledEditId === w.tootaja_id ? (
                                            <TextField
                                                value={form.pass || ""}
                                                type="password"
                                                placeholder="Новый пароль"
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
                                            <Button
                                                onClick={handleSave}
                                                variant="contained"
                                                size="small"
                                            >
                                                Сохранить
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => handleEdit(w)}
                                                size="small"
                                            >
                                                Редактировать
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
            </Paper>
        </Container>
    );
}
