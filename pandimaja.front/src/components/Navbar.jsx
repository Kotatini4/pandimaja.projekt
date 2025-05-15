import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Container,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const navLinks = [
        { to: "/", label: "Главная" },
        { to: "/contacts", label: "Контакты" },
        { to: "/klient", label: "Клиенты" },
        { to: "/toode", label: "Товары" },
        { to: "/leping", label: "Договоры" },
    ];

    return (
        <AppBar
            position="static"
            sx={{
                background: "linear-gradient(90deg, #2c225e 0%, #2c5c82 100%)",
                color: "white",
                boxShadow: 2,
            }}
        >
            <Container>
                <Toolbar>
                    {isMobile ? (
                        <>
                            <IconButton
                                color="inherit"
                                onClick={handleMenuOpen}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                            >
                                {navLinks.map((link) => (
                                    <MenuItem
                                        key={link.to}
                                        component={Link}
                                        to={link.to}
                                        onClick={handleMenuClose}
                                    >
                                        {link.label}
                                    </MenuItem>
                                ))}
                                {user ? (
                                    <>
                                        <MenuItem disabled>
                                            {user.kood}
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleLogout();
                                                handleMenuClose();
                                            }}
                                        >
                                            Выйти
                                        </MenuItem>
                                    </>
                                ) : (
                                    <MenuItem
                                        component={Link}
                                        to="/login"
                                        onClick={handleMenuClose}
                                    >
                                        Вход
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Box sx={{ flexGrow: 1 }}>
                                <Stack direction="row" spacing={2}>
                                    {navLinks.map((link) => (
                                        <Button
                                            key={link.to}
                                            color="inherit"
                                            component={Link}
                                            to={link.to}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Box>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                {user ? (
                                    <>
                                        <Typography>{user.kood}</Typography>
                                        <Button
                                            color="inherit"
                                            onClick={handleLogout}
                                        >
                                            Выйти
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/login"
                                    >
                                        Вход
                                    </Button>
                                )}
                            </Stack>
                        </>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}
