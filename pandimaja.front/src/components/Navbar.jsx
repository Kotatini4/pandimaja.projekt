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
    const [tootajaMenuAnchor, setTootajaMenuAnchor] = useState(null);

    const open = Boolean(anchorEl);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleTootajaMenuOpen = (event) =>
        setTootajaMenuAnchor(event.currentTarget);
    const handleTootajaMenuClose = () => setTootajaMenuAnchor(null);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/contacts", label: "Contacts" },
        ...(user && (user.roleId === 1 || user.roleId === 2)
            ? [
                  { to: "/klient", label: "Clients" },
                  { to: "/toode", label: "Products" },
                  { to: "/leping", label: "Contracts" },
              ]
            : []),
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
                                {user?.roleId === 1 && (
                                    <>
                                        <MenuItem
                                            component={Link}
                                            to="/tootaja"
                                            onClick={handleMenuClose}
                                        >
                                            Employee List
                                        </MenuItem>
                                        <MenuItem
                                            component={Link}
                                            to="/tootaja/create"
                                            onClick={handleMenuClose}
                                        >
                                            Add
                                        </MenuItem>
                                    </>
                                )}
                                {user ? (
                                    <>
                                        <MenuItem disabled>
                                            {user.name}
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                handleLogout();
                                                handleMenuClose();
                                            }}
                                        >
                                            Logout
                                        </MenuItem>
                                    </>
                                ) : (
                                    <MenuItem
                                        component={Link}
                                        to="/login"
                                        onClick={handleMenuClose}
                                    >
                                        Login
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
                                    {user?.roleId === 1 && (
                                        <Box>
                                            <Button
                                                color="inherit"
                                                onMouseEnter={
                                                    handleTootajaMenuOpen
                                                }
                                            >
                                                Employees
                                            </Button>
                                            <Menu
                                                anchorEl={tootajaMenuAnchor}
                                                open={Boolean(
                                                    tootajaMenuAnchor
                                                )}
                                                onClose={handleTootajaMenuClose}
                                                MenuListProps={{
                                                    onMouseLeave:
                                                        handleTootajaMenuClose,
                                                }}
                                            >
                                                <MenuItem
                                                    component={Link}
                                                    to="/tootaja"
                                                    onClick={
                                                        handleTootajaMenuClose
                                                    }
                                                >
                                                    List
                                                </MenuItem>
                                                <MenuItem
                                                    component={Link}
                                                    to="/tootaja/create"
                                                    onClick={
                                                        handleTootajaMenuClose
                                                    }
                                                >
                                                    Add
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                            >
                                {user ? (
                                    <>
                                        <Typography sx={{ mr: 1 }}>
                                            {user.name}
                                        </Typography>
                                        <Button
                                            color="inherit"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/login"
                                    >
                                        Login
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
