const serviceUtil = require("../util/service-utils");
const artDao = require("../daos/art-dao");
const colorDao = require("../daos/color-dao");
const userDao = require("../daos/user-dao");

const signup = (req, res) => {
    const bodyUser = req.body;
    if (!bodyUser.username || !bodyUser.password || !bodyUser.email) {
        res.sendStatus(400);
        return;
    }
    // signup always defaults to USER - can be updated to ADMIN using admin endpoints.
    bodyUser.role = "USER";
    bodyUser.salt = serviceUtil.generateSalt();
    bodyUser.password = serviceUtil.hashPassword(bodyUser.password, bodyUser.salt);

    userDao.createUser(bodyUser)
    .then(user => {
        req.session.user = user;
        serviceUtil.success(res, user);
    })
    .catch(e => {
        // sending 403 because we probably ran into duplicate username or email
        console.error(e.stack);
        res.sendStatus(403);
    });
}

const login = (req, res) => {
    const bodyUser = req.body;
    if (!bodyUser.username || !bodyUser.password) {
        res.sendStatus(400);
    }

    userDao.validateLogin(bodyUser)
    .then(user => {
        if (user) {
            req.session.user = user;
            serviceUtil.success(res, user);
        } else {
            // incorrect username or password
            res.sendStatus(403);
        }
    })
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const logout = (req, res) => {
    req.session.destroy();
    serviceUtil.successOnly(res);
}

const currentUser = (req, res) => {
    if (!serviceUtil.isLoggedIn(req)) {
        serviceUtil.fail(res, "Not Logged In");
    } else {
        serviceUtil.success(res, req.session.user)
    }
}

const accountColors = (req, res) => {
    if (!serviceUtil.isLoggedIn(req)) {
        serviceUtil.success(res, [])
        return;
    }
    colorDao.findColorsByUserId(req.session.user.id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

const accountArt = (req, res) => {
    if (!serviceUtil.isLoggedIn(req)) {
        serviceUtil.success(res, [])
        return;
    }
    artDao.findArtByUserId(req.session.user.id)
    .then(result => serviceUtil.success(res, result))
    .catch(e => {
        console.error(e.stack);
        res.sendStatus(500);
    });
}

module.exports = (app) => {
    app.get("/api/account", currentUser);
    app.post("/api/account/signup", signup);
    app.post("/api/account/login", login);
    app.post("/api/account/logout", logout);
    app.get("/api/account/colors", accountColors);
    app.get("/api/account/art", accountArt);
}
