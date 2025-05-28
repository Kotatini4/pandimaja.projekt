import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Klient from "./pages/Klient";
import Toode from "./pages/Toode";
import Leping from "./pages/Leping";
import Login from "./pages/Login";
import Contacts from "./pages/Contacts";
import Tootaja from "./pages/Tootaja";
import TootajaCreate from "./pages/TootajaCreate";
import KlientCreate from "./pages/KlientCreate";
import ToodeCreate from "./pages/ToodeCreate";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contacts" element={<Contacts />} />

            {/* Защищённые маршруты */}
            <Route
                path="/klient/create"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <KlientCreate />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/klient"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <Klient />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/toode"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <Toode />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/toode/create"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <ToodeCreate />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/leping"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <Leping />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/tootaja"
                element={
                    user && (user.roleId === 1 || user.roleId === 2) ? (
                        <Tootaja />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route
                path="/tootaja/create"
                element={
                    user && user.roleId === 1 ? (
                        <TootajaCreate />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        minHeight: "100vh",
                    }}
                >
                    <Navbar />
                    <div style={{ flexGrow: 1 }}>
                        <AppRoutes />
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}
