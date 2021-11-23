const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS policy
const origin = process.env.NODE_ENV == "production" ? "http://localhost:8080" : "https://gallerme.github.io/";
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.get('/hello', (req, res) => {
    res.send('Hello World from server!');
});

app.listen(process.env.PORT || 5000);
