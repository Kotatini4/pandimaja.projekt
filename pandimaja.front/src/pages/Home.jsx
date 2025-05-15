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
} from "@mui/material";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const perPage = 24;

    useEffect(() => {
        api.get("/toode")
            .then((res) => {
                const filtered = res.data.filter((p) => p.status_id === 1);
                setProducts(filtered);
            })
            .catch((err) => {
                console.error("Ошибка загрузки товаров:", err);
            });
    }, []);

    // Пагинация: разбиваем товары по страницам
    const totalPages = Math.ceil(products.length / perPage);
    const visibleProducts = products.slice(
        (page - 1) * perPage,
        page * perPage
    );

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Товары в продаже
            </Typography>

            <Grid container spacing={3}>
                {visibleProducts.map((product) => (
                    <Grid item key={product.toode_id} xs={12} sm={6} md={3}>
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
                                    sx={{
                                        height: 180,
                                        objectFit: "cover",
                                    }}
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
                                    {product.kirjaldus}
                                </Typography>
                                <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                                    {product.hind}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Подробнее</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Пагинация */}
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
