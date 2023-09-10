require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const urlMap = new Map();
const urlMapSize = urlMap.size;

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  url = url.toString();

  dns.lookup(url, function (err, address, family) {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      urlMap.set(urlMapSize, url);
      res.json({ original_url: url, short_url: urlMapSize });
    }
  });
});

app.get("/api/shorturl/:short_url", function (req, res) {
  const url = urlMap.get(req.params.short_url);
  if(!url) res.json({ error: "invalid url" });
  res.redirect(url); 
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
