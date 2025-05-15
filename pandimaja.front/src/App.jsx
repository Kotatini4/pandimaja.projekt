import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import Klient from "./pages/Klient";
import Toode from "./pages/Toode";
import Leping from "./pages/Leping";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
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
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/contacts" element={<Contacts />} />
                            <Route path="/klient" element={<Klient />} />
                            <Route path="/toode" element={<Toode />} />
                            <Route path="/leping" element={<Leping />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
