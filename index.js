require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");
const validUrl = require("valid-url");

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

app.post("/api/shorturl", function (req, res) {
  
  const url = req.body.url;
  if(!validUrl.isWebUri(url)) res.json({ error: "invalid url" });
  
  const urlObj = new URL(url);
  dns.lookup(urlObj.hostname, (err, address, family) => {
    if(err) res.json({ error: "invalid url" });
    const short_url = urlMap.size + 1;
    urlMap.set(short_url.toString(), url);
    
    res.json({ original_url: url, short_url });
  });
  
});

app.get("/api/shorturl/:url", function (req, res) {
  const url = urlMap.get(req.params.url);
  res.redirect(url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
