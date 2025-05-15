import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Компоненты
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Страницы
import Home from "./pages/Home";
import Klient from "./pages/Klient";
import Toode from "./pages/Toode";
import Leping from "./pages/Leping";
import Login from "./pages/Login";

// Авторизация
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/klient" element={<Klient />} />
                    <Route path="/toode" element={<Toode />} />
                    <Route path="/leping" element={<Leping />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
