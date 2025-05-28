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
    const [klientMenuAnchor, setKlientMenuAnchor] = useState(null);
    const [productMenuAnchor, setProductMenuAnchor] = useState(null); // добавлено

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

    const handleKlientMenuOpen = (event) =>
        setKlientMenuAnchor(event.currentTarget);
    const handleKlientMenuClose = () => setKlientMenuAnchor(null);

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
                                <MenuItem
                                    component={Link}
                                    to="/"
                                    onClick={handleMenuClose}
                                >
                                    Home
                                </MenuItem>
                                <MenuItem
                                    component={Link}
                                    to="/contacts"
                                    onClick={handleMenuClose}
                                >
                                    Contacts
                                </MenuItem>
                                {(user?.roleId === 1 || user?.roleId === 2) && (
                                    <>
                                        <MenuItem
                                            component={Link}
                                            to="/klient"
                                            onClick={handleMenuClose}
                                        >
                                            Client List
                                        </MenuItem>
                                        <MenuItem
                                            component={Link}
                                            to="/klient/create"
                                            onClick={handleMenuClose}
                                        >
                                            Add Client
                                        </MenuItem>
                                    </>
                                )}
                                {(user?.roleId === 1 || user?.roleId === 2) && (
                                    <>
                                        <MenuItem
                                            component={Link}
                                            to="/toode"
                                            onClick={handleMenuClose}
                                        >
                                            Product List
                                        </MenuItem>
                                        <MenuItem
                                            component={Link}
                                            to="/toode/create"
                                            onClick={handleMenuClose}
                                        >
                                            Add Product
                                        </MenuItem>
                                        <MenuItem
                                            component={Link}
                                            to="/leping"
                                            onClick={handleMenuClose}
                                        >
                                            Contracts
                                        </MenuItem>
                                    </>
                                )}
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
                                            Add Employee
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
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/"
                                    >
                                        Home
                                    </Button>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/contacts"
                                    >
                                        Contacts
                                    </Button>

                                    {(user?.roleId === 1 ||
                                        user?.roleId === 2) && (
                                        <Box>
                                            <Button
                                                color="inherit"
                                                onMouseEnter={
                                                    handleKlientMenuOpen
                                                }
                                            >
                                                Clients
                                            </Button>
                                            <Menu
                                                anchorEl={klientMenuAnchor}
                                                open={Boolean(klientMenuAnchor)}
                                                onClose={handleKlientMenuClose}
                                                MenuListProps={{
                                                    onMouseLeave:
                                                        handleKlientMenuClose,
                                                }}
                                            >
                                                <MenuItem
                                                    component={Link}
                                                    to="/klient"
                                                    onClick={
                                                        handleKlientMenuClose
                                                    }
                                                >
                                                    List
                                                </MenuItem>
                                                <MenuItem
                                                    component={Link}
                                                    to="/klient/create"
                                                    onClick={
                                                        handleKlientMenuClose
                                                    }
                                                >
                                                    Add
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    )}

                                    {(user?.roleId === 1 ||
                                        user?.roleId === 2) && (
                                        <Box>
                                            <Button
                                                color="inherit"
                                                onMouseEnter={(e) =>
                                                    setProductMenuAnchor(
                                                        e.currentTarget
                                                    )
                                                }
                                            >
                                                Products
                                            </Button>
                                            <Menu
                                                anchorEl={productMenuAnchor}
                                                open={Boolean(
                                                    productMenuAnchor
                                                )}
                                                onClose={() =>
                                                    setProductMenuAnchor(null)
                                                }
                                                MenuListProps={{
                                                    onMouseLeave: () =>
                                                        setProductMenuAnchor(
                                                            null
                                                        ),
                                                }}
                                            >
                                                <MenuItem
                                                    component={Link}
                                                    to="/toode"
                                                    onClick={() =>
                                                        setProductMenuAnchor(
                                                            null
                                                        )
                                                    }
                                                >
                                                    List
                                                </MenuItem>
                                                <MenuItem
                                                    component={Link}
                                                    to="/toode/create"
                                                    onClick={() =>
                                                        setProductMenuAnchor(
                                                            null
                                                        )
                                                    }
                                                >
                                                    Add
                                                </MenuItem>
                                            </Menu>
                                        </Box>
                                    )}

                                    {(user?.roleId === 1 ||
                                        user?.roleId === 2) && (
                                        <Button
                                            color="inherit"
                                            component={Link}
                                            to="/leping"
                                        >
                                            Contracts
                                        </Button>
                                    )}

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
