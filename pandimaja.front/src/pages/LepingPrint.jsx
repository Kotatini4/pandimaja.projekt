import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Container, Typography } from "@mui/material";

export default function LepingPrint() {
    const { id } = useParams(); // ✔️ получаем ID из URL
    const [leping, setLeping] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!id || !token) {
            console.warn("Не выполняем fetch: ", { id, token });
            return;
        }

        api.get(`/leping/print/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => setLeping(res.data))
            .catch((err) => console.error("Failed to fetch contract:", err));
    }, [id, token]);

    useEffect(() => {
        if (leping) {
            setTimeout(() => window.print(), 500);
        }
    }, [leping]);

    if (!id) {
        return <Typography sx={{ mt: 4 }}>ID missing.</Typography>;
    }

    if (!leping) {
        return <Typography sx={{ mt: 4 }}>Loading...</Typography>;
    }

    return (
        <Container sx={{ mt: 4, fontFamily: "serif", maxWidth: 800 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Laenuleping
            </Typography>

            <Typography><strong>Aadress:</strong> Puskini 19, Narva</Typography>
            <Typography><strong>Lepingu number:</strong> {leping.leping_id}</Typography>
            <Typography>
                <strong>Kuupäev:</strong>{" "}
                {leping.date ? new Date(leping.date).toLocaleDateString("et-EE") : "—"}
            </Typography>


            <Typography paragraph>
                1. <strong>FinTag OÜ</strong> (edasi laenuandja) ja {leping.klient?.nimi} {leping.klient?.perekonnanimi} (edasi laenusaaja);
                isikukood {leping.klient?.kood}; elukoht {leping.klient?.aadres}; tel. {leping.klient?.tel}
            </Typography>
            <Typography paragraph>
                2. Laenu tagastamine kokkuleppe põhjal{" "}
                <strong>{leping.date_valja_ostud ? new Date(leping.date_valja_ostud).toLocaleDateString("et-EE") : "—"}</strong>.
            </Typography>

            <Typography paragraph>
                3. Laenusaaja annab laenuandjale pandiks <strong>"{leping.toode?.nimetus}"</strong>.
            </Typography>
            <Typography paragraph>
                4. Laenuandja annab laenusaajale laenu summas{" "}
            <strong>{leping.pant_hind ? Number(leping.pant_hind).toFixed(2) : "—"} EUR.</strong>
                Lepingu sõlmimistasu 1,00 EUR.
            </Typography>
            <Typography paragraph>
                5. Laenu kasutamise eest arvutatakse minimaalse intressi suuruses 3 EUR, või 1.2% päevas.
            </Typography>
            <Typography paragraph>
                6. Laenusaaja kohustab tagastama laenuandjale laenu summa ja intressi suuruses 14,00 EUR.
            </Typography>
            <Typography paragraph>
                7. Kui laenusaaja ei täida kohustust tähtajaks, määratakse trahv 3% päevas laenusummalt.
            </Typography>
            <Typography paragraph>
                8. Kui laenu ei tagastata 7 päeva jooksul pärast tähtaega, on laenuandjal õigus pant realiseerida.
            </Typography>
            <Typography paragraph>
                9. Kui selgub, et panditud asi on varastatud, blokeeritud või defektiga, esitab laenuandja pretensiooni.
            </Typography>
            <Typography paragraph>
                10. Trahv 9. punkti rikkumise eest on 35 EUR.
            </Typography>
            <Typography paragraph>
                11. Laenusaaja kinnitab, et pant on tema omand ja korras seisukorras.
            </Typography>
            <Typography paragraph>
                12. Leping on koostatud kahes eksemplaris. Pant tagastatakse pärast kogu summa maksmist.
            </Typography>
            <Typography paragraph>
                13. Allkirjade andmisega kinnitab laenusaaja, et sai raha kätte.
            </Typography>

            <br />
            <Typography>Laenusaaja: ________________________ (allkiri)</Typography>
            <Typography>Firma esindaja: _____________________ (allkiri)</Typography>

        </Container>
    );
}
