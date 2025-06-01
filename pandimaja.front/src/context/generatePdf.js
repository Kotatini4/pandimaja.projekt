const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function generateContractPdf(contractData, filePath) {
    const doc = new PDFDocument({ margin: 40 });

    doc.pipe(fs.createWriteStream(filePath));

    const {
        lepingNumber = "T1085308",
        kuupaev = "30.08.2024",
        firmaNimi = "NordPawn OÜ",
        firmaAadress = "Puskini 19, Narva",
        klientNimi = "Mikhail Mikhaylov",
        klientIsikukood = "36601203727",
        klientAadress = "Puskini 26-6, Narva",
        dokument = "BE0144615 (ID kaart)",
        telefon = "58549805",
        tagastusKuupaev = "16.09.2024",
        pandiNimetus = "telefon",
        pandiKirjeldus = "denver 24200m, 866723035160969, 866723035190966",
        laenuSumma = "10,00 EUR",
        lepingutasu = "1,00 EUR",
        intress = "3,00 EUR",
        koguSumma = "14,00 EUR",
        viivis = "0,30 EUR",
        trahv = "35,00 EUR",
    } = contractData;

    doc.fontSize(12);

    doc.text(`${firmaNimi}`, { align: "left" });
    doc.text(`${firmaAadress}`);
    doc.text(`Lepingu number: ${lepingNumber}`);
    doc.text(`Kuupäev: ${kuupaev}`);
    doc.moveDown();

    doc.text(`1. ${firmaNimi} (edaspidi laenuandja) ${kuupaev} sõlmivad lepingu koos: ${klientNimi} (edaspidi laenusaaja); isikukood ${klientIsikukood}; elukoht ${klientAadress}; dokumendi number ${dokument}; tel. ${telefon}.`);
    doc.text(`2. Laenu tagastamine kokkuleppe põhjal ${tagastusKuupaev}.`);
    doc.text(`3. Laenusaaja annab laenuandjale pandiks "${pandiNimetus}" (${pandiKirjeldus}).`);
    doc.text(`4. Laenuandja annab laenusaajale laenu summas ${laenuSumma}. Lepingu sõlmimistasu ${lepingutasu}.`);
    doc.text(`5. Laenu kasutamise eest arvutatakse minimaalse intressi suuruses ${intress}, või 1.2% päevas.`);
    doc.text(`6. Laenusaaja kohustab tagastama laenuandjale laenu summa, lepingu sõlmimistasu ja intressi suuruses ${koguSumma}.`);
    doc.text(`7. Juhul, kui laenusaaja ei tasu laenuandjale summat mis vastab 6.punktile, määratu ajaks, mis vastab 2. punktile, laenusaaja kohustab penni tasuma suuruses 3% päevas summast, millest räägiti 4.punktis, mis kohustab ${viivis}.`);
    doc.text(`8. Juhul, kui laenusaaja ei tagasta summat, laenu protsent või pennid seitsme päeva jooksul pärast määratud kuupäeva 2.punktis, laenuandja on õiguses laenuasja realiseerima.`);
    doc.text(`9. Kui selgitatakse välja, et laenusaaja tõi varastatud asja pandiks, blokeeritud mobiiltelefoni või defektiga asja ja seda selgitati välja pärast lepingu sõlmimist, laenuandja annab kliendile pretensiooni. Juhul, kui laenusaaja ei reageeri nagu ette nähtud, laenuandja annab vastava hoidmise avalduse Eesti Vabariigi võimuorganitesse.`);
    doc.text(`10. Trahv lepingu eest 9. punkti juhul koostab ${trahv}.`);
    doc.text(`11. Lepingu sõlmimisega laenusaaja kinnitab, et võimaldatav kaup, millest räägiti 3.punktis, saab tema omandiks ja asub korras seisukorras.`);
    doc.text(`12. Leping on koostatud kahes eksemplaris külgede allkirjaga, 1.eksemplar antakse laenuandjale, 2. eksemplar antakse laenusaajale. Laenuandja tagastab garantii pandi (3. Punkt) laenusaajale pärast raha tagastamist.`);
    doc.text(`13. Leping on kehtiv tema allakirjutamise momendist, laenusaaja oma allkirjaga kinnitab, et pandisumma on saadud.`);
    doc.moveDown();

    doc.text(`Laenusaaja ............................................................... (allkiri)`);
    doc.text(`Firma esindaja ...................................................... (allkiri)`);
    doc.moveDown();

    doc.text(`Täidetakse laenu tagastamisel`);
    doc.text(`Laen tagastatakse (kuupäev) .......................................... summas .........................................`);
    doc.text(`Käesoleva lepinguga kinnitan, et panditud asi, ettenäidatud lepingu 3.punktis sain.`);
    doc.text(`Laenusaaja ............................................................... (allkiri)`);
    doc.text(`Volitus: ............................................................................`);
    doc.moveDown();

    doc.text(`${firmaNimi}`);
    doc.text(`reg.nr. 11335488`);
    doc.text(`Kontor: ${firmaAadress}`);
    doc.text(`Tel. 53 717 141`);
    doc.text(`KMKR NR.: EE10148592`);

    doc.end();
}

module.exports = generateContractPdf;
