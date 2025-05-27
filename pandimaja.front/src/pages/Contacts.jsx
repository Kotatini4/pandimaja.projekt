// src/pages/Contacts.jsx
import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

export default function Contacts() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>

                <Typography variant="body1" gutterBottom>
                    <strong>Address:</strong> Ehitajate tee 5, 19086 Tallinn,
                    Estonia
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Phone:</strong> +372 620 2002
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> info@pandimaja.ee
                </Typography>

                <Box mt={4}>
                    <iframe
                        title="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1984.218280012578!2d24.671610315956776!3d59.39697748167471!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4692ec20d679b321%3A0x1b6fcdcb94e2b646!2sEhitajate%20tee%205%2C%20Tallinn%2C%20Estonia!5e0!3m2!1sen!2see!4v1700000000000"
                        width="100%"
                        height="350"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </Box>
            </Paper>
        </Container>
    );
}
