import React from "react";
import { Box, Typography, Grid, Stack, Link as MuiLink } from "@mui/material";
import {
    Facebook,
    Instagram,
    LinkedIn,
    YouTube,
    Twitter,
    TikTok,
} from "@mui/icons-material";

export default function Footer() {
    return (
        <Box
            sx={{
                background: "linear-gradient(90deg, #2c225e 0%, #2c5c82 100%)",
                color: "white",
                mt: 5,
                py: 4,
                px: 2,
            }}
        >
            <Grid container spacing={4} justifyContent="space-between">
                {/* Контакты */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold">
                        PANDIMAJA
                    </Typography>
                    <Typography>Ehitajate tee 5</Typography>
                    <Typography>19086 Tallinn</Typography>
                    <Typography>Eesti</Typography>
                    <Typography mt={1}>📞 620 2002</Typography>
                    <Typography>✉️ info@pandimaja.ee</Typography>
                </Grid>

                {/* Подписка или призыв */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold">
                        Будь в курсе новостей
                    </Typography>
                    <Typography>Подпишись на обновления и акции</Typography>
                </Grid>

                {/* Соцсети */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        Мы в соцсетях
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <MuiLink href="#" color="inherit">
                            <Twitter />
                        </MuiLink>
                        <MuiLink href="#" color="inherit">
                            <Instagram />
                        </MuiLink>
                        <MuiLink href="#" color="inherit">
                            <Facebook />
                        </MuiLink>
                        <MuiLink href="#" color="inherit">
                            <LinkedIn />
                        </MuiLink>
                        <MuiLink href="#" color="inherit">
                            <TikTok />
                        </MuiLink>
                        <MuiLink href="#" color="inherit">
                            <YouTube />
                        </MuiLink>
                    </Stack>
                </Grid>
            </Grid>

            <Box mt={4}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {["Контакты", "Портал", "Политика", "Этика", "FAQ"].map(
                        (label) => (
                            <MuiLink
                                key={label}
                                href="#"
                                color="inherit"
                                underline="hover"
                            >
                                {label}
                            </MuiLink>
                        )
                    )}
                </Stack>
            </Box>
        </Box>
    );
}
