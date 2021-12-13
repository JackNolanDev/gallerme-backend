const express = require('express');
const session = require('express-session')

const isProd = process.env.NODE_ENV === "production";

// INIT EXPRESS
const app = express();

// CORS policy
const origin = isProd ? process.env.WEBSITE_URL : "http://localhost:8080";
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if (isProd) {
    // makes cookies work on heroku, I guess
    app.enable("trust proxy");
}


// INIT SESSION
const secret = isProd ? process.env.SESSION_SECRET : "development secret";
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret,
    proxy: true,
    cookie: {
        secure: isProd ? true : false
    }
   }));

app.get('/ping', (req, res) => {
    res.send('pong');
});

require("./services/account-service")(app);
require("./services/art-service")(app);
require("./services/color-service")(app)
require("./services/user-service")(app);

app.listen(process.env.PORT || 5000);
