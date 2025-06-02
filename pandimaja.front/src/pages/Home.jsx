import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
} from "@mui/material";
import { styled } from '@mui/system';

// ✅ Styled Grid Container: меняем display на block при <600px
const ResponsiveGridContainer = styled(Grid)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
        display: 'block !important',
    },
}));

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
        sorted.sort((a, b) =>
            parseFloat(a.hind.replace(/[^0-9.]/g, "")) -
            parseFloat(b.hind.replace(/[^0-9.]/g, ""))
        );
    } else if (sortBy === "price_desc") {
        sorted.sort((a, b) =>
            parseFloat(b.hind.replace(/[^0-9.]/g, "")) -
            parseFloat(a.hind.replace(/[^0-9.]/g, ""))
        );
    }

    const totalPages = Math.ceil(sorted.length / perPage);
    const visible = sorted.slice((page - 1) * perPage, page * perPage);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                mb={2}
                gap={2}
            >
                <Typography variant="h4">Товары в продаже</Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Сортировка</InputLabel>
                    <Select
                        value={sortBy}
                        label="Сортировка"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="">Без сортировки</MenuItem>
                        <MenuItem value="name_asc">Название: A–Z</MenuItem>
                        <MenuItem value="name_desc">Название: Z–A</MenuItem>
                        <MenuItem value="price_asc">Цена: ↑</MenuItem>
                        <MenuItem value="price_desc">Цена: ↓</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <ResponsiveGridContainer container spacing={2}>
                {visible.map((product) => (
                    <Grid
                        item
                        key={product.toode_id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                        sx={{ display: 'flex' }}
                    >
                        <Card
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                                minHeight: 360,
                                boxSizing: 'border-box',
                                '@media (max-width:600px)': {
                                    marginLeft: '-16px',
                                    marginRight: '-16px',
                                    width: 'calc(100% + 32px)',
                                },
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
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {product.nimetus}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {product.kirjeldus}
                                </Typography>
                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    {product.hind}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </ResponsiveGridContainer>

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
