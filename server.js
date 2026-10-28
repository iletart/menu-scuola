
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/menu", async (req, res) => {
  const data = req.query.date;

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return res.status(400).json({
      error: "Specifica una data nel formato YYYY-MM-DD"
    });
  }

  try {
    const url =
      `https://www.milanoristorazione.it/site-api/menu-day?site=U003128&date=${data}`;

    const risposta = await fetch(url);

    if (!risposta.ok) {
      return res.status(502).json({
        error: `Milano Ristorazione ha risposto con HTTP ${risposta.status}`
      });
    }

    const menu = await risposta.json();
    res.json(menu);
  } catch (errore) {
    console.error(errore);
    res.status(502).json({
      error: "Impossibile raggiungere Milano Ristorazione"
    });
  }
});

app.get("/", (req, res) => {
  res.send("Servizio Menu Scuola attivo");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
