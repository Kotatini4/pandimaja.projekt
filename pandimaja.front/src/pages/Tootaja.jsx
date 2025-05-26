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
} from "@mui/material";
import api from "../services/api";

export default function Tootaja() {
    const [toggledEditId, setToggledEditId] = useState(null);
    const [form, setForm] = useState({});
    const [search, setSearch] = useState("");
    const [workers, setWorkers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);

    const roles = [
        { id: 1, name: "admin" },
        { id: 2, name: "user" },
        { id: 3, name: "NA" },
    ];

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

        if (!/^[0-9]{11}$/.test(form.kood)) {
            alert("Kood должен содержать ровно 11 цифр.");
            return;
        }

        if (form.pass && form.pass.length < 6) {
            alert("Пароль должен содержать минимум 6 символов.");
            return;
        }

        if (form.tel && !/^\+?[0-9]+$/.test(form.tel)) {
            alert("Телефон может содержать только цифры и символ '+'.");
            return;
        }

        if (form.role_id && ![1, 2, 3].includes(Number(form.role_id))) {
            alert("Роль должна быть 1 (admin), 2 (user) или 3 (NA).");
            return;
        }

        try {
            await api.patch(`/tootaja/${form.tootaja_id}`, form);
            setToggledEditId(null);
            fetchWorkers();
        } catch (err) {
            if (err.response?.data?.message) {
                alert("Ошибка: " + err.response.data.message);
            } else {
                alert("Неизвестная ошибка при сохранении.");
            }
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
                                            roles.find(
                                                (r) => r.id === w.role_id
                                            )?.name || "?"
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
