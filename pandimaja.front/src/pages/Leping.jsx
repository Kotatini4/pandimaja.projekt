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
    TextField,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Stack,
    TablePagination,
} from "@mui/material";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

export default function Leping() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [contracts, setContracts] = useState([]);
    const [sortBy, setSortBy] = useState("");
    const [searchParams, setSearchParams] = useState({
        search: "",
        leping_type: "",
        date_from: "",
        date_to: "",
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedToodeId, setSelectedToodeId] = useState(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setPage(0);
            handleSearch();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchParams, sortBy]);

    useEffect(() => {
        handleSearch();
    }, [page]);

    const fetchContracts = () => {
        api.get("/leping", {
            params: { page: page + 1, limit: rowsPerPage },
        })
            .then((res) => {
                setContracts(res.data.data);
                setTotal(res.data.total);
            })
            .catch((err) => console.error("Error fetching contracts:", err));
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (searchParams.search.trim()) {
            params.append("search", searchParams.search.trim());
        }
        if (searchParams.leping_type) {
            params.append("leping_type", searchParams.leping_type);
        }
        if (searchParams.date_from) {
            params.append("date_from", searchParams.date_from);
        }
        if (searchParams.date_to) {
            params.append("date_to", searchParams.date_to);
        }

        params.append("page", page + 1);
        params.append("limit", rowsPerPage);

        api.get(`/leping/search?${params.toString()}`)
            .then((res) => {
                setContracts(res.data.data);
                setTotal(res.data.total);
            })
            .catch((err) => console.error("Error searching contracts:", err));
    };

    const confirmBuyout = (toodeId) => {
        setSelectedToodeId(toodeId);
        setOpenDialog(true);
    };

    const handleBuyout = async () => {
        try {
            await api.post(`/toode/${selectedToodeId}/buyout`);
            fetchContracts();
        } catch (error) {
            console.error("Buyout error:", error);
            alert("Failed to buy out product.");
        } finally {
            setOpenDialog(false);
            setSelectedToodeId(null);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const sorted = [...contracts].sort((a, b) => {
        if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        if (sortBy === "pant_hind") return b.pant_hind - a.pant_hind;
        return 0;
    });

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Contracts
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    mb: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    "& > *": { width: { xs: "100%", sm: "auto" } },
                }}
            >
                <TextField
                    label="Search by name or ID code"
                    value={searchParams.search}
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            search: e.target.value,
                        })
                    }
                />

                <FormControl sx={{ minWidth: 150 }}>
                    <InputLabel>Contract Type</InputLabel>
                    <Select
                        value={searchParams.leping_type}
                        label="Contract Type"
                        onChange={(e) =>
                            setSearchParams({
                                ...searchParams,
                                leping_type: e.target.value,
                            })
                        }
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="pant">pant</MenuItem>
                        <MenuItem value="ost">ost</MenuItem>
                        <MenuItem value="müük">müük</MenuItem>
                        <MenuItem value="väljaost">väljaost</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label="Date From"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchParams.date_from}
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            date_from: e.target.value,
                        })
                    }
                />
                <TextField
                    label="Date To"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={searchParams.date_to}
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            date_to: e.target.value,
                        })
                    }
                />

                <Button
                    variant="outlined"
                    onClick={() => {
                        setSearchParams({
                            search: "",
                            leping_type: "",
                            date_from: "",
                            date_to: "",
                        });
                        setSortBy("");
                        setPage(0);
                    }}
                >
                    Reset
                </Button>
            </Box>

            <Paper>
                {isMobile ? (
                    <Stack spacing={2} p={2}>
                        {sorted.map((c) => (
                            <Paper key={c.leping_id} sx={{ p: 3, mb: 3 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    gutterBottom
                                >
                                    Contract #{c.leping_id}
                                </Typography>
                                <Typography>
                                    <b>Client:</b> {c.klient?.nimi}{" "}
                                    {c.klient?.perekonnanimi}
                                </Typography>
                                <Typography>
                                    <b>ID Code:</b> {c.klient?.kood || "—"}
                                </Typography>
                                <Typography>
                                    <b>Product:</b> {c.toode?.nimetus || "—"}
                                </Typography>
                                <Typography>
                                    <b>Employee:</b> {c.tootaja?.nimi}{" "}
                                    {c.tootaja?.perekonnanimi}
                                </Typography>
                                <Typography>
                                    <b>Date:</b> {c.date || "—"}
                                </Typography>
                                <Typography>
                                    <b>Buyout Date:</b>{" "}
                                    {c.date_valja_ostud || "—"}
                                </Typography>
                                <Typography>
                                    <b>Deposit:</b> {c.pant_hind || "—"}
                                </Typography>
                                <Typography>
                                    <b>Buyout:</b> {c.valja_ostud_hind || "—"}
                                </Typography>
                                <Typography>
                                    <b>Type:</b> {c.leping_type}
                                </Typography>

                                <Box
                                    mt={3}
                                    p={2}
                                    bgcolor="#e3f2fd"
                                    borderRadius={2}
                                    display="flex"
                                    flexDirection={{ xs: "column", sm: "row" }}
                                    gap={2}
                                    alignItems="flex-start"
                                    flexWrap="wrap"
                                >
                                    {c.leping_type === "pant" && c.toode_id && (
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            size="medium"
                                            onClick={() =>
                                                confirmBuyout(c.toode_id)
                                            }
                                        >
                                            Buy Out Product
                                        </Button>
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="medium"
                                        component={Link}
                                        to={`/leping/print/${c.leping_id}`}
                                    >
                                        Print Contract
                                    </Button>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Isikukood</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Employee</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Date Valja Ostud</TableCell>
                                <TableCell>Deposit</TableCell>
                                <TableCell>Buyout</TableCell>
                                <TableCell>Purchase Price</TableCell>
                                <TableCell>Selling Price</TableCell>
                                <TableCell>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sorted.map((c) => (
                                <TableRow key={c.leping_id}>
                                    <TableCell>{c.leping_id}</TableCell>
                                    <TableCell>
                                        {c.klient
                                            ? `${c.klient.nimi} ${c.klient.perekonnanimi}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {c.klient?.kood || "—"}
                                    </TableCell>
                                    <TableCell>
                                        {c.toode?.nimetus || "—"}
                                    </TableCell>
                                    <TableCell>
                                        {c.tootaja
                                            ? `${c.tootaja.nimi} ${c.tootaja.perekonnanimi}`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{c.date || "—"}</TableCell>
                                    <TableCell>
                                        {c.date_valja_ostud || "—"}
                                    </TableCell>
                                    <TableCell>{c.pant_hind || "—"}</TableCell>
                                    <TableCell>
                                        {c.valja_ostud_hind || "—"}
                                    </TableCell>
                                    <TableCell>{c.ostuhind || "—"}</TableCell>
                                    <TableCell>{c.muugihind || "—"}</TableCell>
                                    <TableCell>
                                        {c.leping_type}
                                        {c.leping_type === "pant" &&
                                            c.toode_id && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                    onClick={() =>
                                                        confirmBuyout(
                                                            c.toode_id
                                                        )
                                                    }
                                                >
                                                    Buy Out Product
                                                </Button>
                                            )}
                                        <Button
                                            color="inherit"
                                            component={Link}
                                            to={`/leping/print/${c.leping_id}`}
                                        >
                                            Print Contract
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            <Paper sx={{ mt: 2 }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                />
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Buyout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to mark this product as bought
                        out?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleBuyout}
                        variant="contained"
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
