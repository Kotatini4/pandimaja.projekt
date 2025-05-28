import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Pagination,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("");
    const perPage = 24;

    useEffect(() => {
        api.get("/toode/laos")
            .then((res) => {
                const filtered = res.data.filter((p) => p.status_id === 1);
                setProducts(filtered);
            })
            .catch((err) => {
                console.error("Ошибка загрузки товаров:", err);
            });
    }, []);

    // Сортировка
    let sorted = [...products];
    if (sortBy === "name_asc") {
        sorted.sort((a, b) => a.nimetus.localeCompare(b.nimetus));
    } else if (sortBy === "name_desc") {
        sorted.sort((a, b) => b.nimetus.localeCompare(a.nimetus));
    } else if (sortBy === "price_asc") {
        sorted.sort(
            (a, b) =>
                parseFloat(a.hind.replace(/[^0-9.]/g, "")) -
                parseFloat(b.hind.replace(/[^0-9.]/g, ""))
        );
    } else if (sortBy === "price_desc") {
        sorted.sort(
            (a, b) =>
                parseFloat(b.hind.replace(/[^0-9.]/g, "")) -
                parseFloat(a.hind.replace(/[^0-9.]/g, ""))
        );
    }

    const totalPages = Math.ceil(sorted.length / perPage);
    const visible = sorted.slice((page - 1) * perPage, page * perPage);

    return (
        <Container sx={{ py: 4 }}>
            <Stack direction="row" alignItems="center" mb={2}>
                <Typography variant="h4">Товары в продаже</Typography>

                <FormControl size="small" sx={{ minWidth: 200, ml: "auto" }}>
                    <InputLabel>Сортировать</InputLabel>
                    <Select
                        value={sortBy}
                        label="Сортировать"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="">Без сортировки</MenuItem>
                        <MenuItem value="name_asc">Название: A–Я</MenuItem>
                        <MenuItem value="name_desc">Название: Я–A</MenuItem>
                        <MenuItem value="price_asc">Цена: ↑</MenuItem>
                        <MenuItem value="price_desc">Цена: ↓</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Grid container spacing={2}>
                {visible.map((product) => (
                    <Grid
                        item
                        key={product.toode_id}
                        sx={{ flexBasis: "20%", maxWidth: "20%" }}
                    >
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {product.image && (
                                <CardMedia
                                    component="img"
                                    image={`http://localhost:3000${product.image}`}
                                    alt={product.nimetus}
                                    sx={{ height: 180, objectFit: "cover" }}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">
                                    {product.nimetus}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {product.kirjeldus}
                                </Typography>
                                <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                                    {product.hind}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">ПОДРОБНЕЕ</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {totalPages > 1 && (
                <Stack spacing={2} mt={4} alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Stack>
            )}
        </Container>
    );
}
