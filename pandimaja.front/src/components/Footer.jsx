import React from "react";
import { Box, Typography, Grid, Stack, Link as MuiLink } from "@mui/material";
import {
    Facebook,
    Instagram,
    LinkedIn,
    YouTube,
    Twitter,
} from "@mui/icons-material";

export default function Footer() {
    return (
        <Box
            sx={{
                background: "linear-gradient(90deg, #2c225e 0%, #2c5c82 100%)",
                color: "white",
                mt: "auto",
                py: 4,
                px: 2,
            }}
        >
            <Grid container spacing={4} justifyContent="space-between">
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold">
                        PANDIMAJA
                    </Typography>
                    <Typography>Ehitajate tee 5</Typography>
                    <Typography>19086 Tallinn</Typography>
                    <Typography>Estonia</Typography>
                    <Typography mt={1}>📞 620 2002</Typography>
                    <Typography>✉️ info@pandimaja.ee</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold">
                        Stay Updated
                    </Typography>
                    <Typography>
                        Subscribe for updates and special offers
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        Follow us on social media
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <MuiLink color="inherit">
                            <Twitter />
                        </MuiLink>
                        <MuiLink color="inherit">
                            <Instagram />
                        </MuiLink>
                        <MuiLink color="inherit">
                            <Facebook />
                        </MuiLink>
                        <MuiLink color="inherit">
                            <LinkedIn />
                        </MuiLink>
                        <MuiLink color="inherit">
                            <YouTube />
                        </MuiLink>
                    </Stack>
                </Grid>
            </Grid>
            <Box mt={4}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    {["Contact", "Portal", "Policy", "Ethics", "FAQ"].map(
                        (label) => (
                            <MuiLink
                                key={label}
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
