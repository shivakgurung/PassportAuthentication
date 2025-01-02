const express = require("express");
const app = express();
const path = require("path");
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
    console.log("Auth app started");
});

app.get("/", (req, res) => {
    res.sendFile("index.html")
});


